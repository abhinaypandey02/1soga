export enum OrderStatus {
  PaymentPending = "Payment Pending",
  Refunded = "Refunded",
  Processing = "Processing",
  Placed = "Placed",
  Shipped = "Shipped",
  Delivered = "Delivered",
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, { border: string; text: string; bg?: string }> = {
  [OrderStatus.PaymentPending]: { border: "border-yellow-500", text: "text-yellow-500" },
  [OrderStatus.Refunded]: { border: "border-red-500", text: "text-red-500" },
  [OrderStatus.Processing]: { border: "border-[var(--muted)]", text: "text-[var(--muted)]" },
  [OrderStatus.Placed]: { border: "border-[var(--accent)]", text: "text-white", bg: "bg-[var(--accent)]" },
  [OrderStatus.Shipped]: { border: "border-[var(--accent)]", text: "text-white", bg: "bg-[var(--accent)]" },
  [OrderStatus.Delivered]: { border: "border-[var(--accent)]", text: "text-white", bg: "bg-[var(--accent)]" },
};
