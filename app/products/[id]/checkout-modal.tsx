"use client";

import { useState } from "react";
import { useToken } from "naystack/auth/client";
import { useAuthMutation } from "naystack/graphql/client";
import { CREATE_ORDER } from "@/gql/mutations";
import Modal from "../../components/modal";
import AuthModal from "../../components/auth-modal";

type CheckoutModalProps = {
  productId: string;
  productName: string;
  skuId: string;
  amount: number;
  quantity: number;
  onClose: () => void;
};

export default function CheckoutModal({ productId, productName, skuId, amount, quantity, onClose }: CheckoutModalProps) {
  const token = useToken();
  const [createOrder, { loading }] = useAuthMutation(CREATE_ORDER);
  const [showAuth, setShowAuth] = useState(!token);

  const handleCheckout = async () => {
    try {
      const response = await createOrder({
            lineItems: [{ productId, skuId, quantity }],
      });
      const orderId = response.data?.createOrder;
      if (!orderId) throw new Error("Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * quantity * 100),
        currency: "INR",
        name: "One Soga",
        description: productName,
        order_id: orderId,
        one_click_checkout:true,
        handler: (res: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          console.log("Payment successful:", res);
          alert("Payment successful!");
          onClose();
        },
        prefill: {},
        theme: { color: "#FF2D20" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (res:{error:string}) => {
        console.error("Payment failed:", res.error);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (showAuth) {
    return (
      <AuthModal
        open
        onClose={onClose}
        onAuth={() => setShowAuth(false)}
      />
    );
  }

  return (
    <Modal open onClose={onClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
          Confirm Order
        </h2>
        <button
          onClick={onClose}
          className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          &#10005;
        </button>
      </div>

      <p className="mb-1 font-[family-name:var(--font-body)] text-[var(--muted)]">
        {productName} &times; {quantity}
      </p>
      <p className="mb-6 font-[family-name:var(--font-display)] text-2xl text-[var(--accent)]">
        &#8377;{(amount * quantity).toFixed(2)}
      </p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full border-2 border-foreground bg-foreground px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "PROCESSING..." : "PAY NOW"}
      </button>
    </Modal>
  );
}
