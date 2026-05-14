import type { FontCategory, FontSourceFont } from "./types";

const FONTSOURCE_API_URL = "https://api.fontsource.org/v1/fonts";
const FONT_CATALOG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FONT_CATALOG_ERROR_CACHE_TTL_MS = 5 * 60 * 1000;

let fontCatalogCache:
  | {
      expiresAt: number;
      fonts: Array<FontSourceFont>;
    }
  | undefined;
let fontCatalogRequest: Promise<Array<FontSourceFont>> | undefined;

export const FONT_CATEGORY_ORDER: Array<FontCategory> = [
  "sans-serif",
  "serif",
  "monospace",
  "display",
  "handwriting",
  "other",
];

export const FALLBACK_FONT_OPTIONS = [
  {
    id: "inter",
    family: "Inter",
    subsets: ["latin"],
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "sans-serif",
    license: "OFL-1.1",
    type: "google",
  },
  {
    id: "geist",
    family: "Geist",
    subsets: ["latin"],
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "sans-serif",
    license: "OFL-1.1",
    type: "google",
  },
  {
    id: "manrope",
    family: "Manrope",
    subsets: ["latin"],
    weights: [200, 300, 400, 500, 600, 700, 800],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "sans-serif",
    license: "OFL-1.1",
    type: "google",
  },
  {
    id: "open-sans",
    family: "Open Sans",
    subsets: ["latin"],
    weights: [300, 400, 500, 600, 700, 800],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "sans-serif",
    license: "Apache-2.0",
    type: "google",
  },
  {
    id: "roboto",
    family: "Roboto",
    subsets: ["latin"],
    weights: [100, 300, 400, 500, 700, 900],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "sans-serif",
    license: "Apache-2.0",
    type: "google",
  },
  {
    id: "source-serif-4",
    family: "Source Serif 4",
    subsets: ["latin"],
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "serif",
    license: "OFL-1.1",
    type: "google",
  },
  {
    id: "space-grotesk",
    family: "Space Grotesk",
    subsets: ["latin"],
    weights: [300, 400, 500, 600, 700],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "sans-serif",
    license: "OFL-1.1",
    type: "google",
  },
  {
    id: "jetbrains-mono",
    family: "JetBrains Mono",
    subsets: ["latin"],
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "monospace",
    license: "OFL-1.1",
    type: "google",
  },
  {
    id: "source-code-pro",
    family: "Source Code Pro",
    subsets: ["latin"],
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "monospace",
    license: "OFL-1.1",
    type: "google",
  },
  {
    id: "roboto-mono",
    family: "Roboto Mono",
    subsets: ["latin"],
    weights: [100, 200, 300, 400, 500, 600, 700],
    styles: ["normal"],
    defSubset: "latin",
    variable: true,
    lastModified: "2025-01-01",
    category: "monospace",
    license: "Apache-2.0",
    type: "google",
  },
] as const satisfies Array<FontSourceFont>;

export async function getFontCatalog() {
  if (fontCatalogCache && fontCatalogCache.expiresAt > Date.now()) {
    return [...fontCatalogCache.fonts];
  }

  fontCatalogRequest ??= fetchFontCatalogFromFontsource().finally(() => {
    fontCatalogRequest = undefined;
  });

  return fontCatalogRequest;
}

function normalizeFontCatalog(value: unknown): Array<FontSourceFont> {
  if (!Array.isArray(value)) {
    return [...FALLBACK_FONT_OPTIONS];
  }

  const fonts = value.flatMap((font): Array<FontSourceFont> => {
    if (!isRecord(font)) {
      return [];
    }

    const id = typeof font.id === "string" ? font.id : "";
    const family = typeof font.family === "string" ? font.family : "";
    const weights = Array.isArray(font.weights)
      ? font.weights.filter(
          (weight): weight is number => typeof weight === "number",
        )
      : [];

    if (!id || !family || weights.length === 0) {
      return [];
    }

    return [
      {
        id,
        family,
        subsets: getStringArray(font.subsets, ["latin"]),
        weights,
        styles: getStringArray(font.styles, ["normal"]),
        defSubset:
          typeof font.defSubset === "string" ? font.defSubset : "latin",
        variable: Boolean(font.variable),
        lastModified:
          typeof font.lastModified === "string" ? font.lastModified : "",
        category: normalizeFontCategory(font.category),
        license: typeof font.license === "string" ? font.license : "",
        type: typeof font.type === "string" ? font.type : "",
      },
    ];
  });

  return fonts.length > 0 ? fonts : [...FALLBACK_FONT_OPTIONS];
}

async function fetchFontCatalogFromFontsource() {
  try {
    const response = await fetch(FONTSOURCE_API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return cacheFontCatalog([...FALLBACK_FONT_OPTIONS], {
        ttl: FONT_CATALOG_ERROR_CACHE_TTL_MS,
      });
    }

    return cacheFontCatalog(normalizeFontCatalog(await response.json()), {
      ttl: FONT_CATALOG_CACHE_TTL_MS,
    });
  } catch {
    return cacheFontCatalog([...FALLBACK_FONT_OPTIONS], {
      ttl: FONT_CATALOG_ERROR_CACHE_TTL_MS,
    });
  }
}

function cacheFontCatalog(
  fonts: Array<FontSourceFont>,
  { ttl }: { ttl: number },
) {
  fontCatalogCache = {
    expiresAt: Date.now() + ttl,
    fonts,
  };

  return [...fonts];
}

function normalizeFontCategory(value: unknown): FontCategory {
  if (
    value === "sans-serif" ||
    value === "serif" ||
    value === "monospace" ||
    value === "display" ||
    value === "handwriting"
  ) {
    return value;
  }

  return "other";
}

function getStringArray(value: unknown, fallback: Array<string>) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const strings = value.filter(
    (item): item is string => typeof item === "string",
  );

  return strings.length > 0 ? strings : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}
