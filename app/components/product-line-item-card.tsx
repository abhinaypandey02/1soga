"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type ProductLineItemCardProps = {
  name: string;
  image: string;
  quantity: number;
  optionLabel?: string;
  totalPrice: string;
  charityText?: string;
  href?: string;
  controls?: ReactNode;
};

export default function ProductLineItemCard({
  name,
  image,
  quantity,
  optionLabel,
  totalPrice,
  charityText,
  href,
  controls,
}: ProductLineItemCardProps) {
  const card = (
    <div className="flex gap-4 border-2 border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
      {image && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden border-2 border-[var(--border)] bg-neutral-100 sm:h-24 sm:w-24">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-base uppercase tracking-wide text-[var(--foreground)] sm:text-lg">
            {name}
          </p>
          {optionLabel && (
            <p className="font-[family-name:var(--font-body)] text-xs text-[var(--muted)]">
              {optionLabel}
            </p>
          )}
          {!controls && (
            <p className="mt-0.5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-wider text-[var(--muted)] sm:text-xs">
              Qty: {quantity}
            </p>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          {controls ?? <div />}
          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-lg text-[var(--foreground)]">
              {totalPrice}
            </p>
            {charityText && (
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--accent)]">
                {charityText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="group block transition-colors hover:border-[var(--accent)]"
    >
      {card}
    </Link>
  );
}
