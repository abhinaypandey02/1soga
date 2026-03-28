"use client";

import { useState } from "react";
import { useToken } from "naystack/auth/client";
import Modal from "../../../components/modal";
import AuthModal from "../../../components/auth-modal";
import { useCheckout } from "@/lib/checkout/use-checkout";
import CharityCallout from "@/app/components/charity-callout";

type CheckoutModalProps = {
  productName: string;
  skuId: string;
  amount: number;
  costPrice: number;
  quantity: number;
  onClose: () => void;
};

export default function CheckoutModal({ productName, skuId, amount, costPrice, quantity, onClose }: CheckoutModalProps) {
  const token = useToken();
  const [showAuth, setShowAuth] = useState(!token);

  const total = amount * quantity;
  const totalCharity = (amount - costPrice) * quantity;

  const { checkout, loading } = useCheckout(() => {
    alert("Payment successful!");
    onClose();
  });

  const handleCheckout = async () => {
    try {
      await checkout(
        [{ skuId, quantity }],
        productName
      );
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
      <p className="mb-4 font-[family-name:var(--font-display)] text-2xl text-[var(--accent)]">
        &#8377;{total.toFixed(2)}
      </p>
      <div className="mb-6">
        <CharityCallout amount={totalCharity} />
      </div>
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
