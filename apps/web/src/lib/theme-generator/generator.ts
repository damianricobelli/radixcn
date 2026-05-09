import {
  colorToHsl,
  colorToOklch,
  getDarkForeground,
  getSolidForeground,
  getWhiteForeground,
  isValidCssColor,
  normalizeHexColor,
} from "./color";
import { generateRadixColors } from "./custom-palette-generator";
import {
  getRadixHexScale,
  getRadixOklchScale,
  usesDarkTextOnSolid,
} from "./radix";
import {
  FALLBACK_FONT_OPTIONS,
  getFontCssValue,
  getFontImportCss,
  getMonoFontOptions,
  getSansFontOptions,
} from "./fonts";
import type {
  FontSourceFont,
  GeneratedTheme,
  RadiusScale,
  RadixScaleName,
  RadixStep,
  SemanticToken,
  StateName,
  ThemeModeTokens,
  ThemeSelection,
  TokenMapping,
} from "./types";

export const RADIUS_OPTIONS = [
  "default",
  "none",
  "small",
  "medium",
  "large",
] as const satisfies Array<RadiusScale>;

export const RADIUS_VALUES = {
  default: "0.625rem",
  none: "0rem",
  small: "0.3rem",
  medium: "0.5rem",
  large: "0.75rem",
} as const satisfies Record<RadiusScale, string>;

export const FONT_OPTIONS = FALLBACK_FONT_OPTIONS;
export const SANS_FONT_OPTIONS = getSansFontOptions(FONT_OPTIONS);
export const MONO_FONT_OPTIONS = getMonoFontOptions(FONT_OPTIONS);

export const DEFAULT_THEME_SELECTION: ThemeSelection = {
  name: "Radix Indigo",
  baseScale: "slate",
  customBaseEnabled: false,
  customBaseColor: "",
  primaryScale: "indigo",
  customPrimaryEnabled: false,
  customPrimaryColor: "",
  destructiveScale: "red",
  customDestructiveEnabled: false,
  customDestructiveColor: "",
  additionalStatesEnabled: false,
  successScale: "green",
  customSuccessEnabled: false,
  customSuccessColor: "",
  warningScale: "amber",
  customWarningEnabled: false,
  customWarningColor: "",
  infoScale: "blue",
  customInfoEnabled: false,
  customInfoColor: "",
  radiusScale: "default",
  shadowScale: "slate",
  customShadowEnabled: true,
  customShadowColor: "#000000",
  shadowOpacity: 0.1,
  shadowBlur: 3,
  shadowSpread: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 1,
  trackingNormal: 0,
  spacing: 0.25,
  headingFont: "inter",
  sansFont: "inter",
  monoFont: "jetbrains-mono",
  accentStrategy: "primary",
  chartStrategy: "monochrome",
  chartScales: ["indigo", "teal", "amber", "purple", "red"],
  customChartColorEnabled: [false, false, false, false, false],
  customChartColors: ["", "", "", "", ""],
};

const BASE_SEMANTIC_TOKENS: Array<SemanticToken> = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
];

const STATE_TOKENS: Array<SemanticToken> = [
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
];

