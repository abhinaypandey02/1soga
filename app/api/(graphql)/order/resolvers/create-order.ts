import products from "@/data/products";
import {resolver} from "naystack/graphql";
import {Field, InputType} from "type-graphql";
import {db} from "@/app/api/lib/db";
import {OrderTable, LineItemTable} from "@/app/api/(graphql)/order/db";
import { razorpay } from "@/app/api/lib/razorpay";
import { DELIVERY_FEE } from "@/lib/checkout/constants";

@InputType("LineItem")
class LineItem{
  @Field()
  skuId:string
  @Field({nullable:true, defaultValue: 1})
  quantity:number
}

@InputType("CheckoutInput")
class CheckoutInput{
  @Field(()=>[LineItem])
  lineItems:LineItem[]
}

export default resolver(async (ctx, data:CheckoutInput)=>{
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  let totalAmountInPaise = 0;
  const resolvedItems: {skuId: string; price: number; costPrice: number; quantity: number}[] = [];
  const razorpayLineItems: {sku: string; variant_id: string; price: number; offer_price: number; quantity: number; name: string}[] = [];

  for (const lineItem of data.lineItems) {
    const product = products.find((p) => p.variants.some((v) => v.sku === lineItem.skuId));
    if (!product) {
      throw new Error(`Product not found for SKU: ${lineItem.skuId}`);
    }

    const variant = product.variants.find((v) => v.sku === lineItem.skuId)!;

    const priceInPaise = Math.round((variant.price ?? product.price) * 100);
    const costPriceInPaise = Math.round((variant.costPrice ?? product.costPrice) * 100);
    totalAmountInPaise += priceInPaise * lineItem.quantity;
    resolvedItems.push({skuId: lineItem.skuId, price: priceInPaise, costPrice: costPriceInPaise, quantity: lineItem.quantity});
    razorpayLineItems.push({
      sku: lineItem.skuId,
      variant_id: lineItem.skuId,
      price: priceInPaise,
      offer_price: priceInPaise,
      quantity: lineItem.quantity,
      name: product.name,
    });
  }

  totalAmountInPaise += DELIVERY_FEE * 100;

  const order = await razorpay.orders.create({
    amount: totalAmountInPaise,
    currency: "INR",
    receipt: `order_${Date.now()}`,
    line_items_total: totalAmountInPaise,
    // @ts-expect-error -- documentation issue
    line_items: razorpayLineItems,}
  );

  const [newOrder] = await db.insert(OrderTable).values({
    uid:order.id,
    userId:ctx.userId,
    amount:totalAmountInPaise
  }).returning({id:OrderTable.id})

  await db.insert(LineItemTable).values(
    resolvedItems.map((item) => ({
      orderId: newOrder.id,
      ...item,
    }))
  )

  return order.id;
},{
  input:CheckoutInput,
  output:String,
  mutation:true
})
