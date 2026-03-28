"use client";

import Image from "next/image";
import Link from "next/link";
import products from "@/data/products";
import { Product } from "@/data/types";
import { useMemo } from "react";

function getPriceDisplay(product: Product): string {
  const prices = product.variants
    .map((v) => v.price ?? product.price)
    .filter((p) => p !== undefined);
  if (prices.length === 0) return `₹${product.price.toFixed(2)}`;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `₹${min.toFixed(2)}`;
  return `from ₹${min.toFixed(2)}`;
}

function getRandomProducts(excludeId: string, count: number): Product[] {
  const others = products.filter((p) => p.id !== excludeId);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function YouMayAlsoLike({ currentProductId }: { currentProductId: string }) {
  const suggestions = useMemo(() => getRandomProducts(currentProductId, 4), [currentProductId]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16">
      <div className="mb-6 sm:mb-8">
        <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs">
          More From The Collection
        </span>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--foreground)] sm:text-4xl">
          YOU MAY ALSO LIKE
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {suggestions.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}/${product.variants[0].slug}`}
            className="product-card group border-2 border-[var(--border)] bg-[var(--surface)]"
          >
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="product-image object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--foreground)]/0 transition-all duration-300 group-hover:bg-[var(--foreground)]/60">
                <span className="translate-y-4 font-[family-name:var(--font-body)] text-sm font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Get This
                </span>
              </div>
            </div>

            <div className="border-t-2 border-[var(--border)] p-3 transition-colors group-hover:border-[var(--accent)] sm:p-4">
              <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wide text-[var(--foreground)] sm:text-sm">
                {product.name}
              </h3>
              <span className="mt-1 block font-[family-name:var(--font-display)] text-lg text-[var(--accent)] sm:text-xl">
                {getPriceDisplay(product)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