const BASE_THEME_INLINE_TOKENS = [
  ["--color-background", "var(--background)"],
  ["--color-foreground", "var(--foreground)"],
  ["--color-card", "var(--card)"],
  ["--color-card-foreground", "var(--card-foreground)"],
  ["--color-popover", "var(--popover)"],
  ["--color-popover-foreground", "var(--popover-foreground)"],
  ["--color-primary", "var(--primary)"],
  ["--color-primary-foreground", "var(--primary-foreground)"],
  ["--color-secondary", "var(--secondary)"],
  ["--color-secondary-foreground", "var(--secondary-foreground)"],
  ["--color-muted", "var(--muted)"],
  ["--color-muted-foreground", "var(--muted-foreground)"],
  ["--color-accent", "var(--accent)"],
  ["--color-accent-foreground", "var(--accent-foreground)"],
  ["--color-destructive", "var(--destructive)"],
  ["--color-destructive-foreground", "var(--destructive-foreground)"],
  ["--color-border", "var(--border)"],
  ["--color-input", "var(--input)"],
  ["--color-ring", "var(--ring)"],
  ["--color-chart-1", "var(--chart-1)"],
  ["--color-chart-2", "var(--chart-2)"],
  ["--color-chart-3", "var(--chart-3)"],
  ["--color-chart-4", "var(--chart-4)"],
  ["--color-chart-5", "var(--chart-5)"],
  ["--radius-sm", "calc(var(--radius) - 4px)"],
  ["--radius-md", "calc(var(--radius) - 2px)"],
  ["--radius-lg", "var(--radius)"],
  ["--radius-xl", "calc(var(--radius) + 4px)"],
  ["--shadow-2xs", "var(--shadow-2xs)"],
  ["--shadow-xs", "var(--shadow-xs)"],
  ["--shadow-sm", "var(--shadow-sm)"],
  ["--shadow", "var(--shadow)"],
  ["--shadow-md", "var(--shadow-md)"],
  ["--shadow-lg", "var(--shadow-lg)"],
  ["--shadow-xl", "var(--shadow-xl)"],
  ["--shadow-2xl", "var(--shadow-2xl)"],
  ["--tracking-tighter", "calc(var(--tracking-normal) - 0.05em)"],
  ["--tracking-tight", "calc(var(--tracking-normal) - 0.025em)"],
  ["--tracking-normal", "var(--tracking-normal)"],
  ["--tracking-wide", "calc(var(--tracking-normal) + 0.025em)"],
  ["--tracking-wider", "calc(var(--tracking-normal) + 0.05em)"],
  ["--tracking-widest", "calc(var(--tracking-normal) + 0.1em)"],
  ["--color-sidebar", "var(--sidebar)"],
  ["--color-sidebar-foreground", "var(--sidebar-foreground)"],
  ["--color-sidebar-primary", "var(--sidebar-primary)"],
  ["--color-sidebar-primary-foreground", "var(--sidebar-primary-foreground)"],
  ["--color-sidebar-accent", "var(--sidebar-accent)"],
  ["--color-sidebar-accent-foreground", "var(--sidebar-accent-foreground)"],
  ["--color-sidebar-border", "var(--sidebar-border)"],
  ["--color-sidebar-ring", "var(--sidebar-ring)"],
] as const;

const STATE_THEME_INLINE_TOKENS = [
  ["--color-success", "var(--success)"],
  ["--color-success-foreground", "var(--success-foreground)"],
  ["--color-warning", "var(--warning)"],
  ["--color-warning-foreground", "var(--warning-foreground)"],
  ["--color-info", "var(--info)"],
  ["--color-info-foreground", "var(--info-foreground)"],
] as const;

const TOKEN_REASONS: Record<SemanticToken, string> = {
  background: "Step 1 is the page canvas in Radix scale semantics.",
  foreground: "Step 12 provides high-emphasis text on subtle surfaces.",
  card: "Raised surfaces use step 2; flat surfaces can stay on step 1.",
  "card-foreground": "Cards carry high-emphasis readable content.",
  popover: "Floating surfaces are slightly separated from the app canvas.",
  "popover-foreground": "Popover text keeps maximum clarity.",
  primary: "Step 9 is Radix's solid color for main action surfaces.",
  "primary-foreground":
    "Solid surfaces follow Radix step 9 foreground guidance.",
  secondary: "Step 3 gives low-emphasis filled UI without becoming a border.",
  "secondary-foreground": "Secondary surfaces still need high-emphasis text.",
  muted: "Step 2 is the most subtle component background.",
  "muted-foreground": "Step 11 is Radix's low-emphasis text color.",
  accent: "Accent follows the selected base or brand subtle interaction color.",
  "accent-foreground": "Accent foreground follows the matching text scale.",
  destructive: "Destructive surfaces use the selected danger scale at step 9.",
  "destructive-foreground":
    "Danger solids follow Radix step 9 foreground guidance.",
  success: "Success surfaces use the selected positive state scale at step 9.",
  "success-foreground":
    "Success solids follow Radix step 9 foreground guidance.",
  warning: "Warning surfaces use the selected caution state scale at step 9.",
  "warning-foreground":
    "Warning solids follow Radix step 9 foreground guidance.",
  info: "Info surfaces use the selected informational state scale at step 9.",
  "info-foreground": "Info solids follow Radix step 9 foreground guidance.",
  border: "Step 6 is Radix's default subtle border.",
  input: "Step 7 gives input controls a more legible boundary.",
  ring: "Step 8 is the strong border/focus step.",
  "chart-1": "Chart values follow the selected chart strategy.",
  "chart-2": "Chart values follow the selected chart strategy.",
  "chart-3": "Chart values follow the selected chart strategy.",
  "chart-4": "Chart values follow the selected chart strategy.",
  "chart-5": "Chart values follow the selected chart strategy.",
  sidebar: "Sidebars sit one layer above the page canvas.",
  "sidebar-foreground": "Sidebar text uses high-emphasis text.",
  "sidebar-primary": "Sidebar primary mirrors the main brand action.",
  "sidebar-primary-foreground":
    "Sidebar brand solids follow Radix step 9 foreground guidance.",
  "sidebar-accent": "Sidebar hover/active surfaces mirror the accent strategy.",
  "sidebar-accent-foreground":
    "Sidebar accent text follows the matching scale.",
  "sidebar-border": "Sidebar dividers use the default border step.",
  "sidebar-ring": "Sidebar focus rings mirror the primary focus color.",
};

