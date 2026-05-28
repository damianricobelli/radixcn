import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
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
const MAX_SLUG_ATTEMPTS = 64;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED_THEME_SLUGS = new Set(["registry"]);

export type SharedThemePreset = {
  hash: string;
  slug: string;
  name: string;
  editable: boolean;
  selection: ThemeSelection;
};

export type ThemePresetSummary = {
  slug: string;
  name: string;
  editable: boolean;
  updatedAt: Date;
};

export type ThemeGalleryItem = ThemePresetSummary & {
  selection: ThemeSelection;
};

type SaveThemePresetInput = {
  hash?: string;
  name: string;
  editable: boolean;
  selection: ThemeSelection;
};

export const saveThemePreset = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): SaveThemePresetInput => {
    if (!isRecord(data)) {
      throw new Error("Invalid preset payload.");
    }

    const hash = normalizeOptionalPresetHash(data.hash);
    const name = normalizeThemeName(data.name);
    const editable = data.editable === true;
    const selection = normalizeThemeSelection(data.selection, name);

    return { hash, name, editable, selection };
  })
  .handler(async ({ data }) => saveThemePresetRecord(data));

export const getThemePreset = createServerFn({ method: "GET" })
  .inputValidator((identifier: unknown) => {
    if (typeof identifier !== "string") {
      return null;
    }

    const normalizedIdentifier = identifier.trim();

    return isValidPresetIdentifier(normalizedIdentifier)
      ? normalizedIdentifier
      : null;
  })
  .handler(async ({ data: identifier }) => {
    if (!identifier || !hasDatabaseConfig()) {
      return null;
    }

    return getThemePresetByIdentifier(identifier);
  });

export const getThemeGalleryItems = createServerFn({ method: "GET" }).handler(
  async () => {
    if (!hasDatabaseConfig()) {
      return [];
    }

    return getThemeGalleryItemsFromDatabase();
  },
);

export async function getThemePresetByIdentifier(identifier: string) {
  const slugPreset = await getThemePresetBySlug(identifier.toLowerCase());

  if (slugPreset) {
    return slugPreset;
  }

  return PRESET_HASH_PATTERN.test(identifier)
    ? getThemePresetByHash(identifier)
    : null;
}

export async function getThemePresetByHash(hash: string) {
  return findThemePreset(hash);
}

export async function getThemePresetBySlug(slug: string) {
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }

  const [theme] = await getDb()
    .select()
    .from(themes)
    .where(eq(themes.slug, slug))
    .limit(1);

  return theme ? toSharedThemePreset(theme) : null;
}

export async function getThemePresetSummaries() {
  if (!hasDatabaseConfig()) {
    return [];
  }

  const rows = await getDb()
    .select({
      slug: themes.slug,
      name: themes.name,
      editable: themes.editable,
      updatedAt: themes.updatedAt,
    })
    .from(themes)
    .orderBy(desc(themes.updatedAt));

  return rows satisfies Array<ThemePresetSummary>;
}

async function getThemeGalleryItemsFromDatabase() {
  const rows = await getDb()
    .select({
      slug: themes.slug,
      name: themes.name,
      editable: themes.editable,
      updatedAt: themes.updatedAt,
      selection: themes.selection,
    })
    .from(themes)
    .orderBy(desc(themes.updatedAt));

  return rows.map((theme) => ({
    slug: theme.slug,
    name: theme.name,
    editable: theme.editable,
    updatedAt: theme.updatedAt,
    selection: normalizeThemeSelection(theme.selection, theme.name),
  })) satisfies Array<ThemeGalleryItem>;
}

async function saveThemePresetRecord(input: SaveThemePresetInput) {
  if (input.hash) {
    const updatedPreset = await updateThemePreset(input);

    if (updatedPreset) {
      return updatedPreset;
    }
  }

  return createThemePreset(input);
}

