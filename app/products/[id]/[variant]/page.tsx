import { Suspense } from "react";
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

  return (
    <>
      <ProductDetails product={product} variant={variant} />
      <Suspense><YouMayAlsoLike currentProductId={product.id} /></Suspense>
    </>
  );
}
