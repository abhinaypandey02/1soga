import products from "@/data/products";

const HEADERS = [
  "id", "title", "description", "link", "image_link",
  "price", "availability", "condition", "brand",
  "item_group_id", "color", "size",
] as const;

function tsvEscape(value: string) {
  return value.replaceAll("\t", " ").replaceAll("\n", " ").replaceAll("\r", "");
}

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const rows = products.flatMap((product) =>
    product.variants.map((variant) => {
      const color = variant.options.find((o) => o.type === "Color")?.value ?? "";
      const size = variant.options.find((o) => o.type === "Size")?.value ?? "";
      return [
        variant.sku,
        `${product.name} — ${variant.options.map((o) => o.value).join(", ")}`,
        product.description,
        `${baseUrl}/products/${product.id}/${variant.slug}`,
        variant.image,
        `${variant.price.toFixed(2)} INR`,
        "in_stock",
        "new",
        "1SOGA",
        product.id,
        color,
        size,
      ].map(tsvEscape);
    })
  );

  const tsv = [HEADERS.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n");

  return new Response(tsv, {
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Content-Disposition": 'inline; filename="products.tsv"',
    },
  });
}
