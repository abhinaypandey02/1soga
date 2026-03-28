import { MetadataRoute } from "next";
import products from "@/data/products";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export default function sitemap(): MetadataRoute.Sitemap {
  const productPages = products.flatMap((product) =>
    product.variants.map((variant) => ({
      url: `${BASE_URL}/products/${product.id}/${variant.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...productPages,
  ];
}
