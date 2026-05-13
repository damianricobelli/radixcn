import { createEnv } from "@t3-oss/env-core";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

const env = createEnv({
  server: {
    TURSO_DATABASE_URL: z.string().url().optional(),
    TURSO_AUTH_TOKEN: z.string().min(1).optional(),
  },
  clientPrefix: "VITE_",
  client: {},
  runtimeEnv: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },
  emptyStringAsUndefined: true,
});

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL ?? "",
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
