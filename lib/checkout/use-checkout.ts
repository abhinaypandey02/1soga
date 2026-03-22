"use client";

import { useAuthMutation } from "naystack/graphql/client";
import { CREATE_ORDER } from "@/gql/mutations";

type LineItem = {
  skuId: string;
  quantity: number;
};

export type ShippingDetails = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
};

export function useCheckout() {
  const [createOrder, { loading }] = useAuthMutation(CREATE_ORDER);

  const checkout = async (lineItems: LineItem[], shipping: ShippingDetails) => {
    const response = await createOrder({
      lineItems,
      shipping,
    });
    const checkoutUrl = response.data?.createOrder?.checkoutUrl;
    if (!checkoutUrl) throw new Error("Failed to create checkout session");
    return checkoutUrl;
  };

  return { checkout, loading };
}
