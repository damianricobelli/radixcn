import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { themes } from "@/db/schema";
import { env } from "@/env";
import { DEFAULT_THEME_SELECTION } from "@/lib/theme-generator/generator";
import type { ThemeSelection } from "@/lib/theme-generator/types";

const HASH_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const HASH_LENGTH = 10;
const MAX_HASH_ATTEMPTS = 8;
const MAX_THEME_NAME_LENGTH = 48;
const PRESET_HASH_PATTERN = /^[a-zA-Z0-9_-]{4,32}$/;

export type SharedThemePreset = {
  hash: string;
  name: string;
  selection: ThemeSelection;
};

type SaveThemePresetInput = {
  name: string;
  selection: ThemeSelection;
};

export const saveThemePreset = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): SaveThemePresetInput => {
    if (!isRecord(data)) {
      throw new Error("Invalid preset payload.");
    }

    const name = normalizeThemeName(data.name);
    const selection = normalizeThemeSelection(data.selection, name);

    return { name, selection };
  })
  .handler(async ({ data }) => createThemePreset(data));

export const getThemePreset = createServerFn({ method: "GET" })
  .inputValidator((hash: unknown) => {
    if (typeof hash !== "string") {
      return null;
    }

    const normalizedHash = hash.trim();

    return PRESET_HASH_PATTERN.test(normalizedHash) ? normalizedHash : null;
  })
  .handler(async ({ data: hash }) => {
    if (!hash || !hasDatabaseConfig()) {
      return null;
    }

    return findThemePreset(hash);
  });

async function createThemePreset(input: SaveThemePresetInput) {
  const db = getDb();
  const now = new Date();
  const selection = normalizeThemeSelection(input.selection, input.name);

  for (let attempt = 0; attempt < MAX_HASH_ATTEMPTS; attempt += 1) {
    const hash = createPresetHash();

    try {
      await db.insert(themes).values({
        hash,
        name: input.name,
        selection,
        createdAt: now,
        updatedAt: now,
      });

      return {
        hash,
        name: input.name,
        selection,
      } satisfies SharedThemePreset;
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }
    }
  }

  throw new Error("Could not create a unique preset hash.");
}

async function findThemePreset(hash: string) {
  const [theme] = await getDb()
    .select()
    .from(themes)
    .where(eq(themes.hash, hash))
    .limit(1);

  if (!theme) {
    return null;
  }

  return {
    hash: theme.hash,
    name: theme.name,
    selection: normalizeThemeSelection(theme.selection, theme.name),
  } satisfies SharedThemePreset;
}

function createPresetHash() {
  const bytes = crypto.getRandomValues(new Uint8Array(HASH_LENGTH));
  let hash = "";

  for (const byte of bytes) {
    hash += HASH_ALPHABET[byte % HASH_ALPHABET.length];
  }

  return hash;
}

function normalizeThemeSelection(value: unknown, name: string): ThemeSelection {
  if (!isRecord(value)) {
    throw new Error("Invalid theme selection.");
  }

  return {
    ...DEFAULT_THEME_SELECTION,
    ...value,
    name,
  };
}

function normalizeThemeName(value: unknown) {
  if (typeof value !== "string") {
    throw new Error("Add a name for this theme.");
  }

  const name = value.trim().replace(/\s+/g, " ");

  if (!name) {
    throw new Error("Add a name for this theme.");
  }

  if (name.length > MAX_THEME_NAME_LENGTH) {
    throw new Error(`Theme names must be ${MAX_THEME_NAME_LENGTH} characters or fewer.`);
  }

  return name;
}

function hasDatabaseConfig() {
  return Boolean(env.TURSO_DATABASE_URL);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    /unique|constraint|primary key/i.test(error.message)
  );
}