type CustomScaleName =
  | "custom-base"
  | "custom-primary"
  | "custom-destructive"
  | "custom-success"
  | "custom-warning"
  | "custom-info"
  | "custom-chart-0"
  | "custom-chart-1"
  | "custom-chart-2"
  | "custom-chart-3"
  | "custom-chart-4";

type ScaleName = RadixScaleName | CustomScaleName;
type CustomScaleRequestCache = Map<
  `${"light" | "dark"}:${CustomScaleName}`,
  Record<RadixStep, string> | null
>;
export type CustomPalettePreviewRole = "gray" | "accent";

const CUSTOM_SCALE_RESULT_CACHE_LIMIT = 240;
const customScaleResultCache = new Map<string, Record<RadixStep, string>>();

interface Source {
  scale: ScaleName;
  step: RadixStep;
}

function source(scale: ScaleName, step: RadixStep): Source {
  return { scale, step };
}

function hasCustomColor(value: string) {
  return normalizeHexColor(value) !== null;
}

function getBaseScale(selection: ThemeSelection): ScaleName {
  return isCustomBaseEnabled(selection) &&
    hasCustomColor(selection.customBaseColor)
    ? "custom-base"
    : selection.baseScale;
}

function getPrimaryScale(selection: ThemeSelection): ScaleName {
  return isCustomPrimaryEnabled(selection) &&
    hasCustomColor(selection.customPrimaryColor)
    ? "custom-primary"
    : selection.primaryScale;
}

function getDestructiveScale(selection: ThemeSelection): ScaleName {
  return isCustomDestructiveEnabled(selection) &&
    hasCustomColor(selection.customDestructiveColor)
    ? "custom-destructive"
    : selection.destructiveScale;
}

function getStateScale(selection: ThemeSelection, state: StateName): ScaleName {
  if (
    state === "success" &&
    isCustomStateEnabled(selection, state) &&
    hasCustomColor(selection.customSuccessColor)
  ) {
    return "custom-success";
  }

  if (
    state === "warning" &&
    isCustomStateEnabled(selection, state) &&
    hasCustomColor(selection.customWarningColor)
  ) {
    return "custom-warning";
  }

  if (
    state === "info" &&
    isCustomStateEnabled(selection, state) &&
    hasCustomColor(selection.customInfoColor)
  ) {
    return "custom-info";
  }

  return selection[`${state}Scale`];
}

function getChartScale(selection: ThemeSelection, index: number): ScaleName {
  return isCustomChartEnabled(selection, index) &&
    hasCustomColor(selection.customChartColors[index] ?? "")
    ? (`custom-chart-${index}` as CustomScaleName)
    : selection.chartScales[index];
}

function isCustomBaseEnabled(selection: ThemeSelection) {
  return selection.customBaseEnabled;
}

function isCustomPrimaryEnabled(selection: ThemeSelection) {
  return selection.customPrimaryEnabled;
}

function isCustomDestructiveEnabled(selection: ThemeSelection) {
  return selection.customDestructiveEnabled;
}

