"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Product, Variant } from "@/data/types";
import CheckoutModal from "./checkout-modal";
import CartAddedModal from "@/app/components/cart-added-modal";
import Modal from "@/app/components/modal";
import Link from "next/link";
import LinkWrapper from "@/components/link-wrapper";
import { useCart } from "@/lib/cart/cart-context";
import CharityCallout from "@/app/components/charity-callout";

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

export default function ProductDetails({ product, variant }: {
  product: Product;
  variant?: string;
}) {
  const selected = useMemo(() => {
    const selections: Record<string, string> = {};
    const initialVariant = variant
      ? product.variants.find((v) => v.slug === decodeURIComponent(variant))
      : undefined;
    const source = initialVariant ?? product.variants[0];
    for (const opt of source.options) {
      selections[opt.type] = opt.value;
    }
    return selections;
  }, [product, variant]);

  const matchedVariant = findVariant(product.variants, selected);

  const displayPrice = matchedVariant?.price ?? product.price;
  const displayImage = matchedVariant?.image ?? product.image;
  const costPrice = matchedVariant?.costPrice ?? product.costPrice;
  const sizeChartLink = matchedVariant?.sizeChartLink;
  const profit = displayPrice - costPrice;

  const featuredVariants = useMemo(
    () => product.variants.filter((v) => v.featured && v.image),
    [product]
  );

  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCartAdded, setShowCartAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { addToCart } = useCart();

  const handleBuy = () => {
    if (!matchedVariant) return;
    setShowCheckout(true);
  };

  const handleAddToCart = () => {
    if (!matchedVariant) return;
    addToCart({ skuId: matchedVariant.sku, quantity });
    setShowCartAdded(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
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

        <div className="mt-3 flex gap-2 flex-wrap">
          {featuredVariants.map((v) => {
            const isActive = matchedVariant?.slug === v.slug ||
              (v.image && displayImage === v.image);
            const url = `/products/${product.id}/${v.slug}`

            return (
                <LinkWrapper className={`relative h-16 w-16 overflow-hidden border-2 transition-all duration-200 ${
                  isActive
                    ? "border-[var(--accent)]"
                    : "border-[var(--border)] hover:border-[var(--foreground)]"
                }`} key={v.slug} href={matchedVariant?url:null} scroll={false}>

                <Image
                  src={v.image!}
                  alt={v.options.map((o) => o.value).join(" ")}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                </LinkWrapper>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-[var(--foreground)] sm:text-5xl">
          {product.name}
        </h1>

        <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--accent)] sm:text-3xl">
          &#8377;{displayPrice.toFixed(2)}
        </p>

        {product.description && (
          <p className="mt-4 font-[family-name:var(--font-body)] leading-relaxed text-[var(--muted)]">
            {product.description}
          </p>
        )}

        {sizeChartLink && (
          <button
            onClick={() => setShowSizeChart(true)}
            className="mt-3 self-start font-[family-name:var(--font-body)] text-sm font-medium text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-dark)]"
          >
            View size chart
          </button>
        )}

        {product.optionTypes.map((type) => {
          const values = getOptionValues(product.variants, type);
          if(values.length<2) return null;
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
                  const variantSlug = findVariant(product.variants, {...selected, [type]:value})?.slug
                  const url = `/products/${product.id}/${variantSlug}`
                  return (
                    <LinkWrapper key={value} href={variantSlug?url:null} scroll={false}>
                      <OptionButton
                        disabled={!available}
                        selected={isSelected}
                      >
                        {value}
                      </OptionButton>
                    </LinkWrapper>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="mt-6">
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

        <div className="mt-8">
          <CharityCallout amount={profit * quantity} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            disabled={!matchedVariant}
            className="w-full border-2 border-[var(--foreground)] bg-[var(--surface)] px-6 py-3.5 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-3"
          >
            Add to Cart
          </button>
        <button
          onClick={handleBuy}
          disabled={!matchedVariant}
            className="w-full border-2 border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3.5 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-3"
        >
            Buy Now
        </button>
        </div>
      </div>

      {showCheckout && matchedVariant && (
        <CheckoutModal
          productName={product.name}
          skuId={matchedVariant.sku}
          amount={displayPrice}
          costPrice={costPrice}
          quantity={quantity}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {showCartAdded && matchedVariant && (
        <CartAddedModal
          productName={product.name}
          quantity={quantity}
          amount={displayPrice}
          onClose={() => setShowCartAdded(false)}
        />
      )}

      {showSizeChart && sizeChartLink && (
        <Modal open onClose={() => setShowSizeChart(false)}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
              Size Chart
            </h2>
            <button
              onClick={() => setShowSizeChart(false)}
              className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              &#10005;
            </button>
          </div>
          <div className="relative w-full">
            <Image
              src={sizeChartLink}
              alt="Size Chart"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </Modal>
      )}
    </div>
    </div>
  );
}
