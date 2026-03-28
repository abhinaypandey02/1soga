"use client";

import { useRouter } from "next/navigation";
import { useAuthMutation } from "naystack/graphql/client";
import { CREATE_ORDER } from "@/gql/mutations";

type LineItem = {
  skuId: string;
  quantity: number;
};

export function useCheckout(onSuccess?: () => void) {
  const router = useRouter();
  const [createOrder, { loading }] = useAuthMutation(CREATE_ORDER);

  const checkout = async (lineItems: LineItem[], description: string) => {
    const response = await createOrder({ lineItems });
    const orderData = response.data?.createOrder;
    if (!orderData) throw new Error("Failed to create order");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "1SOGA",
      description,
      order_id: orderData.orderId,
      one_click_checkout: true,
      show_coupons:false,
      handler: () => {
        router.push(`/account/orders/${orderData.id}`);
        onSuccess?.();
      },
      prefill: {
        email: orderData.user_email,
        contact: orderData.user_phone,
      },
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