function isCustomStateEnabled(selection: ThemeSelection, state: StateName) {
  if (state === "success") {
    return selection.customSuccessEnabled;
  }

  if (state === "warning") {
    return selection.customWarningEnabled;
  }

  return selection.customInfoEnabled;
}

function isCustomChartEnabled(selection: ThemeSelection, index: number) {
  return selection.customChartColorEnabled[index] ?? false;
}

function readSourceValue(
  selection: ThemeSelection,
  sourceValue: Source,
  mode: "light" | "dark",
  customScaleCache?: CustomScaleRequestCache,
) {
  if (isCustomScale(sourceValue.scale)) {
    const scale = getCustomScale(
      selection,
      sourceValue.scale,
      mode,
      customScaleCache,
    );

    if (scale) {
      return scale[sourceValue.step];
    }
  }

  const scale = getRadixOklchScale(
    isCustomScale(sourceValue.scale)
      ? selection.primaryScale
      : sourceValue.scale,
  );

  return scale[mode][sourceValue.step];
}

function getCustomScale(
  selection: ThemeSelection,
  scaleName: CustomScaleName,
  mode: "light" | "dark",
  cache?: CustomScaleRequestCache,
) {
  const cacheKey = `${mode}:${scaleName}` as const;
  if (cache?.has(cacheKey)) {
    return cache.get(cacheKey) ?? null;
  }

  const customColor = normalizeHexColor(getCustomColor(selection, scaleName));

  if (!customColor) {
    cache?.set(cacheKey, null);
    return null;
  }

  const background = getBaseBackground(selection, mode);
  const gray = getBaseReference(selection, mode);
  const resultCacheKey = [
    mode,
    scaleName === "custom-base" ? "gray" : "accent",
    customColor,
    background,
    gray,
  ].join(":");
  const cachedScale = customScaleResultCache.get(resultCacheKey);

  if (cachedScale) {
    cache?.set(cacheKey, cachedScale);
    return cachedScale;
  }

  const generated = generateRadixColors({
    appearance: mode,
    accent: customColor,
    gray,
    background,
  });

  const colorScale =
    scaleName === "custom-base"
      ? generated.grayScaleWideGamut
      : generated.accentScaleWideGamut;

  const scale = colorScale.reduce(
    (scale, color, index) => {
      scale[(index + 1) as RadixStep] = color;
      return scale;
    },
    {} as Record<RadixStep, string>,
  );

  cache?.set(cacheKey, scale);
  customScaleResultCache.set(resultCacheKey, scale);

  if (customScaleResultCache.size > CUSTOM_SCALE_RESULT_CACHE_LIMIT) {
    const oldestKey = customScaleResultCache.keys().next().value;
    if (oldestKey) {
      customScaleResultCache.delete(oldestKey);
    }
  }

  return scale;
}

export function getGeneratedCustomPalettePreview({
  selection,
  color,
  role,
}: {
  selection: ThemeSelection;
  color: string;
  role: CustomPalettePreviewRole;
}) {
  const customColor = normalizeHexColor(color);

  if (!customColor) {
    return null;
  }

  const light = generateCustomPaletteScale(selection, customColor, role, "light");
  const dark = generateCustomPaletteScale(selection, customColor, role, "dark");

  return { light, dark };
}

function generateCustomPaletteScale(
  selection: ThemeSelection,
  color: string,
  role: CustomPalettePreviewRole,
  mode: "light" | "dark",
) {
  const generated = generateRadixColors({
    appearance: mode,
    accent: color,
    gray: getBaseReference(selection, mode),
    background: getBaseBackground(selection, mode),
  });
  const colorScale =
    role === "gray"
      ? generated.grayScaleWideGamut
      : generated.accentScaleWideGamut;

  return colorScale.reduce(
    (scale, colorValue, index) => {
      scale[(index + 1) as RadixStep] = colorValue;
      return scale;
    },
    {} as Record<RadixStep, string>,
  );
}

function getBaseBackground(selection: ThemeSelection, mode: "light" | "dark") {
  if (hasCustomColor(selection.customBaseColor)) {
    return mode === "light" ? "#ffffff" : "#111111";
  }

  return getRadixHexScale(selection.baseScale)[mode][1];
}

function getBaseReference(selection: ThemeSelection, mode: "light" | "dark") {
  const customBaseColor = normalizeHexColor(selection.customBaseColor);

  return customBaseColor ?? getRadixHexScale(selection.baseScale)[mode][9];
}

