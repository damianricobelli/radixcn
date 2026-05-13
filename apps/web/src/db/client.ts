import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";
import { env } from "@/env";

type Database = LibSQLDatabase<typeof schema>;

let db: Database | undefined;

export function getDb() {
  if (db) {
    return db;
  }

  const url = env.TURSO_DATABASE_URL;

  if (!url) {
    throw new Error("Missing TURSO_DATABASE_URL.");
  }

  db = drizzle(
    createClient({
      url,
      authToken: env.TURSO_AUTH_TOKEN,
    }),
    { schema },
  );

  return db;
}
