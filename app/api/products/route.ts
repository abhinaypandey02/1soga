import { NextResponse } from "next/server";
import products from "@/data/products";

export function GET() {
  return NextResponse.json(
    products.map((product) => ({
      title: product.name,
      description: product.description,
      price: product.variants[0].price,
      image: product.variants[0].image,
    }))
  );
}
