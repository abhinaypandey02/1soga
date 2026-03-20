import { notFound } from "next/navigation";
import products from "../../../data/products";
import ProductDetails from "./product-details";
import { getSEO } from "@/lib/seo";
import { Metadata } from "next";

export function generateStaticParams() {
  return products.flatMap((product) => (product.variants.map(p=>({
    id: product.id,
    variant: p.sku,
  }))));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; variant?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return getSEO();
  return getSEO({
    title: `${product.name} — Official ONE SOGA Merch`,
    description: product.description,
  });
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

  return <ProductDetails product={product} variant={variant} />;
}
