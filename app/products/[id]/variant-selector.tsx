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

export default function VariantSelector({ product, initialSku }: { product: Product; initialSku?: string }) {
  const defaultSelections = useMemo(() => {
    const selections: Record<string, string> = {};
    const initialVariant = initialSku
      ? product.variants.find((v) => v.sku === initialSku)
      : undefined;
    const source = initialVariant ?? product.variants[0];
    if (source) {
      for (const opt of source.options) {
        selections[opt.type] = opt.value;
      }
    }
    return selections;
  }, [product, initialSku]);

  const [selected, setSelected] = useState<Record<string, string>>(
    defaultSelections
  );

  const matchedVariant = findVariant(product.variants, selected);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (matchedVariant) {
      url.searchParams.set("variant", matchedVariant.sku);
    } else {
      url.searchParams.delete("variant");
    }
    window.history.replaceState({}, "", url.toString());
  }, [matchedVariant]);

  const displayPrice = matchedVariant?.price ?? product.price;
  const displayImage = matchedVariant?.image ?? product.image;
  const costPrice = matchedVariant?.costPrice ?? product.costPrice;
  const profit = displayPrice - costPrice;

  const featuredVariants = useMemo(
    () => product.variants.filter((v) => v.featured && v.image),
    [product]
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

  return (
    <>
      <div>
        <div className="product-image relative aspect-square overflow-hidden border-2 border-[var(--border)]">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {featuredVariants.length > 0 && (
          <div className="mt-3 flex gap-2">
            {featuredVariants.map((v) => {
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
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-[var(--foreground)] sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--accent)] sm:text-3xl">
          &#8377;{displayPrice.toFixed(2)}
        </p>
        <p className="mt-6 font-[family-name:var(--font-body)] leading-relaxed text-[var(--muted)]">
          {product.description}
        </p>

        {product.optionTypes.map((type) => {
          const values = getOptionValues(product.variants, type);
          return (
            <div key={type} className="mt-6">
              <label className="mb-2 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                {type}
              </label>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const isSelected = selected[type] === value;
                  const available = isOptionAvailable(
                    product.variants,
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
        })}

        <div  className="mt-6">
          <label className="mb-2 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
           Quantity
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </OptionButton>
            <OptionButton selected>
              {quantity}
            </OptionButton>
            <OptionButton
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </OptionButton>
          </div>
        </div>

        <p className="mt-8 font-[family-name:var(--font-body)] text-sm text-[var(--muted)]">
          100% of the profit{" "}
          <span className="font-semibold text-[var(--accent)]">
            (&#8377;{(profit * quantity).toFixed(2)})
          </span>{" "}
          goes into charities across SOGA
        </p>


        <button
          onClick={handleBuy}
          disabled={!matchedVariant}
          className="mt-8 w-full border-2 border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3.5 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-3"
        >
          GET THIS
        </button>
      </div>

      {showCheckout && matchedVariant && (
        <CheckoutModal
          productId={product.id}
          productName={product.name}
          skuId={matchedVariant.sku}
          amount={displayPrice}
          quantity={quantity}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}
