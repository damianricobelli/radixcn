import type { CSSProperties } from "react";
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
import { getFontCssValue } from "@/lib/theme-generator/fonts";
import {
  formatEm,
  formatRem,
  getRadiusValue,
  getShadowTokens,
} from "@/lib/theme-generator/generator";

export function createPreviewStyle(
  tokens: ThemeModeTokens,
  selection: ThemeSelection,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const style = {
    "--font-heading": getFontCssValue(selection.headingFont, fonts),
    "--font-heading-family": getFontCssValue(selection.headingFont, fonts),
    "--font-sans": getFontCssValue(selection.sansFont, fonts),
    "--font-sans-family": getFontCssValue(selection.sansFont, fonts),
    "--font-mono": getFontCssValue(selection.monoFont, fonts),
    "--font-mono-family": getFontCssValue(selection.monoFont, fonts),
    "--radius": getRadiusValue(selection.radiusScale),
    "--tracking-normal": formatEm(selection.trackingNormal),
    "--spacing": formatRem(selection.spacing),
    letterSpacing: formatEm(selection.trackingNormal),
    ...getShadowTokens(selection),
  } as CSSProperties & Record<string, string>;

  for (const [token, value] of Object.entries(tokens)) {
    style[`--${token}`] = value;
  }

  return style;
}

export function createPreviewCss(
  tokens: ThemeModeTokens,
  selection: ThemeSelection,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const style = createPreviewStyle(tokens, selection, fonts);
  const lines = Object.entries(style).map(
    ([token, value]) => `  ${token}: ${value};`,
  );

  return [":root {", ...lines, "}"].join("\n");
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
