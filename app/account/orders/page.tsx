import Link from "next/link";
import getOrders from "@/app/api/(graphql)/order/resolvers/get-orders";
import products from "@/app/data/products";
import statusField from "@/app/api/(graphql)/order/resolvers/status-field";

function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

function getProductNameBySku(skuId: string): string {
  for (const product of products) {
    if (product.variants.some((v) => v.sku === skuId)) {
      return product.name;
    }
  }
  return skuId;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function OrdersPage() {
  const ordersWithoutStatus = await getOrders.authCall();
  const orders = await Promise.all(ordersWithoutStatus.map(async (o)=>({...o, status:await statusField.call(o)})));
  return (
    <div className="space-y-4">
      {orders.length === 0 && (
        <div className="border-2 border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--muted)]">
            No orders yet. Start shopping to see your orders here.
          </p>
        </div>
      )}
      {orders.map((order) => {
        const firstItem = order.lineItems[0];
        const firstItemName = firstItem ? getProductNameBySku(firstItem.skuId) : "";
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
