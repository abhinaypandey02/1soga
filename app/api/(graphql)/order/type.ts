import {Field, ObjectType} from "type-graphql";

@ObjectType("OrderLineItem")
export class OrderLineItemGQL {
  @Field()
  id: number;
  @Field()
  skuId: string;
  @Field()
  price: number;
  @Field()
  costPrice: number;
  @Field()
  quantity: number;
}

@ObjectType("Order")
export class OrderGQL {
  @Field()
  id: number;
  @Field()
  uid: string;
  @Field()
  amount: number;
  @Field(() => Boolean, { nullable: true })
  paid: boolean | null;
  @Field(() => [OrderLineItemGQL])
  lineItems: OrderLineItemGQL[];
  @Field()
  createdAt: Date;
}
