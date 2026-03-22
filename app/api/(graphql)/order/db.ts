import {
  pgTable,
  text,
  real,
  integer,
  serial,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import {UserTable} from "@/app/api/(graphql)/user/db";
import {ShippingAddressTable} from "@/app/api/(graphql)/shipping-address/db";


export const OrderTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  userId: integer("user_id").notNull().references(() => UserTable.id),
  amount: real("amount").notNull(),
  paid: boolean("paid").notNull().default(false),
  shippingAddressId: integer("shipping_address_id").references(() => ShippingAddressTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export type OrderDB = typeof OrderTable.$inferSelect;

export const LineItemTable = pgTable("line_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => OrderTable.id),
  skuId: text("sku_id").notNull(),
  price: real("price").notNull(),
  costPrice: real("cost_price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
