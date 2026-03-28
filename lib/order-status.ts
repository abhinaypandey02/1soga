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
  [OrderStatus.Processing]: { border: "border-orange-500", text: "text-orange-500" },
  [OrderStatus.Placed]: { border: "border-orange-500", text: "text-orange-500" },
  [OrderStatus.Shipped]: { border: "border-blue-500", text: "text-white", bg: "bg-blue-500" },
  [OrderStatus.Delivered]: { border: "border-green-700", text: "text-white", bg: "bg-green-700" },
};