async function createThemePreset(input: SaveThemePresetInput) {
  const db = getDb();
  const now = new Date();
  const selection = normalizeThemeSelection(input.selection, input.name);
  const slug = await createUniqueThemeSlug(input.name);

  for (let attempt = 0; attempt < MAX_HASH_ATTEMPTS; attempt += 1) {
    const hash = createPresetHash();

    try {
      await db.insert(themes).values({
        hash,
        slug,
        name: input.name,
        editable: input.editable,
        selection,
        createdAt: now,
        updatedAt: now,
      });

      return {
        hash,
        slug,
        name: input.name,
        editable: input.editable,
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

async function updateThemePreset(input: SaveThemePresetInput) {
  if (!input.hash) {
    return null;
  }

  const existingPreset = await findThemePreset(input.hash);

  if (!existingPreset) {
    return null;
  }

  if (!existingPreset.editable) {
    throw new Error("This preset cannot be updated.");
  }

  const selection = normalizeThemeSelection(input.selection, input.name);

  await getDb()
    .update(themes)
    .set({
      name: input.name,
      editable: input.editable,
      selection,
      updatedAt: new Date(),
    })
    .where(eq(themes.hash, input.hash));

  return {
    hash: input.hash,
    slug: existingPreset.slug,
    name: input.name,
    editable: input.editable,
    selection,
  } satisfies SharedThemePreset;
}

async function findThemePreset(hash: string) {
  const [theme] = await getDb()
    .select()
    .from(themes)
    .where(eq(themes.hash, hash))
    .limit(1);

  return theme ? toSharedThemePreset(theme) : null;
}

function toSharedThemePreset(theme: ThemeRecord) {
  return {
    hash: theme.hash,
    slug: theme.slug,
    name: theme.name,
    editable: theme.editable,
    selection: normalizeThemeSelection(theme.selection, theme.name),
  } satisfies SharedThemePreset;
}

type ThemeRecord = typeof themes.$inferSelect;

function createPresetHash() {
  const bytes = crypto.getRandomValues(new Uint8Array(HASH_LENGTH));
  let hash = "";

  for (const byte of bytes) {
    hash += HASH_ALPHABET[byte % HASH_ALPHABET.length];
  }

  return hash;
}

async function createUniqueThemeSlug(name: string) {
  const baseSlug = slugifyThemeName(name);

  for (let suffix = 0; suffix < MAX_SLUG_ATTEMPTS; suffix += 1) {
    const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

    if (
      !RESERVED_THEME_SLUGS.has(slug) &&
      !(await findThemePresetBySlug(slug))
    ) {
      return slug;
    }
  }

  return `${baseSlug}-${createPresetHash().toLowerCase()}`;
}

async function findThemePresetBySlug(slug: string) {
  const [theme] = await getDb()
    .select({ slug: themes.slug })
    .from(themes)
    .where(eq(themes.slug, slug))
    .limit(1);

  return theme;
}

function slugifyThemeName(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "theme"
  );
}

function normalizeThemeSelection(value: unknown, name: string): ThemeSelection {
  if (!isRecord(value)) {
    throw new Error("Invalid theme selection.");
  }

  const {
    grainyBackgroundOpacity,
    grainyBackgroundScope: _grainyBackgroundScope,
    ...selection
  } = value;
  const legacyGrainyBackgroundOpacity =
    typeof grainyBackgroundOpacity === "number"
      ? grainyBackgroundOpacity
      : undefined;

  return {
    ...DEFAULT_THEME_SELECTION,
    ...selection,
    name,
    grainyBackgroundLightOpacity:
      typeof selection.grainyBackgroundLightOpacity === "number"
        ? selection.grainyBackgroundLightOpacity
        : (legacyGrainyBackgroundOpacity ??
          DEFAULT_THEME_SELECTION.grainyBackgroundLightOpacity),
    grainyBackgroundDarkOpacity:
      typeof selection.grainyBackgroundDarkOpacity === "number"
        ? selection.grainyBackgroundDarkOpacity
        : (legacyGrainyBackgroundOpacity ??
          DEFAULT_THEME_SELECTION.grainyBackgroundDarkOpacity),
    tokenCustomOverrides: isRecord(selection.tokenCustomOverrides)
      ? selection.tokenCustomOverrides
      : DEFAULT_THEME_SELECTION.tokenCustomOverrides,
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
    throw new Error(
      `Theme names must be ${MAX_THEME_NAME_LENGTH} characters or fewer.`,
    );
  }

  return name;
}

function normalizeOptionalPresetHash(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error("Invalid preset hash.");
  }

  const hash = value.trim();

  if (!PRESET_HASH_PATTERN.test(hash)) {
    throw new Error("Invalid preset hash.");
  }

  return hash;
}

function isValidPresetIdentifier(value: string) {
  return PRESET_HASH_PATTERN.test(value) || SLUG_PATTERN.test(value);
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
