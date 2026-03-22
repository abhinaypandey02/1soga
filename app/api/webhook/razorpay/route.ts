import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/app/api/lib/db";
import { OrderTable, LineItemTable } from "@/app/api/(graphql)/order/db";
import { UserTable } from "@/app/api/(graphql)/user/db";
import { razorpay } from "@/app/api/lib/razorpay";
import { createQikinkOrder } from "@/app/api/lib/qikink";
import { eq } from "drizzle-orm";
import products from "@/data/products";

function verifySignature(body: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId: string = payment.order_id;


    const [order] =await db
      .update(OrderTable)
      .set({ paid: true, updatedAt: new Date() })
      .where(eq(OrderTable.uid, orderId)).returning();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update user details from payment info if missing
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, order.userId));

    if (user) {
      const updates: Partial<{ phone: string; name: string; email: string; updatedAt: Date }> = {};

      if (!user.phone && payment.contact) {
        updates.phone = payment.contact;
      }
      if (!user.email && payment.email) {
        updates.email = payment.email;
      }
      if (payment.notes?.name && !user.name) {
        updates.name = payment.notes.name;
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date();
        await db
          .update(UserTable)
          .set(updates)
          .where(eq(UserTable.id, order.userId));
      }
    }

    // Create Qikink fulfillment order
    const lineItems = await db
      .select()
      .from(LineItemTable)
      .where(eq(LineItemTable.orderId, order.id));

    // Validate all variant SKUs exist in products data
    const invalidItems = lineItems.filter((item) => {
      return !products.some((p) =>
        p.variants.some((v) => v.sku === item.skuId)
      );
    });

    if (invalidItems.length > 0) {
      console.error("Invalid variant SKUs found:", invalidItems.map((i) => i.skuId));
      try {
        await razorpay.payments.refund(payment.id, {
          amount: payment.amount,
          notes: { reason: `Invalid variant SKU: ${invalidItems.map((i) => i.skuId).join(", ")}` },
        });
        console.log("Refund issued for payment:", payment.id);
      } catch (refundErr) {
        console.error("Failed to issue refund for:", payment.id, refundErr);
      }
      return NextResponse.json({ status: "refunded" });
    }

    // Fetch shipping address from Razorpay order (populated by Magic Checkout)
    // eslint-disable-next-line
    const razorpayOrder = await razorpay.orders.fetch(orderId) as any;
    const customerDetails = razorpayOrder.customer_details || {};
    const shipping = customerDetails.shipping_address || {};
    const customerName = customerDetails.name || "";
    const nameParts = customerName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const shippingAddress = {
      first_name: firstName,
      last_name: lastName,
      address1: shipping.line1 || "",
      address2: shipping.line2 || "",
      phone: customerDetails.contact || "",
      email: customerDetails.email || "",
      city: shipping.city || "",
      zip: shipping.zipcode || "",
      province: shipping.state || "",
      country_code: shipping.country || "IN",
    };

    try {
      await createQikinkOrder(orderId, order.amount, lineItems, shippingAddress);
    } catch (err) {
      console.error("Failed to create Qikink order for:", orderId, err);
      try {
        await razorpay.payments.refund(payment.id, {
          amount: payment.amount,
          notes: { reason: "Qikink order creation failed" },
        });
        console.log("Refund issued for payment:", payment.id);
      } catch (refundErr) {
        console.error("Failed to issue refund for:", payment.id, refundErr);
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
