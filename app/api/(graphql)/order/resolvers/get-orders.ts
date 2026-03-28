import {resolver} from "naystack/graphql";
import {db} from "@/app/api/lib/db";
import {OrderTable, LineItemTable, OrderDB} from "@/app/api/(graphql)/order/db";
import {OrderGQL} from "@/app/api/(graphql)/order/type";
import {eq, getTableColumns, and, or, isNotNull, gt, desc} from "drizzle-orm";
import {agg} from "@/app/api/lib/drizzle";

export default resolver(async (ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  return db
    .select({
      ...getTableColumns(OrderTable),
      lineItems: agg(LineItemTable)
    })
    .from(OrderTable)
    .leftJoin(LineItemTable, eq(LineItemTable.orderId, OrderTable.id))
    .where(and(
      eq(OrderTable.userId, ctx.userId),
      or(isNotNull(OrderTable.paid), gt(OrderTable.createdAt, tenMinutesAgo))
    )).groupBy(OrderTable.id).orderBy(desc(OrderTable.id));

}, {
  output: [OrderGQL],
})
