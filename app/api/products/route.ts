import { NextResponse } from "next/server";
import products from "@/data/products";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  return NextResponse.json(
    products.flatMap((product) =>
      product.variants.map((variant) => {
        const color = variant.options.find((o) => o.type === "Color")?.value;
        const size = variant.options.find((o) => o.type === "Size")?.value;
        return {
          id: variant.sku,
          title: `${product.name} — ${variant.options.map((o) => o.value).join(", ")}`,
          description: product.description,
          link: `${baseUrl}/products/${product.id}/${variant.slug}`,
          image_link: variant.image,
          price: `${variant.price.toFixed(2)} INR`,
          availability: "in_stock",
          condition: "new",
          brand: "1SOGA",
          item_group_id: product.id,
          ...(color && { color }),
          ...(size && { size }),
        };
      })
    )
  );
}
