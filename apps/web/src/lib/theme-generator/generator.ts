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
import { getFontCssValue, getFontImportCss } from "./fonts";
import {
  BASE_SCALES,
  getRadixHexScale,
  getRadixOklchScale,
  usesDarkTextOnSolid,
} from "./radix";
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
  TokenBridgeFontToken,
  TokenMapping,
} from "./types";

export const RADIUS_OPTIONS = [
  "default",
  "none",
  "small",
  "medium",
  "large",
  "extra-large",
] as const satisfies Array<RadiusScale>;

const GRAINY_BACKGROUND_IMAGE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")";

const RADIUS_VALUES = {
  default: "0.625rem",
  none: "0rem",
  small: "0.3rem",
  medium: "0.5rem",
  large: "0.75rem",
  "extra-large": "0.875rem",
} as const satisfies Record<RadiusScale, string>;

export const DEFAULT_TOKEN_BRIDGE_MAPPINGS = {
  background: "surface.canvas",
  foreground: "content.default",
  card: "surface.card",
  "card-foreground": "content.default",
  popover: "surface.popover",
  "popover-foreground": "content.default",
  primary: "interactive.primary.default",
  "primary-foreground": "interactive.primary.foreground",
  secondary: "interactive.secondary.default",
  "secondary-foreground": "interactive.secondary.foreground",
  muted: "surface.muted",
  "muted-foreground": "content.muted",
  accent: "interactive.accent.default",
  "accent-foreground": "interactive.accent.foreground",
  destructive: "status.danger.default",
  "destructive-foreground": "status.danger.foreground",
  "destructive-muted": "status.danger.muted",
  "destructive-muted-foreground": "status.danger.muted.foreground",
  "destructive-border": "status.danger.border",
  border: "border.default",
  input: "border.input",
  ring: "border.focus",
  "chart-1": "data.visual.1",
  "chart-2": "data.visual.2",
  "chart-3": "data.visual.3",
  "chart-4": "data.visual.4",
  "chart-5": "data.visual.5",
  success: "status.success.default",
  "success-foreground": "status.success.foreground",
  "success-muted": "status.success.muted",
  "success-muted-foreground": "status.success.muted.foreground",
  "success-border": "status.success.border",
  warning: "status.warning.default",
  "warning-foreground": "status.warning.foreground",
  "warning-muted": "status.warning.muted",
  "warning-muted-foreground": "status.warning.muted.foreground",
  "warning-border": "status.warning.border",
  info: "status.info.default",
  "info-foreground": "status.info.foreground",
  "info-muted": "status.info.muted",
  "info-muted-foreground": "status.info.muted.foreground",
  "info-border": "status.info.border",
} as const satisfies Partial<Record<SemanticToken, string>>;

export const DEFAULT_TOKEN_BRIDGE_FONT_MAPPINGS = {
  "font-sans": "typography.font.body",
  "font-mono": "typography.font.code",
  "font-heading": "typography.font.heading",
} as const satisfies Partial<Record<TokenBridgeFontToken, string>>;

export const DEFAULT_THEME_SELECTION: ThemeSelection = {
  name: "Default",
  baseScale: "slate",
  customBaseEnabled: false,
  customBaseColor: "",
  primaryScale: "slate",
  customPrimaryEnabled: true,
  customPrimaryColor: "#18181b",
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
  customShadowEnabled: false,
  customShadowColor: "#000000",
  shadowOpacity: 0.1,
  shadowBlur: 3,
  shadowSpread: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 1,
  grainyBackgroundEnabled: false,
  grainyBackgroundScope: "app",
  grainyBackgroundOpacity: 0.12,
  trackingNormal: 0,
  spacing: 0.25,
  headingFont: "inter",
  sansFont: "inter",
  monoFont: "jetbrains-mono",
  accentStrategy: "base",
  customAccentEnabled: false,
  customAccentColor: "",
  chartStrategy: "neutral",
  chartScales: ["slate", "slate", "slate", "slate", "slate"],
  customChartColorEnabled: [false, false, false, false, false],
  customChartColors: ["", "", "", "", ""],
  tokenBridgeEnabled: false,
  tokenBridgeMappings: {},
  tokenBridgeFontMappings: {},
  tokenStepOverrides: {},
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
  "destructive-muted",
  "destructive-muted-foreground",
  "destructive-border",
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
  "success-muted",
  "success-muted-foreground",
  "success-border",
  "warning",
  "warning-foreground",
  "warning-muted",
  "warning-muted-foreground",
  "warning-border",
  "info",
  "info-foreground",
  "info-muted",
  "info-muted-foreground",
  "info-border",
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
  ["--color-destructive-muted", "var(--destructive-muted)"],
  [
    "--color-destructive-muted-foreground",
    "var(--destructive-muted-foreground)",
  ],
  ["--color-destructive-border", "var(--destructive-border)"],
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
  ["--color-success-muted", "var(--success-muted)"],
  ["--color-success-muted-foreground", "var(--success-muted-foreground)"],
  ["--color-success-border", "var(--success-border)"],
  ["--color-warning", "var(--warning)"],
  ["--color-warning-foreground", "var(--warning-foreground)"],
  ["--color-warning-muted", "var(--warning-muted)"],
  ["--color-warning-muted-foreground", "var(--warning-muted-foreground)"],
  ["--color-warning-border", "var(--warning-border)"],
  ["--color-info", "var(--info)"],
  ["--color-info-foreground", "var(--info-foreground)"],
  ["--color-info-muted", "var(--info-muted)"],
  ["--color-info-muted-foreground", "var(--info-muted-foreground)"],
  ["--color-info-border", "var(--info-border)"],
] as const;

