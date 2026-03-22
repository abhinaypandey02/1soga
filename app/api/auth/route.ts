import {setupEmailAuth} from 'naystack/auth'
import {db} from "@/app/api/lib/db";
import {UserTable} from "@/app/api/(graphql)/user/db";
import {eq} from "drizzle-orm";

export const {GET,POST,DELETE,PUT} = setupEmailAuth({
  allowedOrigins: ['1soga.com', 'onesoga.com'],
  createUser: async (data) => {
    const [user] = await db.insert(UserTable).values(data).returning();
    return user;
  },
  getUser: async ({ email }) => {
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));
    return user;
  },
})
