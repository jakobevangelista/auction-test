// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  datetime,
  index,
  mysqlTableCreator,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { customAlphabet } from "nanoid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `auctionProject_${name}`);

export const user = mysqlTable(
  "user",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }),
    clerkId: varchar("clerk_id", { length: 256 }),
    publicId: varchar("public_id", { length: 256 }).$defaultFn(() => {
      const nanoid = customAlphabet(
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        12,
      );
      return nanoid();
    }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
      clerkIdIdx: uniqueIndex("clerk_id_idx").on(table.clerkId),
      emailIdx: uniqueIndex("email_idx").on(table.email),
      publicIdIdx: uniqueIndex("public_id_idx").on(table.publicId),
    };
  },
);

export const auction = mysqlTable(
  "auction",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),
    publicId: varchar("public_id", { length: 256 })
      .notNull()
      .$defaultFn(() => {
        const nanoid = customAlphabet(
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
          12,
        );
        return nanoid();
      }),
    picURL: varchar("pic_url", { length: 256 }),
    description: varchar("description", { length: 256 }),
    startTime: datetime("start_time").notNull(),
    endTime: datetime("end_time").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      publicIdIdx: uniqueIndex("public_id_idx").on(table.publicId),
    };
  },
);

export const bid = mysqlTable(
  "bid",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    publicId: varchar("public_id", { length: 256 }).$defaultFn(() => {
      const nanoid = customAlphabet(
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        12,
      );
      return nanoid();
    }),
    userId: bigint("user_id", { mode: "number", unsigned: true }).references(
      () => user.id,
    ),
    auctionId: bigint("auction_id", {
      mode: "number",
      unsigned: true,
    }).references(() => auction.id),

    price: bigint("price", { mode: "number", unsigned: true }),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      publicIdIdx: uniqueIndex("public_id_idx").on(table.publicId),
    };
  },
);
