import {resolver} from "naystack/graphql";
import {db} from "@/app/api/lib/db";
import {OrderTable, LineItemTable} from "@/app/api/(graphql)/order/db";
import {OrderGQL} from "@/app/api/(graphql)/order/type";
import {eq, and, or, isNotNull, gt, getTableColumns} from "drizzle-orm";
import {agg} from "@/app/api/lib/drizzle";

export default resolver(async (ctx, orderId) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const [order] = await db
    .select({
      ...getTableColumns(OrderTable),
      lineItems: agg(LineItemTable)
    })
    .from(OrderTable)
    .leftJoin(LineItemTable, eq(LineItemTable.orderId, OrderTable.id))
    .where(and(
      eq(OrderTable.id, orderId),
      eq(OrderTable.userId, ctx.userId),
      or(isNotNull(OrderTable.paid), gt(OrderTable.createdAt, tenMinutesAgo))
    )).groupBy(OrderTable.id);
  return order
}, {
  input: Number,
  output: OrderGQL,
})
