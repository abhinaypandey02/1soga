import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/app/api/lib/db";
import { OrderTable, LineItemTable } from "@/app/api/(graphql)/order/db";
import { UserTable } from "@/app/api/(graphql)/user/db";
import { razorpay } from "@/app/api/lib/razorpay";
import { createQikinkOrder } from "@/app/api/lib/qikink";
import { eq } from "drizzle-orm";
import products from "@/data/products";

async function markRefunded(orderUid: string) {
  await db.update(OrderTable).set({ paid: false, updatedAt: new Date() }).where(eq(OrderTable.razorpayId, orderUid));
}

async function issueRefund(payment: { id: string; amount: number; fee: number; tax: number }, reason: string, orderUid?: string) {
  try {
    console.log("[Webhook] Issuing refund for payment:", payment.id, "reason:", reason);
    await razorpay.payments.refund(payment.id, {
      amount: payment.amount - payment.fee - payment.tax,
      notes: { reason },
    });
    console.log("[Webhook] Refund issued successfully for payment:", payment.id);
  } catch (refundErr) {
    console.error("[Webhook] Failed to issue refund for:", payment.id, refundErr);
  }
  if (orderUid) {
    await markRefunded(orderUid);
  }
}

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
  console.log("[Webhook] Received event:", event.event);

  if (event.event === "order.paid") {
    const payment = event.payload.payment.entity;
    const razorpayOrder = event.payload.order.entity;
    const orderId: string = razorpayOrder.id;

    const [order] = await db
      .select()
      .from(OrderTable)
      .where(eq(OrderTable.razorpayId, orderId));

    if (!order) {
      await issueRefund(payment, `Order not found: ${orderId}`);
      return NextResponse.json({ status: "refunded" });
    }

    if (order.paid === true) {
      return NextResponse.json({ status: "ignored" });
    }

    await db.update(OrderTable).set({ paid: true, updatedAt: new Date() }).where(eq(OrderTable.id, order.id));

    const customerDetails = razorpayOrder.customer_details || {};
    const shipping = customerDetails.shipping_address || {};

    // Update user details from payment info if missing
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, order.userId));

    if (user) {
      const updates: Partial<{ phone: string; name: string; email: string; updatedAt: Date }> = {};

      if ((payment.contact)) {
        updates.phone = payment.contact;
      }
      if (shipping.name && !user.name && shipping.contact===payment.contact) {
        updates.name = shipping.name;
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
      await issueRefund(payment, `Invalid variant SKU: ${invalidItems.map((i) => i.skuId).join(", ")}`, orderId);
      return NextResponse.json({ status: "refunded" });
    }

    // Build shipping address from order payload
    const customerName = shipping.name || "";
    const nameParts = customerName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const fullLine1 = shipping.line1 || "";
    const extraLine2 = shipping.line2 ? `${shipping.line2}${shipping.landmark ? ` (${shipping.landmark})` : ""}` : "";
    let address1 = fullLine1;
    let address2 = extraLine2;
    if (address1.length > 90) {
      // Split at last space before 90 chars, overflow goes to address2
      const cutIdx = address1.lastIndexOf(" ", 90);
      const splitAt = cutIdx > 0 ? cutIdx : 90;
      const overflow = address1.slice(splitAt).trim();
      address1 = address1.slice(0, splitAt).trim();
      address2 = overflow + (address2 ? `, ${address2}` : "");
    }

    const shippingAddress = {
      first_name: firstName,
      last_name: lastName,
      address1,
      address2,
      phone: shipping.contact || "",
      email: customerDetails.email || payment.email || "",
      city: shipping.city || "",
      zip: shipping.zipcode || "",
      province: shipping.state || "",
      country_code: shipping.country?.toUpperCase() || "IN",
    };
    try {
      await createQikinkOrder(order.id, order.amount, lineItems, shippingAddress);
    } catch (err) {
      console.error((err as Error).message)
      await issueRefund(payment, "Qikink order creation failed", orderId);
    }
  }

  if (event.event === "payment.failed" || event.event === "payment.dispute.lost") {
    const payment = event.payload.payment.entity;
    await markRefunded(payment.order_id);
  }

  return NextResponse.json({ status: "ok" });
}
