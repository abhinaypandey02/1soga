import {resolver} from "naystack/graphql";
import {db} from "@/app/api/lib/db";
import {OrderTable, LineItemTable} from "@/app/api/(graphql)/order/db";
import {OrderGQL} from "@/app/api/(graphql)/order/type";
import {eq, and, getTableColumns} from "drizzle-orm";
import {agg} from "@/app/api/lib/drizzle";

export default resolver(async (ctx, orderId) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  const [order] = await db
    .select({
      ...getTableColumns(OrderTable),
      lineItems: agg(LineItemTable)
    })
    .from(OrderTable)
    .leftJoin(LineItemTable, eq(LineItemTable.orderId, OrderTable.id))
    .where(and(eq(OrderTable.id, orderId), eq(OrderTable.userId, ctx.userId))).groupBy(OrderTable.id);
  return order
}, {
  input: Number,
  output: OrderGQL,
})
