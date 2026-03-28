import products from "@/data/products";

export function formatPrice(amountInPaise: number): string {
  return `₹${(amountInPaise / 100).toFixed(2)}`;
}

export function findProductBySku(sku: string) {
  for (const product of products) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) {
      return {
        id: product.id,
        name: product.name,
        image: variant.image || product.image,
        sku,
        slug: variant.slug,
      };
    }
  }
  return { id: null, name: "Unknown Product", image: "", sku, slug: "" };
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
