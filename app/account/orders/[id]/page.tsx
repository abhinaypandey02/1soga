import getOrder from "@/app/api/(graphql)/order/resolvers/get-order";
import statusField from "@/app/api/(graphql)/order/resolvers/status-field";
import {Injector} from "naystack/graphql";
import OrderDetailClient from "./order-detail-client";
import {notFound} from "next/navigation";
import { getSEO } from "@/lib/seo";

export const metadata = getSEO("Order Details", "View the details of your ONE SOGA order.");

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Injector
      fetch={async () => {
        const { id } = await params;
        const rawOrder = await getOrder.authCall(parseInt(id));
        if(!rawOrder) notFound();
        return { ...rawOrder, status: await statusField.call(rawOrder) };
      }}
      Component={OrderDetailClient}
    />
  );
}