function getCustomColor(selection: ThemeSelection, scaleName: CustomScaleName) {
  if (scaleName === "custom-base") {
    return selection.customBaseColor;
  }

  if (scaleName === "custom-primary") {
    return selection.customPrimaryColor;
  }

  if (scaleName === "custom-destructive") {
    return selection.customDestructiveColor;
  }

  if (scaleName === "custom-success") {
    return selection.customSuccessColor;
  }

  if (scaleName === "custom-warning") {
    return selection.customWarningColor;
  }

  if (scaleName === "custom-info") {
    return selection.customInfoColor;
  }

  return (
    selection.customChartColors[
      Number(scaleName.replace("custom-chart-", ""))
    ] ?? ""
  );
}

function isCustomScale(scaleName: ScaleName): scaleName is CustomScaleName {
  return scaleName.startsWith("custom-");
}

function describeSource(sourceValue: Source) {
  return `${sourceValue.scale}-${sourceValue.step}`;
}

function getAccentScale(selection: ThemeSelection) {
  return selection.accentStrategy === "primary"
    ? getPrimaryScale(selection)
    : getBaseScale(selection);
}

function getChartSources(selection: ThemeSelection): Array<Source> {
  if (selection.chartStrategy === "monochrome") {
    return [9, 8, 7, 6, 5].map((step) =>
      source(getPrimaryScale(selection), step as RadixStep),
    );
  }

  if (selection.chartStrategy === "neutral") {
    return [12, 11, 10, 9, 8].map((step) =>
      source(getBaseScale(selection), step as RadixStep),
    );
  }

  return [0, 1, 2, 3, 4].map((index) =>
    source(getChartScale(selection, index), 9),
  );
}

function getSemanticSources(selection: ThemeSelection) {
  const accentScale = getAccentScale(selection);
  const chartSources = getChartSources(selection);

  return {
    background: source(getBaseScale(selection), 1),
    foreground: source(getBaseScale(selection), 12),
    card: source(getBaseScale(selection), 2),
    "card-foreground": source(getBaseScale(selection), 12),
    popover: source(getBaseScale(selection), 2),
    "popover-foreground": source(getBaseScale(selection), 12),
    primary: source(getPrimaryScale(selection), 9),
    secondary: source(getBaseScale(selection), 3),
    "secondary-foreground": source(getBaseScale(selection), 12),
    muted: source(getBaseScale(selection), 2),
    "muted-foreground": source(getBaseScale(selection), 11),
    accent: source(accentScale, 3),
    "accent-foreground": source(accentScale, 12),
    destructive: source(getDestructiveScale(selection), 9),
    success: source(getStateScale(selection, "success"), 9),
    warning: source(getStateScale(selection, "warning"), 9),
    info: source(getStateScale(selection, "info"), 9),
    border: source(getBaseScale(selection), 6),
    input: source(getBaseScale(selection), 7),
    ring: source(getPrimaryScale(selection), 8),
    "chart-1": chartSources[0],
    "chart-2": chartSources[1],
    "chart-3": chartSources[2],
    "chart-4": chartSources[3],
    "chart-5": chartSources[4],
    sidebar: source(getBaseScale(selection), 2),
    "sidebar-foreground": source(getBaseScale(selection), 12),
    "sidebar-primary": source(getPrimaryScale(selection), 9),
    "sidebar-accent": source(accentScale, 3),
    "sidebar-accent-foreground": source(accentScale, 12),
    "sidebar-border": source(getBaseScale(selection), 6),
    "sidebar-ring": source(getPrimaryScale(selection), 8),
  } satisfies Partial<Record<SemanticToken, Source>>;
}

function getSemanticTokens(selection: ThemeSelection): Array<SemanticToken> {
  return selection.additionalStatesEnabled
    ? [...BASE_SEMANTIC_TOKENS, ...STATE_TOKENS]
    : BASE_SEMANTIC_TOKENS;
}

function getSolidForegroundToken(
  selection: ThemeSelection,
  scaleName: ScaleName,
) {
  if (isCustomScale(scaleName)) {
    const normalized = normalizeHexColor(getCustomColor(selection, scaleName));

    return normalized
      ? getSolidForeground(normalized).css
      : getWhiteForeground();
  }

  return usesDarkTextOnSolid(scaleName)
    ? getDarkForeground()
    : getWhiteForeground();
}

