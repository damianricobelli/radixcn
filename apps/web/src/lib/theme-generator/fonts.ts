import { createServerFn } from "@tanstack/react-start";
import {
  FALLBACK_FONT_OPTIONS,
  getFontCatalog,
} from "@/lib/theme-generator/font-catalog";
export { FONT_CATEGORY_ORDER, FALLBACK_FONT_OPTIONS } from "./font-catalog";
import type { FontSourceFont, FontSourceFontName } from "./types";

export const fetchFontCatalog = createServerFn({ method: "GET" }).handler(
  getFontCatalog,
);

function getFontDefinition(
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

function getFontFamily(font: FontSourceFont) {
  return font.variable ? `${font.family} Variable` : font.family;
}

function getFontFallback(font: FontSourceFont) {
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
