import { Suspense } from "react";
import Script from "next/script";
import { notFound } from "next/navigation";
import products from "@/data/products";
import ProductDetails from "./product-details";
import YouMayAlsoLike from "@/app/components/you-may-also-like";
import { getSEO } from "@/lib/seo";
import { Metadata } from "next";

export function generateStaticParams() {
  return products.flatMap((product) => (product.variants.map(p=>({
    id: product.id,
    variant: p.slug,
  }))));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; variant?: string }>;
}): Promise<Metadata> {
  const { id, variant } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return getSEO();
  const v = product.variants.find(v=>v.slug === variant);
  if (!v) return getSEO();
  return getSEO(`${product.name} — ${v.options.map(o=>o.value).join(", ")}`, product.description, v.image);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; variant?: string }>;
}) {
  const { id, variant } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const selectedVariant = product.variants.find((v) => v.slug === variant);
  const price = selectedVariant?.price ?? product.price;
  const image = selectedVariant?.image ?? product.image;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name}${selectedVariant ? ` — ${selectedVariant.options.map((o) => o.value).join(", ")}` : ""}`,
    description: product.description,
    image,
    url: `${baseUrl}/products/${product.id}/${selectedVariant?.slug ?? ""}`,
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/products/${product.id}/${selectedVariant?.slug ?? ""}`,
    },
  };

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} variant={variant} />
      <Suspense><YouMayAlsoLike currentProductId={product.id} /></Suspense>
    </>
  );
}
