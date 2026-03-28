import { Product, Variant } from "@/data/types";

export function getProductJsonLd(product: Product, selectedVariant: Variant) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const url = `${baseUrl}/products/${product.id}/${selectedVariant.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${selectedVariant.options.map((o) => o.value).join(", ")}`,
    description: product.description,
    image: selectedVariant.image,
    url,
    offers: {
      "@type": "Offer",
      price: selectedVariant.price.toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}
