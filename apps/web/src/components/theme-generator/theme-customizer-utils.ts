import Color from "colorjs.io";
import type { CSSProperties } from "react";
import { normalizeHexColor } from "@/lib/theme-generator/color";
import { getFontCssValue } from "@/lib/theme-generator/fonts";
import {
  formatEm,
  formatRem,
  getRadiusValue,
  getShadowTokens,
  writeGrainyBackgroundCss,
} from "@/lib/theme-generator/generator";
import {
  ALL_RADIX_SCALES,
  getRadixHexScale,
  getRadixOklchScale,
} from "@/lib/theme-generator/radix";
import type {
  ChartStrategy,
  FontSourceFont,
  RadixScaleName,
  ThemeModeTokens,
  ThemeSelection,
} from "@/lib/theme-generator/types";

export function createPreviewStyle(
  tokens: ThemeModeTokens,
  selection: ThemeSelection,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const headingFont = getFontCssValue(selection.headingFont, fonts);
  const sansFont = getFontCssValue(selection.sansFont, fonts);
  const monoFont = getFontCssValue(selection.monoFont, fonts);
  const style = {
    "--default-font-family": sansFont,
    "--default-mono-font-family": monoFont,
    "--font-heading": headingFont,
    "--font-heading-family": headingFont,
    "--font-sans": sansFont,
    "--font-sans-family": sansFont,
    "--font-mono": monoFont,
    "--font-mono-family": monoFont,
    "--radius": getRadiusValue(selection.radiusScale),
    "--tracking-normal": formatEm(selection.trackingNormal),
    "--spacing": formatRem(selection.spacing),
    fontFamily: sansFont,
    letterSpacing: formatEm(selection.trackingNormal),
    ...getShadowTokens(selection),
  } as CSSProperties & Record<string, string>;

  for (const [token, value] of Object.entries(tokens)) {
    style[`--${token}`] = value;
    style[`--color-${token}`] = `var(--${token})`;
  }

  return style;
}

export function createPreviewCss(
  tokens: ThemeModeTokens,
  selection: ThemeSelection,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const style = createPreviewStyle(tokens, selection, fonts);
  const lines = Object.entries(style)
    .filter(([token]) => token.startsWith("--"))
    .map(([token, value]) => `  ${token}: ${value};`);

  const fontUtilityOverrides = [
    "[data-theme-preview] .font-sans {",
    "  font-family: var(--font-sans-family);",
    "}",
    "",
    "[data-theme-preview] .font-mono {",
    "  font-family: var(--font-mono-family);",
    "}",
    "",
    "[data-theme-preview] .font-heading,",
    "[data-theme-preview] :where(h1, h2, h3, h4, h5, h6) {",
    "  font-family: var(--font-heading-family);",
    "}",
  ];

  return [
    "[data-theme-preview] {",
    ...lines,
    "}",
    ...(selection.grainyBackgroundEnabled
      ? [
          "",
          writeGrainyBackgroundCss(
            "[data-theme-preview]",
            selection.grainyBackgroundLightOpacity,
          ),
          "",
          `[data-theme-preview].dark::before {`,
          `  opacity: ${formatPreviewGrainyOpacity(
            selection.grainyBackgroundDarkOpacity,
          )};`,
          "}",
        ]
      : []),
    "",
    ...fontUtilityOverrides,
  ].join("\n");
}

function formatPreviewGrainyOpacity(opacity: number) {
  return Number(Math.min(Math.max(opacity, 0), 0.3).toFixed(4)).toString();
}

export function pick<T>(items: ReadonlyArray<T>) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getOtherScales(recommended: ReadonlyArray<RadixScaleName>) {
  return ALL_RADIX_SCALES.filter((scale) => !recommended.includes(scale));
}

export function getScaleSwatch(scale: RadixScaleName) {
  return getRadixOklchScale(scale).light[9];
}

export function getScaleHex(scale: RadixScaleName) {
  return getRadixHexScale(scale).light[9];
}

export function getClosestRadixScale(
  color: string,
  candidates: ReadonlyArray<RadixScaleName> = ALL_RADIX_SCALES,
  fallback: RadixScaleName = "slate",
) {
  const normalizedColor = normalizeHexColor(color);

  if (!normalizedColor) {
    return fallback;
  }

  const target = colorToOklabCoords(normalizedColor);
  let closestScale = fallback;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const scale of candidates) {
    const radixScale = getRadixHexScale(scale).light;

    for (const stepColor of Object.values(radixScale)) {
      const distance = getOklabDistance(target, colorToOklabCoords(stepColor));

      if (distance < closestDistance) {
        closestDistance = distance;
        closestScale = scale;
      }
    }
  }

  return closestScale;
}

export function getChartSwatches(
  strategy: ChartStrategy,
  tokens: ThemeModeTokens,
): Array<string> {
  const chartSwatches = [
    tokens["chart-1"],
    tokens["chart-2"],
    tokens["chart-3"],
    tokens["chart-4"],
    tokens["chart-5"],
  ];

  return strategy === "multicolor"
    ? chartSwatches
    : [chartSwatches[0], chartSwatches[4]];
}

export function labelize(value: string) {
  return value
    .split("-")
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
}

function colorToOklabCoords(color: string): [number, number, number] {
  return new Color(color).to("oklab").coords as [number, number, number];
}

function getOklabDistance(
  [lightnessA, greenRedA, blueYellowA]: [number, number, number],
  [lightnessB, greenRedB, blueYellowB]: [number, number, number],
) {
  return (
    (lightnessA - lightnessB) ** 2 +
    (greenRedA - greenRedB) ** 2 +
    (blueYellowA - blueYellowB) ** 2
  );
}
