import {field} from "naystack/graphql";
import {OrderDB, OrderTable} from "@/app/api/(graphql)/order/db";
import { getQikinkOrder} from "@/app/api/lib/qikink";
import { db } from "@/app/api/lib/db";
import { eq } from "drizzle-orm";
import { OrderStatus } from "@/lib/order-status";


export default field(async (order: OrderDB) => {
  if (order.paid === null) {
    return OrderStatus.PaymentPending;
  }

  if (order.paid === false) return OrderStatus.Refunded;


  if (!order.qikinkId) {
    return OrderStatus.Processing;
  }

  const qikinkOrder = await getQikinkOrder(order.qikinkId);

  if (!qikinkOrder) {
    return OrderStatus.Processing;
  }
  if(qikinkOrder.status === "On Hold") return OrderStatus.Processing;

  if(!qikinkOrder.shipping?.awb) return OrderStatus.Confirmed;

  if(qikinkOrder.shipping.tracking_link && !order.trackingLink){
    await db.update(OrderTable).set({
      trackingLink: qikinkOrder.shipping.tracking_link
    }).where(eq(OrderTable.id, order.id))
  }

  if(qikinkOrder.status !== "Delivered") return OrderStatus.Shipped;

  return OrderStatus.Delivered;
}, {
  output: String
})
