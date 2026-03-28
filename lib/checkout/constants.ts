export const DELIVERY_FEE = 50; // ₹50 fixed shipping charges
export const GATEWAY_FEE_PERCENT = 3.5; // payment gateway fee percentage (Razorpay max)

export function getCharity(price: number, costPrice: number) {
  return price - costPrice - (GATEWAY_FEE_PERCENT / 100) * price;
}
