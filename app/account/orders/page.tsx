import Link from "next/link";
import getOrders from "@/app/api/(graphql)/order/resolvers/get-orders";
import statusField from "@/app/api/(graphql)/order/resolvers/status-field";
import {FieldResponseType, Injector, QueryResponseType} from "naystack/graphql";
import {formatPrice, findProductBySku, formatDate} from "./utils";
import { getSEO } from "@/lib/seo";

export const metadata = getSEO("My Orders", "Track your ONE SOGA orders. Every purchase is a declaration that Soga raised you right.");

export default async function OrdersPage() {
  return <Injector fetch={async ()=>{
    const ordersWithoutStatus = await getOrders.authCall();
    return Promise.all(ordersWithoutStatus.map(async (o)=>({...o, status:await statusField.call(o)})));
  }} Component={OrdersPageClient}/>
}

function OrdersPageClient({data:orders,loading}:{
  data?:(QueryResponseType<typeof getOrders>[number]&{status:FieldResponseType<typeof statusField>})[],
  loading:boolean
}){
  return (
    <div className="space-y-4">
      {loading && (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border-2 border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-[var(--border)]" />
                  <div className="h-3 w-32 rounded bg-[var(--border)]" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-6 w-20 rounded bg-[var(--border)]" />
                  <div className="h-7 w-16 rounded bg-[var(--border)]" />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      {orders&&orders.length === 0 &&!loading&& (
        <div className="border-2 border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--muted)]">
            No orders yet. The Vaishali skyline is free, but the merch isn&apos;t. Start shopping.
          </p>
        </div>
      )}
      {orders?.map((order) => {
        const firstItem = order.lineItems[0];
        const firstItemName = firstItem ? findProductBySku(firstItem.skuId).name : "";
        const firstItemQty = firstItem?.quantity ?? 0;
        const remainingItems = order.lineItems.slice(1).reduce((sum, li) => sum + li.quantity, 0);
        const summary = firstItem
          ? `${firstItemQty} ${firstItemName}${remainingItems > 0 ? ` & ${remainingItems} more` : ""}`
          : "No items";

        return (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="group block border-2 border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--accent)] sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-[family-name:var(--font-body)] text-sm font-bold text-[var(--foreground)]">
                  {summary}
                </p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[var(--muted)]">
                  {formatDate(order.createdAt)} &middot; {order.id}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-display)] text-xl text-[var(--foreground)]">
                  {formatPrice(order.amount)}
                </span>
                <span
                  className={`inline-block border-2 px-3 py-1 font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs ${
                    order.status !== "Pending"
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--muted)] text-[var(--muted)]"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
