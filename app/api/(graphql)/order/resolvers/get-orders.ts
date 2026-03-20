import {resolver} from "naystack/graphql";
import {db} from "@/app/api/lib/db";
import {OrderTable, LineItemTable, OrderDB} from "@/app/api/(graphql)/order/db";
import {OrderGQL} from "@/app/api/(graphql)/order/type";
import {eq, getTableColumns} from "drizzle-orm";
import {agg} from "@/app/api/lib/drizzle";

export default resolver(async (ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  return db
    .select({
      ...getTableColumns(OrderTable),
      lineItems: agg(LineItemTable)
    })
    .from(OrderTable)
    .leftJoin(LineItemTable, eq(LineItemTable.orderId, OrderTable.id))
    .where(eq(OrderTable.userId, ctx.userId)).groupBy(OrderTable.id);

}, {
  output: [OrderGQL],
})