function buildModeTokens(
  selection: ThemeSelection,
  mode: "light" | "dark",
): ThemeModeTokens {
  const sources = getSemanticSources(selection);
  const customScaleCache: CustomScaleRequestCache = new Map();
  const tokens = {} as ThemeModeTokens;

  for (const token of getSemanticTokens(selection)) {
    if (token === "primary-foreground") {
      tokens[token] = getSolidForegroundToken(
        selection,
        getPrimaryScale(selection),
      );
      continue;
    }

    if (token === "destructive-foreground") {
      tokens[token] = getSolidForegroundToken(
        selection,
        getDestructiveScale(selection),
      );
      continue;
    }

    if (token === "success-foreground") {
      tokens[token] = getSolidForegroundToken(
        selection,
        getStateScale(selection, "success"),
      );
      continue;
    }

    if (token === "warning-foreground") {
      tokens[token] = getSolidForegroundToken(
        selection,
        getStateScale(selection, "warning"),
      );
      continue;
    }

    if (token === "info-foreground") {
      tokens[token] = getSolidForegroundToken(
        selection,
        getStateScale(selection, "info"),
      );
      continue;
    }

    if (token === "sidebar-primary-foreground") {
      tokens[token] = getSolidForegroundToken(
        selection,
        getPrimaryScale(selection),
      );
      continue;
    }

    const tokenSource = sources[token];
    tokens[token] = readSourceValue(
      selection,
      tokenSource,
      mode,
      customScaleCache,
    );
  }

  return tokens;
}

function buildMappings(selection: ThemeSelection): Array<TokenMapping> {
  const sources = getSemanticSources(selection);

  return getSemanticTokens(selection).map((token) => {
    if (
      token === "primary-foreground" ||
      token === "destructive-foreground" ||
      token === "success-foreground" ||
      token === "warning-foreground" ||
      token === "info-foreground" ||
      token === "sidebar-primary-foreground"
    ) {
      return {
        token,
        lightSource: "Radix step 9 solid foreground rule",
        darkSource: "Radix step 9 solid foreground rule",
        reason: TOKEN_REASONS[token],
      };
    }

    const tokenSource = sources[token];
    return {
      token,
      lightSource: describeSource(tokenSource),
      darkSource: `${describeSource(tokenSource)} dark`,
      reason: TOKEN_REASONS[token],
    };
  });
}

export function getRadiusValue(radiusScale: RadiusScale) {
  return RADIUS_VALUES[radiusScale];
}

export function getShadowTokens(selection: ThemeSelection) {
  const x = formatPx(selection.shadowOffsetX);
  const y = formatPx(selection.shadowOffsetY);
  const blur = formatPx(selection.shadowBlur);
  const spread = formatPx(selection.shadowSpread);
  const cssColor = getShadowCssColor(selection);
  const color = getShadowHslColor(cssColor);
  const opacity = clamp(selection.shadowOpacity, 0, 1);
  const subtleColor = withAlpha(color, opacity * 0.5);
  const defaultColor = withAlpha(color, opacity);
  const strongColor = withAlpha(color, clamp(opacity * 2.5, 0, 1));

  return {
    "--shadow-x": x,
    "--shadow-y": y,
    "--shadow-blur": blur,
    "--shadow-spread": spread,
    "--shadow-opacity": formatNumber(opacity),
    "--shadow-color": cssColor,
    "--shadow-2xs": `${x} ${y} ${blur} ${spread} ${subtleColor}`,
    "--shadow-xs": `${x} ${y} ${blur} ${spread} ${subtleColor}`,
    "--shadow-sm": `${x} ${y} ${blur} ${spread} ${defaultColor}, ${x} 1px 2px -1px ${defaultColor}`,
    "--shadow": `${x} ${y} ${blur} ${spread} ${defaultColor}, ${x} 1px 2px -1px ${defaultColor}`,
    "--shadow-md": `${x} ${y} ${blur} ${spread} ${defaultColor}, ${x} 2px 4px -1px ${defaultColor}`,
    "--shadow-lg": `${x} ${y} ${blur} ${spread} ${defaultColor}, ${x} 4px 6px -1px ${defaultColor}`,
    "--shadow-xl": `${x} ${y} ${blur} ${spread} ${defaultColor}, ${x} 8px 10px -1px ${defaultColor}`,
    "--shadow-2xl": `${x} ${y} ${blur} ${spread} ${strongColor}`,
  } as const;
}