const TOKEN_REASONS: Record<SemanticToken, string> = {
  background: "Step 1 is the page canvas in Radix scale semantics.",
  foreground: "Step 12 provides high-emphasis text on subtle surfaces.",
  card: "Raised surfaces use step 2; flat surfaces can stay on step 1.",
  "card-foreground": "Cards carry high-emphasis readable content.",
  popover: "Floating surfaces are slightly separated from the app canvas.",
  "popover-foreground": "Popover text keeps maximum clarity.",
  primary:
    "Chromatic primary surfaces use step 9; neutral primary surfaces use step 12 so dark mode inverts to a light solid.",
  "primary-foreground":
    "Neutral primary solids use step 1; chromatic solids follow Radix step 9 foreground guidance.",
  secondary:
    "Secondary backgrounds use a subtle step in light mode and a stronger step in dark mode.",
  "secondary-foreground": "Secondary surfaces still need high-emphasis text.",
  muted:
    "Muted backgrounds stay quiet while dark mode gets enough separation from the canvas.",
  "muted-foreground": "Step 11 is Radix's low-emphasis text color.",
  accent:
    "Accent surfaces follow the selected base or brand interaction scale, with extra dark-mode presence.",
  "accent-foreground": "Accent foreground follows the matching text scale.",
  destructive: "Destructive surfaces use the selected danger scale at step 9.",
  "destructive-foreground":
    "Danger solids follow Radix step 9 foreground guidance.",
  "destructive-muted": "Destructive component backgrounds use Radix step 3.",
  "destructive-muted-foreground":
    "Destructive text on subtle surfaces uses Radix step 11.",
  "destructive-border": "Destructive borders use Radix step 6.",
  success: "Success surfaces use the selected positive state scale at step 9.",
  "success-foreground":
    "Success solids follow Radix step 9 foreground guidance.",
  "success-muted": "Success component backgrounds use Radix step 3.",
  "success-muted-foreground":
    "Success text on subtle surfaces uses Radix step 11.",
  "success-border": "Success borders use Radix step 6.",
  warning: "Warning surfaces use the selected caution state scale at step 9.",
  "warning-foreground":
    "Warning solids follow Radix step 9 foreground guidance.",
  "warning-muted": "Warning component backgrounds use Radix step 3.",
  "warning-muted-foreground":
    "Warning text on subtle surfaces uses Radix step 11.",
  "warning-border": "Warning borders use Radix step 6.",
  info: "Info surfaces use the selected informational state scale at step 9.",
  "info-foreground": "Info solids follow Radix step 9 foreground guidance.",
  "info-muted": "Info component backgrounds use Radix step 3.",
  "info-muted-foreground": "Info text on subtle surfaces uses Radix step 11.",
  "info-border": "Info borders use Radix step 6.",
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
    "Sidebar brand solids use the same foreground rule as primary.",
  "sidebar-accent": "Sidebar hover/active surfaces mirror the accent strategy.",
  "sidebar-accent-foreground":
    "Sidebar accent text follows the matching scale.",
  "sidebar-border": "Sidebar dividers use the default border step.",
  "sidebar-ring": "Sidebar focus rings mirror the primary focus color.",
};

