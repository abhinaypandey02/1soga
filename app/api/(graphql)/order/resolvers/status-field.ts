import {field} from "naystack/graphql";
import {OrderDB} from "@/app/api/(graphql)/order/db";
import { getQikinkOrder} from "@/app/api/lib/qikink";

export default field(async (order: OrderDB) => {
  if (!order.paid) {
    return "Pending";
  }

  const qikinkOrder = await getQikinkOrder(order.uid);
  if (!qikinkOrder) {
    return "Processing";
  }

  return qikinkOrder.status;
}, {
  output: String
})
