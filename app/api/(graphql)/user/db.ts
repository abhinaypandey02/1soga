import {
  pgTable,
  serial, text, timestamp, integer,
} from "drizzle-orm/pg-core";
import { ShippingAddressTable } from "@/app/api/(graphql)/shipping-address/db";


export const UserTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  phone: text("phone"),
  name: text("name").notNull(),
  shippingAddressId: integer("shipping_address_id").references(() => ShippingAddressTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
