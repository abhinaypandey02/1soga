import { notFound } from "next/navigation";
import products from "../../data/products";
import {Injector} from "naystack/graphql";
import ProductPageClient from "./variant-selector";

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
  console.log("Product")
  return <Injector fetch={async ()=>{
    const { id } = await params;
    const { variant } = await searchParams;
    const product = products.find((p) => p.id === id);

    if (!product) {
      notFound();
    }
    return {
      product,variant
    }
  }} Component={ProductPageClient}/>


}
