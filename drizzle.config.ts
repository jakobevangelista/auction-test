import { type Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: env.MYSQL_URL,
  },
  tablesFilter: ["auctionProject_*"],
} satisfies Config;
