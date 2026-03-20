"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Product, Variant } from "../../types";
import CheckoutModal from "./checkout-modal";

function getOptionValues(variants: Variant[], type: string): string[] {
  const seen = new Set<string>();
  const values: string[] = [];
  for (const v of variants) {
    const opt = v.options.find((o) => o.type === type);
    if (opt && !seen.has(opt.value)) {
      seen.add(opt.value);
      values.push(opt.value);
    }
  }
  return values;
}

function findVariant(
  variants: Variant[],
  selected: Record<string, string>
): Variant | undefined {
  return variants.find((v) =>
    Object.entries(selected).every(([type, value]) =>
      v.options.some((o) => o.type === type && o.value === value)
    )
  );
}

function isOptionAvailable(
  variants: Variant[],
  selected: Record<string, string>,
  type: string,
  value: string
): boolean {
  const otherSelections = Object.entries(selected).filter(
    ([t]) => t !== type
  );
  return variants.some((v) => {
    const hasValue = v.options.some(
      (o) => o.type === type && o.value === value
    );
    const matchesOthers = otherSelections.every(([t, val]) =>
      v.options.some((o) => o.type === t && o.value === val)
    );
    return hasValue && matchesOthers;
  });
}

function OptionButton({ selected, disabled, onClick, children }: {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border-2 px-4 py-2.5 text-sm font-medium uppercase tracking-wider transition-all duration-200 sm:py-2 ${
        selected
          ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
          : disabled
            ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through"
            : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductPageClient({ data, loading }: { data?:{
  product: Product;
  variant ? : string
}, loading: boolean
}) {
  const defaultSelections = useMemo(() => {
    const selections: Record<string, string> = {};
    const initialVariant = data?.variant
      ? data.product.variants.find((v) => v.sku === data.variant)
      : undefined;
    const source = initialVariant ?? data?.product.variants[0];
    if (source) {
      for (const opt of source.options) {
        selections[opt.type] = opt.value;
      }
    }
    return selections;
  }, [data]);

  const [selected, setSelected] = useState<Record<string, string>>(
    defaultSelections
  );

  const matchedVariant = findVariant(data?.product.variants||[], selected);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (matchedVariant) {
      url.searchParams.set("variant", matchedVariant.sku);
    } else {
      url.searchParams.delete("variant");
    }
    window.history.replaceState({}, "", url.toString());
  }, [matchedVariant]);

  const displayPrice = matchedVariant?.price ?? data?.product.price;
  const displayImage = matchedVariant?.image ?? data?.product.image;
  const costPrice = matchedVariant?.costPrice ?? data?.product.costPrice;
  const profit = (displayPrice||0) - (costPrice||0);

  const featuredVariants = useMemo(
    () => data?.product.variants.filter((v) => v.featured && v.image)||[],
    [data]
  );

  const handleSelectVariant = (variant: Variant) => {
    const newSelected: Record<string, string> = {};
    for (const opt of variant.options) {
      newSelected[opt.type] = opt.value;
    }
    setSelected((prev) => ({ ...prev, ...newSelected }));
  };

  const handleSelect = (type: string, value: string) => {
    setSelected((prev) => ({ ...prev, [type]: value }));
  };

  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleBuy = () => {
    if (!matchedVariant) return;
    setShowCheckout(true);
  };

  const isLoading = loading || !data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
      <div>
        <div className="product-image relative aspect-square overflow-hidden border-2 border-[var(--border)]">
          {isLoading ? (
            <div className="h-full w-full animate-pulse bg-[var(--border)]" />
          ) : (
            <Image
              src={displayImage||""}
              alt={data?.product.name||""}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>

        <div className="mt-3 flex gap-2">
          {isLoading ? (
            [1, 2].map((i) => (
              <div key={i} className="h-16 w-16 animate-pulse border-2 border-[var(--border)] bg-[var(--border)]" />
            ))
          ) : (
            featuredVariants.map((v) => {
              const isActive = matchedVariant?.sku === v.sku ||
                (v.image && displayImage === v.image);
              return (
                <button
                  key={v.sku}
                  onClick={() => handleSelectVariant(v)}
                  className={`relative h-16 w-16 overflow-hidden border-2 transition-all duration-200 ${
                    isActive
                      ? "border-[var(--accent)]"
                      : "border-[var(--border)] hover:border-[var(--foreground)]"
                  }`}
                >
                  <Image
                    src={v.image!}
                    alt={v.options.map((o) => o.value).join(" ")}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        {isLoading ? (
          <div className="h-10 w-64 animate-pulse rounded bg-[var(--border)] sm:h-12" />
        ) : (
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-[var(--foreground)] sm:text-5xl">
            {data?.product.name}
          </h1>
        )}

        {isLoading ? (
          <div className="mt-3 h-8 w-32 animate-pulse rounded bg-[var(--border)]" />
        ) : (
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--accent)] sm:text-3xl">
            &#8377;{displayPrice?.toFixed(2)||0}
          </p>
        )}

        {isLoading ? (
          <div className="mt-6 animate-pulse space-y-2">
            <div className="h-4 w-full rounded bg-[var(--border)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--border)]" />
          </div>
        ) : (
          <p className="mt-6 font-[family-name:var(--font-body)] leading-relaxed text-[var(--muted)]">
            {data?.product.description}
          </p>
        )}

        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="mt-6 animate-pulse">
                <div className="mb-2 h-3 w-16 rounded bg-[var(--border)]" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-10 w-16 rounded border-2 border-[var(--border)] bg-[var(--border)]" />
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          data?.product.optionTypes.map((type) => {
            const values = getOptionValues(data?.product.variants||[], type);
            return (
              <div key={type} className="mt-6">
                <label className="mb-2 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                  {type}
                </label>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const isSelected = selected[type] === value;
                    const available = isOptionAvailable(
                      data?.product.variants,
                      selected,
                      type,
                      value
                    );
                    return (
                      <OptionButton
                        key={value}
                        onClick={() => handleSelect(type, value)}
                        disabled={!available}
                        selected={isSelected}
                      >
                        {value}
                      </OptionButton>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        <div className="mt-6">
          <label className="mb-2 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
           Quantity
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isLoading || quantity <= 1}
            >
              -
            </OptionButton>
            <OptionButton selected>
              {quantity}
            </OptionButton>
            <OptionButton
              onClick={() => setQuantity((q) => q + 1)}
              disabled={isLoading}
            >
              +
            </OptionButton>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 h-4 w-48 animate-pulse rounded bg-[var(--border)]" />
        ) : (
          <p className="mt-8 font-[family-name:var(--font-body)] text-sm text-[var(--muted)]">
            100% of the profit{" "}
            <span className="font-semibold text-[var(--accent)]">
              (&#8377;{(profit * quantity).toFixed(2)})
            </span>{" "}
            goes into charities across SOGA
          </p>
        )}

        <button
          onClick={handleBuy}
          disabled={isLoading || !matchedVariant}
          className="mt-8 w-full border-2 border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3.5 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-3"
        >
          GET THIS
        </button>
      </div>

      {showCheckout && matchedVariant&&data&&displayPrice && (
        <CheckoutModal
          productId={data.product.id}
          productName={data.product.name}
          skuId={matchedVariant.sku}
          amount={displayPrice}
          quantity={quantity}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
    </div>
  );
}
