import products from "@/data/products";
import {resolver} from "naystack/graphql";
import {Field, InputType, ObjectType} from "type-graphql";
import {db} from "@/app/api/lib/db";
import {OrderTable, LineItemTable} from "@/app/api/(graphql)/order/db";
import {UserTable} from "@/app/api/(graphql)/user/db";
import { razorpay } from "@/app/api/lib/razorpay";
import {eq} from "drizzle-orm";

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

@ObjectType("CreateOrderResponse")
class CreateOrderResponse {
  @Field()
  id: number;
  @Field()
  orderId: string;
  @Field()
  amount: number;
  @Field()
  user_email: string;
  @Field({nullable: true})
  user_phone?: string;
}

export default resolver(async (ctx, data:CheckoutInput)=>{
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  let totalAmountInPaise = 0;
  const resolvedItems: {skuId: string; price: number; costPrice: number; quantity: number}[] = [];
  const razorpayLineItems: {sku: string; variant_id: string; price: number; offer_price: number; quantity: number; name: string;description:string; image_url:string; product_url:string}[] = [];

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
      name: `${product.name} — ${variant.options.map(o=>o.value).join(", ")}`,
      description: product.description,
      image_url: variant.image||product.image,
      product_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}/${variant.slug}`
    });
  }

  const order = await razorpay.orders.create({
    amount: totalAmountInPaise,
    currency: "INR",
    receipt: `order_${Date.now()}`,
    line_items_total: totalAmountInPaise,
    
    // @ts-expect-error -- documentation issue
    line_items: razorpayLineItems
  });

  const [newOrder] = await db.insert(OrderTable).values({
  // @ts-expect-error -- documentation issue
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

  const [user] = await db
    .select({ email: UserTable.email, phone: UserTable.phone })
    .from(UserTable)
    .where(eq(UserTable.id, ctx.userId!));

  return {
    id: newOrder.id,
    // @ts-expect-error -- documentation issue
    orderId: order.id,
    amount: totalAmountInPaise,
    user_email: user.email,
    user_phone: user.phone,
  };
},{
  input:CheckoutInput,
  output:CreateOrderResponse,
  mutation:true
})
