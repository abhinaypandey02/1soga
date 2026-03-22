"use client";

import CheckoutFlowModal from "@/app/components/checkout-flow-modal";

type CheckoutModalProps = {
  skuId: string;
  quantity: number;
  onClose: () => void;
};

export default function CheckoutModal({ skuId, quantity, onClose }: CheckoutModalProps) {
  return (
    <CheckoutFlowModal
      lineItems={[{ skuId, quantity }]}
      onClose={onClose}
    />
  );
}
