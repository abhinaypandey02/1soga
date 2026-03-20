import { notFound } from "next/navigation";
import products from "../../data/products";
import VariantSelector from "./variant-selector";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { id } = await params;
  const { variant } = await searchParams;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <VariantSelector product={product} initialSku={variant} />
      </div>
    </div>
  );
}
