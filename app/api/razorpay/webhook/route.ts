import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/app/api/lib/db";
import { OrderTable, LineItemTable } from "@/app/api/(graphql)/order/db";
import { UserTable } from "@/app/api/(graphql)/user/db";
import { razorpay } from "@/app/api/lib/razorpay";
import { createQikinkOrder } from "@/app/api/lib/qikink";
import { eq } from "drizzle-orm";
import products from "@/data/products";

async function issueRefund(paymentId: string, amount: number, reason: string) {
  try {
    console.log("[Webhook] Issuing refund for payment:", paymentId, "reason:", reason);
    await razorpay.payments.refund(paymentId, {
      amount,
      notes: { reason },
    });
    console.log("[Webhook] Refund issued successfully for payment:", paymentId);
  } catch (refundErr) {
    console.error("[Webhook] Failed to issue refund for:", paymentId, refundErr);
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
  console.log("[Webhook] Received Razorpay webhook request");

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  console.log("[Webhook] Verifying signature...");
  if (!signature || !verifySignature(body, signature)) {
    console.error("[Webhook] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  console.log("[Webhook] Signature verified successfully");

  const event = JSON.parse(body);
  console.log("[Webhook] Event type:", event.event);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId: string = payment.order_id;
    console.log("[Webhook] Processing payment.captured for order:", orderId, "payment:", payment.id, "amount:", payment.amount);

    console.log("[Webhook] Marking order as paid...");
    const [order] = await db
      .update(OrderTable)
      .set({ paid: true, updatedAt: new Date() })
      .where(eq(OrderTable.uid, orderId)).returning();

    if (!order) {
      console.error("[Webhook] Order not found in database for uid:", orderId);
      await issueRefund(payment.id, payment.amount, `Order not found: ${orderId}`);
      return NextResponse.json({ status: "refunded" });
    }
    console.log("[Webhook] Order marked as paid, internal id:", order.id, "userId:", order.userId);

    // Fetch Razorpay order details (populated by Magic Checkout)
    console.log("[Webhook] Fetching Razorpay order details...");
    // eslint-disable-next-line
    const razorpayOrder = await razorpay.orders.fetch(orderId) as any;
    const customerDetails = razorpayOrder.customer_details || {};
    const shipping = customerDetails.shipping_address || {};
    console.log("shipping", JSON.stringify(payment,null,2))
    // Update user details from payment info if missing
    console.log("[Webhook] Fetching user details for userId:", order.userId);
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
      if (customerDetails.name && !user.name) {
        updates.name = customerDetails.name;
      }

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date();
        console.log("[Webhook] Updating user details:", Object.keys(updates).filter(k => k !== "updatedAt").join(", "));
        await db
          .update(UserTable)
          .set(updates)
          .where(eq(UserTable.id, order.userId));
        console.log("[Webhook] User details updated");
      } else {
        console.log("[Webhook] No user details to update");
      }
    } else {
      console.warn("[Webhook] User not found for userId:", order.userId);
    }

    // Create Qikink fulfillment order
    console.log("[Webhook] Fetching line items for order:", order.id);
    const lineItems = await db
      .select()
      .from(LineItemTable)
      .where(eq(LineItemTable.orderId, order.id));
    console.log("[Webhook] Found", lineItems.length, "line items:", lineItems.map(i => ({ sku: i.skuId, qty: i.quantity })));

    // Validate all variant SKUs exist in products data
    console.log("[Webhook] Validating variant SKUs...");
    const invalidItems = lineItems.filter((item) => {
      return !products.some((p) =>
        p.variants.some((v) => v.sku === item.skuId)
      );
    });

    if (invalidItems.length > 0) {
      console.error("[Webhook] Invalid variant SKUs found:", invalidItems.map((i) => i.skuId));
      await issueRefund(payment.id, payment.amount, `Invalid variant SKU: ${invalidItems.map((i) => i.skuId).join(", ")}`);
      return NextResponse.json({ status: "refunded" });
    }
    console.log("[Webhook] All variant SKUs valid");

    // Build shipping address from Razorpay order details
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
    console.log("[Webhook] Shipping address:", shippingAddress);

    try {
      console.log("[Webhook] Creating Qikink fulfillment order...");
      await createQikinkOrder(orderId, order.amount, lineItems, shippingAddress);
      console.log("[Webhook] Qikink order created successfully for:", orderId);
    } catch (err) {
      console.error("[Webhook] Failed to create Qikink order for:", orderId, err);
      await issueRefund(payment.id, payment.amount, "Qikink order creation failed");
    }
  }

  console.log("[Webhook] Request processing complete");
  return NextResponse.json({ status: "ok" });
}
