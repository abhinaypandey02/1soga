"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToken } from "naystack/auth/client";
import { useCart } from "@/lib/cart/cart-context";
import { useCheckout } from "@/lib/checkout/use-checkout";
import products from "@/data/products";
import AuthModal from "@/app/components/auth-modal";
import CharityCallout from "@/app/components/charity-callout";
import { Trash } from "@phosphor-icons/react";

function getProductInfo(skuId: string) {
  const product = products.find((p) => p.variants.some((v) => v.sku === skuId));
  if (!product) return null;
  const variant = product.variants.find((v) => v.sku === skuId)!;
  const price = variant.price ?? product.price;
  const costPrice = variant.costPrice ?? product.costPrice;
  const image = variant.image ?? product.image;
  const optionLabel = variant.options.map((o) => o.value).join(" / ");
  return { name: product.name, price, costPrice, image, optionLabel };
}

export default function CheckoutPage() {
  const token = useToken();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showAuth, setShowAuth] = useState(false);

  const { checkout, loading } = useCheckout(() => {
    clearCart();
    alert("Payment successful!");
  });

  const lineItems = items.map((item) => {
    const info = getProductInfo(item.skuId);
    return { ...item, info };
  }).filter((item) => item.info);

  const total = lineItems.reduce(
    (sum, item) => sum + (item.info!.price * item.quantity),
    0
  );
  const totalCharity = lineItems.reduce(
    (sum, item) => sum + ((item.info!.price - item.info!.costPrice) * item.quantity),
    0
  );

  const handleCheckout = async () => {
    if (!token) {
      setShowAuth(true);
      return;
    }
    try {
      await checkout(
        items.map((i) => ({ skuId: i.skuId, quantity: i.quantity })),
        `${lineItems.length} item(s)`
      );
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (lineItems.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-[var(--foreground)]">
          Your Cart is Empty
        </h1>
        <p className="mt-4 font-[family-name:var(--font-body)] text-[var(--muted)]">
          A view this scenic deserves the right accessories. Go explore the drops.
        </p>
        <Link
          href="/#drops"
          className="mt-8 border-2 border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-[var(--foreground)] sm:text-4xl">
        Checkout
      </h1>

      <div className="space-y-4">
        {lineItems.map((item) => (
          <div
            key={item.skuId}
            className="flex gap-4 border-2 border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 border-[var(--border)]">
              <Image
                src={item.info!.image}
                alt={item.info!.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide">
                  {item.info!.name}
                </h3>
                {item.info!.optionLabel && (
                  <p className="font-[family-name:var(--font-body)] text-xs text-[var(--muted)]">
                    {item.info!.optionLabel}
                  </p>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.skuId, item.quantity - 1)}
                    className="border-2 border-[var(--border)] px-2 py-0.5 text-sm font-medium transition-all hover:border-[var(--foreground)]"
                  >
                    -
                  </button>
                  <span className="min-w-[24px] text-center font-[family-name:var(--font-body)] text-sm font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.skuId, item.quantity + 1)}
                    className="border-2 border-[var(--border)] px-2 py-0.5 text-sm font-medium transition-all hover:border-[var(--foreground)]"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.skuId)}
                    className="ml-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    <Trash size={18} />
                  </button>
                </div>
                <span className="font-[family-name:var(--font-display)] text-lg text-[var(--accent)]">
                  &#8377;{(item.info!.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-2 border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex justify-between">
          <span className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
            Total
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent)]">
            &#8377;{total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <CharityCallout amount={totalCharity} />
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 w-full border-2 border-foreground bg-foreground px-6 py-3.5 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "PROCESSING..." : "PAY NOW"}
      </button>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={() => setShowAuth(false)}
      />
    </div>
  );
}
