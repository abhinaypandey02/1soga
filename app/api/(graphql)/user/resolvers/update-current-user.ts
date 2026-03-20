import {resolver} from "naystack/graphql";
import {db} from "@/app/api/lib/db";
import {UserTable} from "@/app/api/(graphql)/user/db";
import {eq} from "drizzle-orm";
import {UserGQL, UpdateUserInput} from "@/app/api/(graphql)/user/type";

export default resolver(async (ctx, data: UpdateUserInput) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  const updates: Partial<{phone: string; name: string; updatedAt: Date}> = {};
  if (data.phone !== undefined) updates.phone = data.phone;
  if (data.name !== undefined) updates.name = data.name;

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = new Date();
    await db
      .update(UserTable)
      .set(updates)
      .where(eq(UserTable.id, ctx.userId));
  }

  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, ctx.userId));

  return user;
}, {
  input: UpdateUserInput,
  output: UserGQL,
  mutation: true,
})
