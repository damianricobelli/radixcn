import type { FontCategory, FontSourceFont, FontSourceFontName } from "./types";

export const FONTSOURCE_API_URL = "https://api.fontsource.org/v1/fonts";

const FONT_CATEGORY_LABELS = {
  "sans-serif": "Sans",
  serif: "Serif",
  monospace: "Mono",
  display: "Display",
  handwriting: "Handwriting",
  other: "Other",
} as const satisfies Record<FontCategory, string>;

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

export function getFontCategoryLabel(category: FontCategory) {
  return FONT_CATEGORY_LABELS[category];
}

export function normalizeFontCatalog(value: unknown): Array<FontSourceFont> {
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

export async function fetchFontCatalog() {
  try {
    const response = await fetch(FONTSOURCE_API_URL);

    if (!response.ok) {
      return [...FALLBACK_FONT_OPTIONS];
    }

    return normalizeFontCatalog(await response.json());
  } catch {
    return [...FALLBACK_FONT_OPTIONS];
  }
}

export function getFontOptionsByCategory(
  fonts: ReadonlyArray<FontSourceFont>,
  category: FontCategory,
) {
  return fonts.filter((font) => font.category === category);
}

export function getFontDefinition(
  fontName: FontSourceFontName,
  fonts: ReadonlyArray<FontSourceFont> = FALLBACK_FONT_OPTIONS,
) {
  return (
    fonts.find((font) => font.id === fontName) ??
    FALLBACK_FONT_OPTIONS.find((font) => font.id === fontName) ??
    FALLBACK_FONT_OPTIONS[0]
  );
}

export function getFontCssValue(
  fontName: FontSourceFontName,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const font = getFontDefinition(fontName, fonts);

  return `"${getFontFamily(font)}", ${getFontFallback(font)}`;
}

export function getFontLabel(
  fontName: FontSourceFontName,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  return getFontDefinition(fontName, fonts).family;
}

export function getFontFamily(font: FontSourceFont) {
  return font.variable ? `${font.family} Variable` : font.family;
}

export function getFontFallback(font: FontSourceFont) {
  if (font.category === "monospace") {
    return "monospace";
  }

  if (font.category === "serif") {
    return "serif";
  }

  return "sans-serif";
}

export function getSansFontOptions(fonts: ReadonlyArray<FontSourceFont>) {
  return fonts.filter((font) => font.category !== "monospace");
}

export function getMonoFontOptions(fonts: ReadonlyArray<FontSourceFont>) {
  return fonts.filter((font) => font.category === "monospace");
}

export function getFontImportCss(
  fontNames: ReadonlyArray<FontSourceFontName>,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const uniqueFonts = Array.from(new Set(fontNames)).map((fontName) =>
    getFontDefinition(fontName, fonts),
  );

  return uniqueFonts.map((font) => {
    const source = font.variable ? "@fontsource-variable" : "@fontsource";

    return `@import '${source}/${font.id}';`;
  });
}

export function getFontFaceCss(
  fontNames: ReadonlyArray<FontSourceFontName>,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const uniqueFonts = Array.from(new Set(fontNames)).map((fontName) =>
    getFontDefinition(fontName, fonts),
  );

  return uniqueFonts.flatMap((font) => getFontFaceRules(font)).join("\n\n");
}

export function getFontPreviewCss(fonts: ReadonlyArray<FontSourceFont>) {
  const uniqueFonts = Array.from(
    new Map(fonts.map((font) => [font.id, font])).values(),
  );

  return uniqueFonts.map((font) => getFontPreviewFaceRule(font)).join("\n\n");
}

function getFontPreviewFaceRule(font: FontSourceFont) {
  const subset = font.subsets.includes(font.defSubset)
    ? font.defSubset
    : font.subsets[0];
  const style = font.styles.includes("normal") ? "normal" : font.styles[0];
  const family = getFontFamily(font);

  if (font.variable) {
    const minWeight = Math.min(...font.weights);
    const maxWeight = Math.max(...font.weights);

    return [
      "@font-face {",
      `  font-family: "${family}";`,
      `  font-style: ${style};`,
      `  font-weight: ${minWeight} ${maxWeight};`,
      "  font-display: swap;",
      `  src: url("${getVariableFontUrl(font, subset, style)}") format("woff2");`,
      "}",
    ].join("\n");
  }

  const previewWeight = getPreviewFontWeight(font.weights);

  return [
    "@font-face {",
    `  font-family: "${family}";`,
    `  font-style: ${style};`,
    `  font-weight: ${previewWeight};`,
    "  font-display: swap;",
    `  src: url("${getStaticFontUrl(font, subset, previewWeight, style)}") format("woff2");`,
    "}",
  ].join("\n");
}

function getFontFaceRules(font: FontSourceFont) {
  const subset = font.subsets.includes(font.defSubset)
    ? font.defSubset
    : font.subsets[0];
  const styles = font.styles.length > 0 ? font.styles : ["normal"];
  const family = getFontFamily(font);

  if (font.variable) {
    const minWeight = Math.min(...font.weights);
    const maxWeight = Math.max(...font.weights);

    return styles.map((style) =>
      [
        "@font-face {",
        `  font-family: "${family}";`,
        `  font-style: ${style};`,
        `  font-weight: ${minWeight} ${maxWeight};`,
        "  font-display: swap;",
        `  src: url("${getVariableFontUrl(font, subset, style)}") format("woff2");`,
        "}",
      ].join("\n"),
    );
  }

  return styles.flatMap((style) =>
    font.weights.map((weight) =>
      [
        "@font-face {",
        `  font-family: "${family}";`,
        `  font-style: ${style};`,
        `  font-weight: ${weight};`,
        "  font-display: swap;",
        `  src: url("${getStaticFontUrl(font, subset, weight, style)}") format("woff2");`,
        "}",
      ].join("\n"),
    ),
  );
}

function getPreviewFontWeight(weights: ReadonlyArray<number>) {
  return weights.reduce((closestWeight, weight) =>
    Math.abs(weight - 400) < Math.abs(closestWeight - 400)
      ? weight
      : closestWeight,
  );
}

function getStaticFontUrl(
  font: FontSourceFont,
  subset: string,
  weight: number,
  style: string,
) {
  return `https://cdn.jsdelivr.net/fontsource/fonts/${font.id}@latest/${subset}-${weight}-${style}.woff2`;
}

function getVariableFontUrl(
  font: FontSourceFont,
  subset: string,
  style: string,
) {
  return `https://cdn.jsdelivr.net/fontsource/fonts/${font.id}:vf@latest/${subset}-wght-${style}.woff2`;
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
