import {resolver} from "naystack/graphql";
import {db} from "@/app/api/lib/db";
import {UserTable} from "@/app/api/(graphql)/user/db";
import {eq} from "drizzle-orm";
import {UserGQL} from "@/app/api/(graphql)/user/type";

export default resolver(async (ctx)=>{
  if(!ctx.userId) return null;
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, ctx.userId));
  return user;
},{
  output:UserGQL,
  outputOptions:{nullable:true},
})
