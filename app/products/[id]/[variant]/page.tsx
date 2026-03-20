import { notFound } from "next/navigation";
import products from "../../../data/products";
import {Injector} from "naystack/graphql";
import ProductPageClient from "./variant-selector";

export function generateStaticParams() {
  return products.flatMap((product) => (product.variants.map(p=>({
    id: product.id,
    variant: p.sku,
  }))));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; variant?: string }>;
}) {

  return <Injector fetch={async ()=>{
    const { id, variant } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) {
      notFound();
    }
    return {
      product,variant
    }
  }} Component={ProductPageClient}/>


}