type CustomScaleName =
  | "custom-base"
  | "custom-primary"
  | "custom-accent"
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
const CUSTOM_SCALE_RESULT_CACHE_LIMIT = 240;
const customScaleResultCache = new Map<string, Record<RadixStep, string>>();

interface Source {
  scale: ScaleName;
  step: RadixStep;
}

interface LiteralSource {
  value: string;
  description: string;
}

type TokenSource = Source | LiteralSource;
type CustomPalettePreviewRole = "gray" | "accent";

function source(scale: ScaleName, step: RadixStep): Source {
  return { scale, step };
}

function literal(value: string, description: string): LiteralSource {
  return { value, description };
}

function getTokenStepOverride(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: "light" | "dark",
) {
  return selection.tokenStepOverrides[token]?.[mode] ?? null;
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
  sourceValue: TokenSource,
  mode: "light" | "dark",
  customScaleCache?: CustomScaleRequestCache,
) {
  if (isLiteralSource(sourceValue)) {
    return colorToOklch(sourceValue.value);
  }

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

  const light = generateCustomPaletteScale(
    selection,
    customColor,
    role,
    "light",
  );
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
  if (
    isCustomBaseEnabled(selection) &&
    hasCustomColor(selection.customBaseColor)
  ) {
    return mode === "light" ? "#ffffff" : "#111111";
  }

  return getRadixHexScale(selection.baseScale)[mode][1];
}

function getBaseReference(selection: ThemeSelection, mode: "light" | "dark") {
  const customBaseColor = isCustomBaseEnabled(selection)
    ? normalizeHexColor(selection.customBaseColor)
    : null;

  return customBaseColor ?? getRadixHexScale(selection.baseScale)[mode][9];
}