function getShadowCssColor(selection: ThemeSelection) {
  const customColor = normalizeHexColor(selection.customShadowColor);

  if (selection.customShadowEnabled && customColor) {
    return colorToOklch(customColor);
  }

  return getRadixOklchScale(selection.shadowScale).light[9];
}

function getShadowHslColor(color: string) {
  const cssColor = isValidCssColor(color)
    ? color.trim()
    : DEFAULT_THEME_SELECTION.customShadowColor;
  return colorToHsl(cssColor).replace(/,\s*/g, " ");
}

function withAlpha(color: string, alpha: number) {
  return color.replace(/\)$/, ` / ${formatNumber(alpha)})`);
}

function formatPx(value: number) {
  return value === 0 ? "0" : `${formatNumber(value)}px`;
}

export function formatEm(value: number) {
  return value === 0 ? "0" : `${formatNumber(value)}em`;
}

export function formatRem(value: number) {
  return value === 0 ? "0" : `${formatNumber(value)}rem`;
}

function formatNumber(value: number) {
  return Number(value.toFixed(4)).toString();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function writeThemeInline(
  selection: ThemeSelection,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const themeTokens = selection.additionalStatesEnabled
    ? [...STATE_THEME_INLINE_TOKENS, ...BASE_THEME_INLINE_TOKENS]
    : BASE_THEME_INLINE_TOKENS;
  const fontTokens = [
    ["--font-sans", getFontCssValue(selection.sansFont, fonts)],
    ["--font-mono", getFontCssValue(selection.monoFont, fonts)],
    ["--font-heading", getFontCssValue(selection.headingFont, fonts)],
  ] as const;
  const lines = [...fontTokens, ...themeTokens].map(
    ([token, value]) => `  ${token}: ${value};`,
  );

  return ["@theme inline {", ...lines, "}"].join("\n");
}

function writeTokenBlock(
  selector: string,
  tokens: ThemeModeTokens,
  selection: ThemeSelection,
) {
  const shadowTokens = Object.entries(getShadowTokens(selection)).map(
    ([token, value]) => `  ${token}: ${value};`,
  );
  const lines = getSemanticTokens(selection).map(
    (token) => `  --${token}: ${tokens[token]};`,
  );

  return [
    `${selector} {`,
    ...lines,
    `  --radius: ${getRadiusValue(selection.radiusScale)};`,
    `  --tracking-normal: ${formatEm(selection.trackingNormal)};`,
    `  --spacing: ${formatRem(selection.spacing)};`,
    ...shadowTokens,
    "}",
  ].join("\n");
}

function writeCss(
  selection: ThemeSelection,
  light: ThemeModeTokens,
  dark: ThemeModeTokens,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const fontImports = getFontImportCss(
    [selection.headingFont, selection.sansFont, selection.monoFont],
    fonts,
  );

  return [
    "@import 'tailwindcss';",
    "@import 'tw-animate-css';",
    ...fontImports,
    "",
    "@custom-variant dark (&:is(.dark *));",
    "",
    writeTokenBlock(":root", light, selection),
    "",
    writeTokenBlock(".dark", dark, selection),
    "",
    writeThemeInline(selection, fonts),
    "",
    "@layer base {",
    "  * {",
    "    @apply border-border outline-ring/50;",
    "  }",
    "",
    "  body {",
    "    @apply bg-background text-foreground;",
    "    letter-spacing: var(--tracking-normal);",
    "  }",
    "}",
  ].join("\n");
}

export function generateTheme(
  selection: ThemeSelection,
  fonts?: ReadonlyArray<FontSourceFont>,
): GeneratedTheme {
  const light = buildModeTokens(selection, "light");
  const dark = buildModeTokens(selection, "dark");

  return {
    selection,
    light,
    dark,
    mappings: buildMappings(selection),
    css: writeCss(selection, light, dark, fonts),
  };
}
