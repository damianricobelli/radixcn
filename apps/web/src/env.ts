import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
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
