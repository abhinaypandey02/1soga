import {OrderDB} from "@/app/api/(graphql)/order/db";

const QIKINK_BASE_URL = "https://sandbox.qikink.com/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    ClientId: process.env.QIKINK_CLIENT_ID!,
    Accesstoken: process.env.QIKINK_ACCESS_TOKEN!,
  };
}

export type QikinkShippingAddress = {
  first_name: string;
  last_name?: string;
  address1: string;
  address2?: string;
  phone: string;
  email: string;
  city: string;
  zip: string;
  province: string;
  country_code: string;
};

export type QikinkOrderResponse = {
  order_id: number;
  number: string;
  created_on: string;
  live_date: string;
  status: string;
  shipping_type: string;
  payment_type: string;
  total_order_value: string;
  line_items: {
    sku: string;
    quantity: string;
    price: string;
    designs: {
      design_code: string;
      placement: string;
      height_inches: string;
      width_inches: string;
      design_url: string;
      mockup_url: string | null;
    }[];
  }[];
  shipping: QikinkShippingAddress & {
    awb: number;
    tracking_link: string;
  };
};

export async function createQikinkOrder(
  orderId: string,
  amount: number,
  lineItems: { skuId: string; quantity: number; price: number }[],
  shippingAddress: QikinkShippingAddress
) {
  const response = await fetch(`${QIKINK_BASE_URL}/order/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      order_number: orderId,
      qikink_shipping: "1",
      gateway: "Prepaid",
      total_order_value: String(amount / 100),
      line_items: lineItems.map((item) => ({
        search_from_my_products: 1,
        sku: item.skuId,
        quantity: String(item.quantity),
        price: String(item.price / 100),
      })),
      shipping_address: shippingAddress,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Qikink order creation failed:", text);
    throw new Error(`Qikink API error: ${response.status}`);
  }

  const result = await response.json();
  console.log("Qikink order created:", result);
  return result;
}

export async function getQikinkOrder(orderId: string): Promise<QikinkOrderResponse | null> {
  const response = await fetch(`${QIKINK_BASE_URL}/order?id=${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    console.error("Qikink order fetch failed:", response.status);
    return null;
  }

  const result = await response.json();
  return result;
}
