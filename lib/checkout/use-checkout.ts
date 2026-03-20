"use client";

import { useAuthMutation } from "naystack/graphql/client";
import { CREATE_ORDER } from "@/gql/mutations";

type LineItem = {
  productId: string;
  skuId: string;
  quantity: number;
};

export function useCheckout(onSuccess?: () => void) {
  const [createOrder, { loading }] = useAuthMutation(CREATE_ORDER);

  const checkout = async (lineItems: LineItem[], totalAmount: number, description: string) => {
    const response = await createOrder({ lineItems });
    const orderId = response.data?.createOrder;
    if (!orderId) throw new Error("Failed to create order");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      name: "One Soga",
      description,
      order_id: orderId,
      one_click_checkout: true,
      handler: () => {
        onSuccess?.();
      },
      prefill: {},
      theme: { color: "#FF2D20" },
    };

    // eslint-disable-next-line
    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (res: { error: string }) => {
      console.error("Payment failed:", res.error);
      alert("Payment failed. Please try again.");
    });
    rzp.open();
  };

  return { checkout, loading };
}
