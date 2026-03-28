import {field} from "naystack/graphql";
import {OrderDB} from "@/app/api/(graphql)/order/db";
import { getQikinkOrder} from "@/app/api/lib/qikink";

export default field(async (order: OrderDB) => {
  if (order.paid === null||!order.qikinkId) {
    return "Pending";
  }

  if (order.paid === false) {
    return "Refunded";
  }

  const qikinkOrder = await getQikinkOrder(order.qikinkId);
  if (!qikinkOrder) {
    return "Processing";
  }

  return qikinkOrder.status || "Processing";
}, {
  output: String
})
