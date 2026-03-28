import {field} from "naystack/graphql";
import {OrderDB, OrderTable} from "@/app/api/(graphql)/order/db";
import { getQikinkOrder} from "@/app/api/lib/qikink";
import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";


export default field(async (order: OrderDB) => {
  if (order.paid === null) {
    return "Payment Pending";
  }

  if (order.paid === false) return "Refunded";


  if (!order.qikinkId) {
    return "Processing";
  }

  const qikinkOrder = await getQikinkOrder(order.qikinkId);

  if (!qikinkOrder) {
    return "Processing";
  }

  if(!qikinkOrder.shipping?.awb) return "Placed";

  if(qikinkOrder.shipping.tracking_link && !order.trackingLink){
    await db.update(OrderTable).set({
      trackingLink: qikinkOrder.shipping.tracking_link
    }).where(eq(OrderTable.id, order.id))
  }

  if(qikinkOrder.status !== "Delivered") return "Shipped";

  return qikinkOrder.status || "Placed";
}, {
  output: String
})
