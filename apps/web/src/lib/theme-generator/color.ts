import Color from "colorjs.io";

import { getSolidContrastColor } from "./custom-palette-generator";

const WHITE = "#ffffff";
const BLACK = "#000000";

function isValidHexColor(value: string) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function normalizeHexColor(value: string) {
  const normalized = value.trim();

  if (!isValidHexColor(normalized)) {
    return null;
  }

  if (normalized.length === 4) {
    return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`.toLowerCase();
  }

  return normalized.toLowerCase();
}

export function colorToOklch(value: string | Color) {
  const color = typeof value === "string" ? new Color(value) : value;

  return color.to("oklch").toString({ precision: 4 });
}

export function colorToHsl(value: string | Color) {
  const color = typeof value === "string" ? new Color(value) : value;

  return color.to("hsl").toString({ precision: 4 });
}

export function colorToHex(value: string | Color) {
  const color = typeof value === "string" ? new Color(value) : value;

  return formatHex(color.to("srgb").coords);
}

export function colorToRgb(value: string | Color) {
  const color = typeof value === "string" ? new Color(value) : value;
  const [r = 0, g = 0, b = 0] = color
    .to("srgb")
    .coords.map((channel) => Math.round(clamp01(channel ?? 0) * 255));
  const alpha = color.alpha;

  if (alpha < 1) {
    return `rgb(${r} ${g} ${b} / ${formatAlpha(alpha)})`;
  }

  return `rgb(${r} ${g} ${b})`;
}

export function isValidCssColor(value: string) {
  try {
    new Color(value);
    return true;
  } catch {
    return false;
  }
}

export function hexToOklch(hex: string) {
  return colorToOklch(hex);
}

export function getSolidForeground(backgroundHex: string) {
  const contrastColor = getSolidContrastColor(backgroundHex);

  return {
    css: colorToOklch(contrastColor),
    label: contrastColor.to("srgb").toString({ format: "hex" }),
  };
}

export function getSolidForegroundForCssColor(background: string) {
  const contrastColor = getSolidContrastColor(background);

  return colorToOklch(contrastColor);
}

export function getWhiteForeground() {
  return colorToOklch(WHITE);
}

export function getDarkForeground() {
  return colorToOklch(BLACK);
}

function formatHex(coords: Array<number | null | undefined>) {
  const [r = 0, g = 0, b = 0] = coords.map((channel) =>
    Math.round(clamp01(channel ?? 0) * 255),
  );

  return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
}

function toHexChannel(value: number) {
  return value.toString(16).padStart(2, "0");
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function formatAlpha(value: number) {
  return Number(clamp01(value).toFixed(3)).toString();
}
