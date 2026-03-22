import products from "@/data/products";
import {resolver} from "naystack/graphql";
import {Field, InputType, ObjectType} from "type-graphql";
import {db} from "@/app/api/lib/db";
import {OrderTable, LineItemTable} from "@/app/api/(graphql)/order/db";
import {UserTable} from "@/app/api/(graphql)/user/db";
import {ShippingAddressTable} from "@/app/api/(graphql)/shipping-address/db";
import {dodo} from "@/app/api/lib/dodopayments";
import {eq} from "drizzle-orm";

@InputType("LineItem")
class LineItem{
  @Field()
  skuId:string
  @Field({nullable:true, defaultValue: 1})
  quantity:number
}

@InputType("ShippingInput")
class ShippingInput{
  @Field()
  name:string
  @Field()
  email:string
  @Field()
  phone:string
  @Field()
  addressLine1:string
  @Field({nullable:true})
  addressLine2?:string
  @Field()
  city:string
  @Field()
  state:string
  @Field()
  pincode:string
}

@InputType("CheckoutInput")
class CheckoutInput{
  @Field(()=>[LineItem])
  lineItems:LineItem[]
  @Field()
  shipping:ShippingInput
}

@ObjectType("CreateOrderResponse")
class CreateOrderResponse {
  @Field()
  checkoutUrl: string;
}

export default resolver(async (ctx, data:CheckoutInput)=>{
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  const { shipping } = data;

  let totalAmountInPaise = 0;
  const resolvedItems: {skuId: string; price: number; costPrice: number; quantity: number}[] = [];
  const dodoCart: {product_id: string; quantity: number}[] = [];

  for (const lineItem of data.lineItems) {
    const product = products.find((p) => p.variants.some((v) => v.sku === lineItem.skuId));
    if (!product) {
      throw new Error(`Product not found for SKU: ${lineItem.skuId}`);
    }

    const variant = product.variants.find((v) => v.sku === lineItem.skuId)!;

    if (!variant.dodoProductId) {
      throw new Error(`DodoPayments product ID not configured for SKU: ${lineItem.skuId}`);
    }

    const priceInPaise = Math.round((variant.price ?? product.price) * 100);
    const costPriceInPaise = Math.round((variant.costPrice ?? product.costPrice) * 100);
    totalAmountInPaise += priceInPaise * lineItem.quantity;
    resolvedItems.push({skuId: lineItem.skuId, price: priceInPaise, costPrice: costPriceInPaise, quantity: lineItem.quantity});
    dodoCart.push({
      product_id: variant.dodoProductId,
      quantity: lineItem.quantity,
    });
  }

  // Create shipping address snapshot for the order
  const [orderShipping] = await db.insert(ShippingAddressTable).values({
    name: shipping.name,
    email: shipping.email,
    phone: shipping.phone,
    addressLine1: shipping.addressLine1,
    addressLine2: shipping.addressLine2,
    city: shipping.city,
    state: shipping.state,
    pincode: shipping.pincode,
  }).returning({ id: ShippingAddressTable.id });

  // Update user's saved shipping address (upsert)
  const [user] = await db
    .select({ shippingAddressId: UserTable.shippingAddressId })
    .from(UserTable)
    .where(eq(UserTable.id, ctx.userId!));

  if (user?.shippingAddressId) {
    await db.update(ShippingAddressTable).set({
      name: shipping.name,
      email: shipping.email,
      phone: shipping.phone,
      addressLine1: shipping.addressLine1,
      addressLine2: shipping.addressLine2,
      city: shipping.city,
      state: shipping.state,
      pincode: shipping.pincode,
    }).where(eq(ShippingAddressTable.id, user.shippingAddressId));
  } else {
    const [userShipping] = await db.insert(ShippingAddressTable).values({
      name: shipping.name,
      email: shipping.email,
      phone: shipping.phone,
      addressLine1: shipping.addressLine1,
      addressLine2: shipping.addressLine2,
      city: shipping.city,
      state: shipping.state,
      pincode: shipping.pincode,
    }).returning({ id: ShippingAddressTable.id });
    await db.update(UserTable).set({ shippingAddressId: userShipping.id }).where(eq(UserTable.id, ctx.userId!));
  }

  // Create internal order
  const [newOrder] = await db.insert(OrderTable).values({
    uid: `pending_${Date.now()}`,
    userId: ctx.userId,
    amount: totalAmountInPaise,
    shippingAddressId: orderShipping.id,
  }).returning({ id: OrderTable.id });

  await db.insert(LineItemTable).values(
    resolvedItems.map((item) => ({
      orderId: newOrder.id,
      ...item,
    }))
  );

  // Create DodoPayments checkout session
  const checkoutSession = await dodo.checkoutSessions.create({
    product_cart: dodoCart,
    customer: {
      email: shipping.email,
      name: shipping.name,
    },
    billing_address: {
      city: shipping.city,
      country: "IN",
      state: shipping.state,
      street: [shipping.addressLine1, shipping.addressLine2].filter(Boolean).join(", "),
      zipcode: shipping.pincode,
    },
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
    metadata: {
      order_id: String(newOrder.id),
    },
  });

  if (!checkoutSession.checkout_url) {
    throw new Error("Failed to create checkout session");
  }

  // Update order uid with DodoPayments session ID
  await db.update(OrderTable).set({
    uid: checkoutSession.session_id,
  }).where(eq(OrderTable.id, newOrder.id));

  return {
    checkoutUrl: checkoutSession.checkout_url,
  };
},{
  input:CheckoutInput,
  output:CreateOrderResponse,
  mutation:true
})
