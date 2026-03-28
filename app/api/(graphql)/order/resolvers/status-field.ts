import {field} from "naystack/graphql";
import {OrderDB} from "@/app/api/(graphql)/order/db";
import { getQikinkOrder} from "@/app/api/lib/qikink";

export default field(async (order: OrderDB) => {
  if (order.paid === null) {
    return "Processing";
  }

  if (order.paid === false) {
    return "Refunded";
  }

  const qikinkOrder = await getQikinkOrder(String(order.id));
  if (!qikinkOrder) {
    return "Processing";
  }

  return qikinkOrder.status;
}, {
  output: String
})