function getCustomColor(selection: ThemeSelection, scaleName: CustomScaleName) {
  if (scaleName === "custom-base") {
    return selection.customBaseColor;
  }

  if (scaleName === "custom-primary") {
    return selection.customPrimaryColor;
  }

  if (scaleName === "custom-accent") {
    return selection.customAccentColor;
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

function isLiteralSource(
  sourceValue: TokenSource,
): sourceValue is LiteralSource {
  return "value" in sourceValue;
}

function describeSource(sourceValue: TokenSource) {
  if (isLiteralSource(sourceValue)) {
    return sourceValue.description;
  }

  return `${sourceValue.scale}-${sourceValue.step}`;
}

function getAccentScale(selection: ThemeSelection) {
  if (
    selection.customAccentEnabled &&
    hasCustomColor(selection.customAccentColor)
  ) {
    return "custom-accent";
  }

  return selection.accentStrategy === "base"
    ? getBaseScale(selection)
    : getPrimaryScale(selection);
}

function usesNeutralPrimarySolid(selection: ThemeSelection) {
  const primaryScale = getPrimaryScale(selection);

  if (isCustomScale(primaryScale)) {
    const primaryColor = normalizeHexColor(
      getCustomColor(selection, primaryScale),
    );

    return primaryColor ? isNeutralColor(primaryColor) : false;
  }

  return (BASE_SCALES as ReadonlyArray<RadixScaleName>).includes(primaryScale);
}

function isNeutralColor(color: string) {
  const oklch = colorToOklch(color);
  const match = oklch.match(/oklch\(\s*[\d.]+%?\s+([\d.]+)/);
  const chroma = match?.[1] ? Number(match[1]) : Number.NaN;

  return Number.isFinite(chroma) && chroma < 0.035;
}

function getPrimarySolidSource(selection: ThemeSelection) {
  return source(
    getPrimaryScale(selection),
    usesNeutralPrimarySolid(selection) ? 12 : 9,
  );
}

function getPrimarySolidForegroundSource(selection: ThemeSelection) {
  return source(getPrimaryScale(selection), 1);
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

function getSemanticSources(selection: ThemeSelection, mode: "light" | "dark") {
  const accentScale = getAccentScale(selection);
  const chartSources = getChartSources(selection);
  const panelSource =
    mode === "light"
      ? literal("#ffffff", "white panel")
      : source(getBaseScale(selection), 2);

  return {
    background: source(getBaseScale(selection), 1),
    foreground: source(getBaseScale(selection), 12),
    card: panelSource,
    "card-foreground": source(getBaseScale(selection), 12),
    popover: panelSource,
    "popover-foreground": source(getBaseScale(selection), 12),
    primary: getPrimarySolidSource(selection),
    "primary-foreground": getPrimarySolidForegroundSource(selection),
    secondary: source(getBaseScale(selection), mode === "dark" ? 6 : 3),
    "secondary-foreground": source(getBaseScale(selection), 12),
    muted: source(getBaseScale(selection), mode === "dark" ? 4 : 3),
    "muted-foreground": source(getBaseScale(selection), 11),
    accent: source(accentScale, mode === "dark" ? 5 : 3),
    "accent-foreground": source(accentScale, 12),
    destructive: source(getDestructiveScale(selection), 9),
    "destructive-foreground": source(getDestructiveScale(selection), 1),
    "destructive-muted": source(getDestructiveScale(selection), 3),
    "destructive-muted-foreground": source(getDestructiveScale(selection), 11),
    "destructive-border": source(getDestructiveScale(selection), 6),
    success: source(getStateScale(selection, "success"), 9),
    "success-foreground": source(getStateScale(selection, "success"), 1),
    "success-muted": source(getStateScale(selection, "success"), 3),
    "success-muted-foreground": source(getStateScale(selection, "success"), 11),
    "success-border": source(getStateScale(selection, "success"), 6),
    warning: source(getStateScale(selection, "warning"), 9),
    "warning-foreground": source(getStateScale(selection, "warning"), 1),
    "warning-muted": source(getStateScale(selection, "warning"), 3),
    "warning-muted-foreground": source(getStateScale(selection, "warning"), 11),
    "warning-border": source(getStateScale(selection, "warning"), 6),
    info: source(getStateScale(selection, "info"), 9),
    "info-foreground": source(getStateScale(selection, "info"), 1),
    "info-muted": source(getStateScale(selection, "info"), 3),
    "info-muted-foreground": source(getStateScale(selection, "info"), 11),
    "info-border": source(getStateScale(selection, "info"), 6),
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
    "sidebar-primary": getPrimarySolidSource(selection),
    "sidebar-primary-foreground": getPrimarySolidForegroundSource(selection),
    "sidebar-accent": source(accentScale, 3),
    "sidebar-accent-foreground": source(accentScale, 12),
    "sidebar-border": source(getBaseScale(selection), 6),
    "sidebar-ring": source(getPrimaryScale(selection), 8),
  } satisfies Partial<Record<SemanticToken, TokenSource>>;
}

export function getSemanticTokenDefaultStep(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: "light" | "dark",
) {
  if (usesSolidForegroundRule(selection, token)) {
    return null;
  }

  const sourceValue = getSemanticSources(selection, mode)[token];

  if (!sourceValue || isLiteralSource(sourceValue)) {
    if ((token === "card" || token === "popover") && mode === "light") {
      return 1;
    }

    return null;
  }

  return sourceValue.step;
}

export function getSemanticTokenStepPreviewColor(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: "light" | "dark",
  step: RadixStep,
) {
  const sourceValue = getSemanticSources(selection, mode)[token];

  if (!sourceValue) {
    return null;
  }

  const previewSource = isLiteralSource(sourceValue)
    ? source(getBaseScale(selection), step)
    : source(sourceValue.scale, step);

  return readSourceValue(selection, previewSource, mode);
}

function usesSolidForegroundRule(
  selection: ThemeSelection,
  token: SemanticToken,
) {
  return (
    token === "destructive-foreground" ||
    token === "success-foreground" ||
    token === "warning-foreground" ||
    token === "info-foreground" ||
    ((token === "primary-foreground" ||
      token === "sidebar-primary-foreground") &&
      !usesNeutralPrimarySolid(selection))
  );
}

function getSolidForegroundScale(
  selection: ThemeSelection,
  token: SemanticToken,
) {
  if (
    token === "primary-foreground" ||
    token === "sidebar-primary-foreground"
  ) {
    return usesNeutralPrimarySolid(selection) ? null : getPrimaryScale(selection);
  }

  if (token === "destructive-foreground") {
    return getDestructiveScale(selection);
  }

  if (token === "success-foreground") {
    return getStateScale(selection, "success");
  }

  if (token === "warning-foreground") {
    return getStateScale(selection, "warning");
  }

  if (token === "info-foreground") {
    return getStateScale(selection, "info");
  }

  return null;
}

function applyTokenStepOverride(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: "light" | "dark",
  sourceValue: TokenSource,
) {
  const overrideStep = getTokenStepOverride(selection, token, mode);

  if (!overrideStep) {
    return sourceValue;
  }

  if (!isLiteralSource(sourceValue)) {
    return source(sourceValue.scale, overrideStep);
  }

  if (token === "card" || token === "popover") {
    return source(getBaseScale(selection), overrideStep);
  }

  return source(getBaseScale(selection), overrideStep);
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
  const sources = getSemanticSources(selection, mode);
  const customScaleCache: CustomScaleRequestCache = new Map();
  const tokens = {} as ThemeModeTokens;

  for (const token of getSemanticTokens(selection)) {
    const solidForegroundScale = getSolidForegroundScale(selection, token);
    const hasStepOverride = getTokenStepOverride(selection, token, mode) !== null;

    if (solidForegroundScale && !hasStepOverride) {
      tokens[token] = getSolidForegroundToken(selection, solidForegroundScale);
      continue;
    }

    const tokenSource = applyTokenStepOverride(
      selection,
      token,
      mode,
      sources[token],
    );

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
  const lightSources = getSemanticSources(selection, "light");
  const darkSources = getSemanticSources(selection, "dark");

  return getSemanticTokens(selection).map((token) => {
    if (
      usesSolidForegroundRule(selection, token) &&
      !getTokenStepOverride(selection, token, "light") &&
      !getTokenStepOverride(selection, token, "dark")
    ) {
      return {
        token,
        lightSource: "Radix step 9 solid foreground rule",
        darkSource: "Radix step 9 solid foreground rule",
        reason: TOKEN_REASONS[token],
      };
    }

    const lightSource = lightSources[token];
    const darkSource = darkSources[token];
    const resolvedLightSource = applyTokenStepOverride(
      selection,
      token,
      "light",
      lightSource,
    );
    const resolvedDarkSource = applyTokenStepOverride(
      selection,
      token,
      "dark",
      darkSource,
    );
    return {
      token,
      lightSource: describeTokenModeSource(
        selection,
        token,
        "light",
        resolvedLightSource,
      ),
      darkSource: describeTokenModeSource(
        selection,
        token,
        "dark",
        resolvedDarkSource,
      ),
      reason: TOKEN_REASONS[token],
    };
  });
}

function describeTokenModeSource(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: "light" | "dark",
  sourceValue: TokenSource,
) {
  if (
    usesSolidForegroundRule(selection, token) &&
    !getTokenStepOverride(selection, token, mode)
  ) {
    return "Radix step 9 solid foreground rule";
  }

  return describeSource(sourceValue);
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

export function writeGrainyBackgroundCss(selector: string, opacity: number) {
  return [
    `${selector}::before {`,
    '  content: "";',
    "  position: fixed;",
    "  inset: 0;",
    "  z-index: 2147483647;",
    "  pointer-events: none;",
    `  background-image: ${GRAINY_BACKGROUND_IMAGE};`,
    "  background-repeat: repeat;",
    "  background-size: 182px;",
    `  opacity: ${formatNumber(clamp(opacity, 0, 0.3))};`,
    "}",
  ].join("\n");
}

export function writeGrainyBackgroundUtilityCss(opacity: number) {
  return [
    ".grainy-background {",
    "  isolation: isolate;",
    "  position: relative;",
    "}",
    "",
    ".grainy-background > * {",
    "  position: relative;",
    "  z-index: 1;",
    "}",
    "",
    ".grainy-background::before {",
    '  content: "";',
    "  position: absolute;",
    "  inset: 0;",
    "  z-index: 0;",
    "  pointer-events: none;",
    `  background-image: ${GRAINY_BACKGROUND_IMAGE};`,
    "  background-repeat: repeat;",
    "  background-size: 182px;",
    `  opacity: ${formatNumber(clamp(opacity, 0, 0.3))};`,
    "}",
  ].join("\n");
}

function writeThemeInline(
  selection: ThemeSelection,
  fonts?: ReadonlyArray<FontSourceFont>,
) {
  const themeTokens = selection.additionalStatesEnabled
    ? [...STATE_THEME_INLINE_TOKENS, ...BASE_THEME_INLINE_TOKENS]
    : BASE_THEME_INLINE_TOKENS;
  const fontTokens = [
    [
      "--default-font-family",
      getTokenBridgeFontValue(selection, "font-sans") ??
        getFontCssValue(selection.sansFont, fonts),
    ],
    [
      "--default-mono-font-family",
      getTokenBridgeFontValue(selection, "font-mono") ??
        getFontCssValue(selection.monoFont, fonts),
    ],
    [
      "--font-sans",
      getTokenBridgeFontValue(selection, "font-sans") ??
        getFontCssValue(selection.sansFont, fonts),
    ],
    [
      "--font-mono",
      getTokenBridgeFontValue(selection, "font-mono") ??
        getFontCssValue(selection.monoFont, fonts),
    ],
    [
      "--font-heading",
      getTokenBridgeFontValue(selection, "font-heading") ??
        getFontCssValue(selection.headingFont, fonts),
    ],
  ] as const;
  const lines = [...fontTokens, ...themeTokens].map(
    ([token, value]) => `  ${token}: ${value};`,
  );

  return ["@theme inline {", ...lines, "}"].join("\n");
}

function getTokenBridgeFontValue(
  selection: ThemeSelection,
  token: TokenBridgeFontToken,
) {
  if (!selection.tokenBridgeEnabled) {
    return null;
  }

  const mappedToken = selection.tokenBridgeFontMappings[token]?.trim();

  return mappedToken ? formatTokenBridgeReference(mappedToken) : null;
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
    (token) =>
      `  --${token}: ${
        getTokenBridgeValue(selection, token) ?? tokens[token]
      };`,
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

function getTokenBridgeValue(selection: ThemeSelection, token: SemanticToken) {
  if (!selection.tokenBridgeEnabled) {
    return null;
  }

  if (isChartToken(token) && selection.chartStrategy !== "multicolor") {
    return null;
  }

  if (
    isAdditionalStateBridgeToken(token) &&
    !selection.additionalStatesEnabled
  ) {
    return null;
  }

  const mappedToken = selection.tokenBridgeMappings[token]?.trim();

  if (mappedToken) {
    return formatTokenBridgeReference(mappedToken);
  }

  const sidebarAlias = getSidebarTokenBridgeAlias(token);
  const aliasedToken = sidebarAlias
    ? selection.tokenBridgeMappings[sidebarAlias]?.trim()
    : "";

  return aliasedToken ? formatTokenBridgeReference(aliasedToken) : null;
}

function getSidebarTokenBridgeAlias(
  token: SemanticToken,
): SemanticToken | null {
  if (token === "sidebar") {
    return "card";
  }

  if (token === "sidebar-foreground") {
    return "foreground";
  }

  if (token === "sidebar-primary") {
    return "primary";
  }

  if (token === "sidebar-primary-foreground") {
    return "primary-foreground";
  }

  if (token === "sidebar-accent") {
    return "accent";
  }

  if (token === "sidebar-accent-foreground") {
    return "accent-foreground";
  }

  if (token === "sidebar-border") {
    return "border";
  }

  if (token === "sidebar-ring") {
    return "ring";
  }

  return null;
}

function isChartToken(token: SemanticToken) {
  return (
    token === "chart-1" ||
    token === "chart-2" ||
    token === "chart-3" ||
    token === "chart-4" ||
    token === "chart-5"
  );
}

function isAdditionalStateBridgeToken(token: SemanticToken) {
  return (
    token === "destructive-muted" ||
    token === "destructive-muted-foreground" ||
    token === "destructive-border"
  );
}

function formatTokenBridgeReference(value: string) {
  if (value.startsWith("var(")) {
    return value;
  }

  if (value.startsWith("--")) {
    return `var(${value})`;
  }

  return `var(--${value.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "")})`;
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
    "    font-family: var(--font-sans);",
    "    letter-spacing: var(--tracking-normal);",
    "  }",
    ...(selection.grainyBackgroundEnabled &&
    selection.grainyBackgroundScope === "app"
      ? [
          "",
          indentCss(
            writeGrainyBackgroundCss("body", selection.grainyBackgroundOpacity),
            2,
          ),
        ]
      : []),
    "}",
    ...(selection.grainyBackgroundEnabled
      ? [
          "",
          "@layer utilities {",
          indentCss(
            writeGrainyBackgroundUtilityCss(selection.grainyBackgroundOpacity),
            2,
          ),
          "}",
        ]
      : []),
  ].join("\n");
}

function indentCss(css: string, spaces: number) {
  const indentation = " ".repeat(spaces);

  return css
    .split("\n")
    .map((line) => `${indentation}${line}`)
    .join("\n");
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
