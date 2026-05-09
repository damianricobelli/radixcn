import Color from "colorjs.io"

import { getSolidContrastColor } from "./custom-palette-generator"

const WHITE = "#ffffff"
const DARK = "#111111"

export function isValidHexColor(value: string) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}

export function normalizeHexColor(value: string) {
  const normalized = value.trim()

  if (!isValidHexColor(normalized)) {
    return null
  }

  if (normalized.length === 4) {
    return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`.toLowerCase()
  }

  return normalized.toLowerCase()
}

export function colorToOklch(value: string | Color) {
  const color = typeof value === "string" ? new Color(value) : value

  return color.to("oklch").toString({ precision: 4 })
}

export function colorToHsl(value: string | Color) {
  const color = typeof value === "string" ? new Color(value) : value

  return color.to("hsl").toString({ precision: 4 })
}

export function isValidCssColor(value: string) {
  try {
    new Color(value)
    return true
  } catch {
    return false
  }
}

export function hexToOklch(hex: string) {
  return colorToOklch(hex)
}

export function getSolidForeground(backgroundHex: string) {
  const contrastColor = getSolidContrastColor(backgroundHex)

  return {
    css: colorToOklch(contrastColor),
    label: contrastColor.to("srgb").toString({ format: "hex" }),
  }
}

export function getWhiteForeground() {
  return colorToOklch(WHITE)
}

export function getDarkForeground() {
  return colorToOklch(DARK)
}
