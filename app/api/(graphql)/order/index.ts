import {FieldLibrary, QueryLibrary} from "naystack/graphql";
import createOrder from "@/app/api/(graphql)/order/resolvers/create-order";
import getOrders from "@/app/api/(graphql)/order/resolvers/get-orders";
import getOrder from "@/app/api/(graphql)/order/resolvers/get-order";
import status from './resolvers/status-field';
import {OrderDB} from "@/app/api/(graphql)/order/db";
import {OrderGQL} from "@/app/api/(graphql)/order/type";

 export default QueryLibrary({
  createOrder,
  getOrders,
  getOrder,
})

export const OrderFields = FieldLibrary<OrderDB>(OrderGQL,{
  status
})
