"use client";

import Link from "next/link";
import Modal from "./modal";

type CartAddedModalProps = {
  productName: string;
  quantity: number;
  amount: number;
  onClose: () => void;
};

export default function CartAddedModal({ productName, quantity, amount, onClose }: CartAddedModalProps) {
  const subtotal = amount * quantity;

  return (
    <Modal open onClose={onClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
          Added to Cart
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
        &#8377;{subtotal.toFixed(2)}
      </p>

      <Link
        href="/checkout"
        onClick={onClose}
        className="mb-3 block w-full border-2 border-foreground bg-foreground px-6 py-3 text-center font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]"
      >
        Checkout Now
      </Link>
      <button
        onClick={onClose}
        className="w-full border-2 border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--foreground)]"
      >
        Continue Shopping
      </button>
    </Modal>
  );
}
