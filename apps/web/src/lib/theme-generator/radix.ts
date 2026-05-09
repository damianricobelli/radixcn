import * as radixColors from "@radix-ui/colors"

import { hexToOklch } from "./color"
import { RADIX_STEPS } from "./types"
import type { RadixScale, RadixScaleName, RadixStep } from "./types"

export const BASE_SCALES = [
  "slate",
  "gray",
  "mauve",
  "sage",
  "olive",
  "sand",
] satisfies Array<RadixScaleName>

export const PRIMARY_SCALES = [
  "indigo",
  "blue",
  "violet",
  "teal",
  "jade",
  "cyan",
  "green",
  "grass",
  "iris",
  "purple",
  "ruby",
  "sky",
] satisfies Array<RadixScaleName>

export const DESTRUCTIVE_SCALES = [
  "red",
  "tomato",
  "ruby",
  "crimson",
] satisfies Array<RadixScaleName>

export const STATE_SCALE_RECOMMENDATIONS = {
  success: ["green", "jade", "grass", "teal"],
  warning: ["amber", "yellow", "orange", "gold"],
  info: ["blue", "cyan", "sky", "indigo"],
} satisfies Record<string, Array<RadixScaleName>>

export const CHART_SCALES = [
  "indigo",
  "teal",
  "amber",
  "purple",
  "red",
  "blue",
  "jade",
  "orange",
  "crimson",
  "cyan",
] satisfies Array<RadixScaleName>

export const DARK_TEXT_SOLID_SCALES = [
  "amber",
  "yellow",
  "lime",
  "mint",
  "sky",
] as const satisfies Array<RadixScaleName>

export function usesDarkTextOnSolid(scaleName: RadixScaleName) {
  return (DARK_TEXT_SOLID_SCALES as ReadonlyArray<RadixScaleName>).includes(
    scaleName
  )
}

export const ALL_RADIX_SCALES = [
  "gray",
  "mauve",
  "slate",
  "sage",
  "olive",
  "sand",
  "gold",
  "bronze",
  "brown",
  "yellow",
  "amber",
  "orange",
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "sky",
] satisfies Array<RadixScaleName>

type RadixExports = Record<string, Record<string, string> | undefined>

const radix = radixColors as RadixExports
const hexScaleCache = new Map<RadixScaleName, RadixScale>()
const oklchScaleCache = new Map<RadixScaleName, RadixScale>()

function getScaleObject(name: RadixScaleName, mode: "light" | "dark") {
  const exportName = mode === "light" ? name : `${name}Dark`
  const scale = radix[exportName]

  if (!scale) {
    throw new Error(`Radix scale "${exportName}" is not available`)
  }

  return scale
}

function getHexScale(name: RadixScaleName, mode: "light" | "dark") {
  const scale = getScaleObject(name, mode)

  return RADIX_STEPS.reduce(
    (nextScale, step) => {
      const key = `${name}${step}`
      const value = scale[key]

      if (!value) {
        throw new Error(`Radix color "${key}" is not available`)
      }

      nextScale[step] = value
      return nextScale
    },
    {} as Record<RadixStep, string>
  )
}

export function getRadixHexScale(name: RadixScaleName): RadixScale {
  const cached = hexScaleCache.get(name)
  if (cached) return cached

  const scale = {
    name,
    light: getHexScale(name, "light"),
    dark: getHexScale(name, "dark"),
  }

  hexScaleCache.set(name, scale)

  return scale
}

export function getRadixOklchScale(name: RadixScaleName): RadixScale {
  const cached = oklchScaleCache.get(name)
  if (cached) return cached

  const hexScale = getRadixHexScale(name)

  const scale = {
    name,
    light: mapScaleToOklch(hexScale.light),
    dark: mapScaleToOklch(hexScale.dark),
  }

  oklchScaleCache.set(name, scale)

  return scale
}

function mapScaleToOklch(scale: Record<RadixStep, string>) {
  return RADIX_STEPS.reduce(
    (nextScale, step) => {
      nextScale[step] = hexToOklch(scale[step])
      return nextScale
    },
    {} as Record<RadixStep, string>
  )
}
