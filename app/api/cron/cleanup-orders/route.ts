import { NextResponse } from "next/server";
import { db } from "@/app/api/lib/db";
import { OrderTable } from "@/app/api/(graphql)/order/db";
import { LineItemTable } from "@/app/api/(graphql)/order/db";
import { and, isNull, lt, inArray } from "drizzle-orm";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const staleOrders = await db
    .select({ id: OrderTable.id })
    .from(OrderTable)
    .where(and(isNull(OrderTable.paid), lt(OrderTable.createdAt, cutoff)));

  if (staleOrders.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  const orderIds = staleOrders.map((o) => o.id);

  await db.delete(LineItemTable).where(inArray(LineItemTable.orderId, orderIds));
  await db.delete(OrderTable).where(inArray(OrderTable.id, orderIds));

  return NextResponse.json({ deleted: orderIds.length });
}
