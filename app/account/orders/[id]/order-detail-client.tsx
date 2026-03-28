"use client";

import Link from "next/link";
import {QueryResponseType, FieldResponseType} from "naystack/graphql";
import type getOrder from "@/app/api/(graphql)/order/resolvers/get-order";
import type statusField from "@/app/api/(graphql)/order/resolvers/status-field";
import {formatPrice, findProductBySku} from "../utils";
import CharityCallout from "@/app/components/charity-callout";
import ProductLineItemCard from "@/app/components/product-line-item-card";
import { getCharity } from "@/lib/checkout/constants";
import { OrderStatus, ORDER_STATUS_COLORS } from "@/lib/order-status";

type OrderData = QueryResponseType<typeof getOrder> & { status: FieldResponseType<typeof statusField> };

export default function OrderDetailClient({ data: order, loading }: { data?: OrderData; loading: boolean }) {
  const totalItems = order?.lineItems?.reduce((sum, li) => sum + li.quantity, 0) ?? 0;
  const totalCharity = order?.lineItems?.reduce((sum, li) => sum + getCharity(li.price/100, li.costPrice/100) * li.quantity, 0) ?? 0;

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        <span className="text-[var(--accent)]">&larr;</span>
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="mb-6 border-2 border-[var(--foreground)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {loading ? (
              <>
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-8 w-32 animate-pulse rounded bg-[var(--border)]" />
              </>
            ) : (
              <>
                <p className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                  Order #{order?.id}
                </p>
                <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--foreground)] sm:text-3xl">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </p>
              </>
            )}
          </div>
          {loading || !order ? (
            <div className="h-10 w-40 animate-pulse rounded bg-[var(--border)]" />
          ) : (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span
                className={`inline-block self-start border-2 px-4 py-1.5 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] ${
                  ORDER_STATUS_COLORS[order.status as OrderStatus]?.border ?? ""
                } ${ORDER_STATUS_COLORS[order.status as OrderStatus]?.text ?? ""} ${
                  ORDER_STATUS_COLORS[order.status as OrderStatus]?.bg ?? ""
                }`}
              >
                {order.status}
              </span>
              {order.trackingLink && (
                <a
                  href={order.trackingLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center border-2 border-[var(--foreground)] bg-[var(--foreground)] px-4 py-1.5 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]"
                >
                  Track Order
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3">
        {loading||!order ? (
          [1, 2].map((i) => (
            <div key={i} className="flex animate-pulse gap-4 border-2 border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
              <div className="h-20 w-20 shrink-0 rounded bg-[var(--border)] sm:h-24 sm:w-24" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="h-4 w-36 rounded bg-[var(--border)]" />
                  <div className="mt-2 h-3 w-24 rounded bg-[var(--border)]" />
                </div>
                <div className="h-5 w-20 rounded bg-[var(--border)]" />
              </div>
            </div>
          ))
        ) : (
          order.lineItems.map((li) => {
            const product = findProductBySku(li.skuId);
            const charity = getCharity(li.price/100, li.costPrice/100) * li.quantity;
            const href = product.id ? `/products/${product.id}/${product.slug}` : undefined;
            return (
              <ProductLineItemCard
                key={li.id}
                name={product.name}
                image={product.image}
                quantity={li.quantity}
                optionLabel={product.optionLabel}
                totalPrice={formatPrice(li.price * li.quantity)}
                charityText={charity > 0 ? `₹${charity} to charity` : undefined}
                href={href}
              />
            );
          })
        )}
      </div>

      {/* Order Summary */}
      <div className="mt-6 border-2 border-[var(--foreground)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--foreground)]">
            Total
          </span>
          {loading||!order ? (
            <div className="h-8 w-24 animate-pulse rounded bg-[var(--border)]" />
          ) : (
            <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] sm:text-3xl">
              {formatPrice(order.amount)}
            </span>
          )}
        </div>
      </div>

      {!loading && (
        <div className="mt-4">
          <CharityCallout amount={totalCharity} past />
        </div>
      )}
    </div>
  );
}
