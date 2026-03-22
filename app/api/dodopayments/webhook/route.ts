import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/app/api/lib/db";
import { OrderTable, LineItemTable } from "@/app/api/(graphql)/order/db";
import { ShippingAddressTable } from "@/app/api/(graphql)/shipping-address/db";
import { dodo } from "@/app/api/lib/dodopayments";
import { createQikinkOrder } from "@/app/api/lib/qikink";
import { eq } from "drizzle-orm";
import products from "@/data/products";

function verifyWebhookSignature(
  body: string,
  webhookId: string,
  timestamp: string,
  signature: string
): boolean {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET!;
  // Standard Webhooks: secret is base64-encoded, may have "whsec_" prefix
  const secretBytes = Buffer.from(
    secret.startsWith("whsec_") ? secret.slice(6) : secret,
    "base64"
  );
  const signedContent = `${webhookId}.${timestamp}.${body}`;
  const expected = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  // Signature header may contain multiple signatures separated by spaces
  const signatures = signature.split(" ");
  return signatures.some((sig) => {
    const sigValue = sig.startsWith("v1,") ? sig.slice(3) : sig;
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(sigValue)
      );
    } catch {
      return false;
    }
  });
}

export async function POST(req: NextRequest) {
  console.log("[DodoWebhook] Received webhook request");

  const body = await req.text();
  const webhookId = req.headers.get("webhook-id");
  const webhookTimestamp = req.headers.get("webhook-timestamp");
  const webhookSignature = req.headers.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    console.error("[DodoWebhook] Missing webhook headers");
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  // Verify timestamp is within 5 minutes
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(webhookTimestamp, 10);
  if (Math.abs(now - ts) > 300) {
    console.error("[DodoWebhook] Timestamp too old or too new");
    return NextResponse.json({ error: "Invalid timestamp" }, { status: 400 });
  }

  if (
    !verifyWebhookSignature(body, webhookId, webhookTimestamp, webhookSignature)
  ) {
    console.error("[DodoWebhook] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  console.log("[DodoWebhook] Signature verified");

  const event = JSON.parse(body);
  console.log("[DodoWebhook] Event type:", event.event_type);

  if (event.event_type === "payment.succeeded") {
    const data = event.data;
    const paymentId: string = data.payment_id;
    const orderId = data.metadata?.order_id;

    if (!orderId) {
      console.error("[DodoWebhook] No order_id in metadata");
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    console.log(
      "[DodoWebhook] Processing payment.succeeded for order:",
      orderId,
      "payment:",
      paymentId
    );

    // Mark order as paid
    const [order] = await db
      .update(OrderTable)
      .set({ paid: true, uid: paymentId, updatedAt: new Date() })
      .where(eq(OrderTable.id, parseInt(orderId, 10)))
      .returning();

    if (!order) {
      console.error("[DodoWebhook] Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.log("[DodoWebhook] Order marked as paid, id:", order.id);

    // Fetch line items
    const lineItems = await db
      .select()
      .from(LineItemTable)
      .where(eq(LineItemTable.orderId, order.id));
    console.log("[DodoWebhook] Found", lineItems.length, "line items");

    // Validate SKUs
    const invalidItems = lineItems.filter((item) => {
      return !products.some((p) =>
        p.variants.some((v) => v.sku === item.skuId)
      );
    });

    if (invalidItems.length > 0) {
      console.error(
        "[DodoWebhook] Invalid variant SKUs:",
        invalidItems.map((i) => i.skuId)
      );
      try {
        await dodo.refunds.create({
          payment_id: paymentId,
          reason: `Invalid variant SKU: ${invalidItems.map((i) => i.skuId).join(", ")}`,
        });
        console.log("[DodoWebhook] Refund issued for invalid SKUs");
      } catch (err) {
        console.error("[DodoWebhook] Failed to issue refund:", err);
      }
      return NextResponse.json({ status: "refunded" });
    }

    // Fetch shipping address from our DB
    let shippingAddress = null;
    if (order.shippingAddressId) {
      const [addr] = await db
        .select()
        .from(ShippingAddressTable)
        .where(eq(ShippingAddressTable.id, order.shippingAddressId));
      shippingAddress = addr;
    }

    if (!shippingAddress) {
      console.error("[DodoWebhook] No shipping address for order:", order.id);
      try {
        await dodo.refunds.create({
          payment_id: paymentId,
          reason: "Missing shipping address",
        });
      } catch (err) {
        console.error("[DodoWebhook] Failed to issue refund:", err);
      }
      return NextResponse.json({ status: "refunded" });
    }

    const nameParts = shippingAddress.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      console.log("[DodoWebhook] Creating Qikink fulfillment order...");
      await createQikinkOrder(
        String(order.id),
        order.amount,
        lineItems,
        {
          first_name: firstName,
          last_name: lastName,
          address1: shippingAddress.addressLine1,
          address2: shippingAddress.addressLine2 || "",
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          city: shippingAddress.city,
          zip: shippingAddress.pincode,
          province: shippingAddress.state,
          country_code: "IN",
        }
      );
      console.log("[DodoWebhook] Qikink order created successfully");
    } catch (err) {
      console.error("[DodoWebhook] Failed to create Qikink order:", err);
      try {
        await dodo.refunds.create({
          payment_id: paymentId,
          reason: "Fulfillment order creation failed",
        });
      } catch (refundErr) {
        console.error("[DodoWebhook] Failed to issue refund:", refundErr);
      }
    }
  }

  if (event.event_type === "payment.failed") {
    console.log("[DodoWebhook] Payment failed:", event.data?.payment_id);
  }

  if (event.event_type === "payment.cancelled") {
    console.log("[DodoWebhook] Payment cancelled:", event.data?.payment_id);
  }

  return NextResponse.json({ status: "ok" });
}
