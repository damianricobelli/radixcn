export const RADIX_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type RadixStep = (typeof RADIX_STEPS)[number];

export type ColorMode = "light" | "dark";

export type ChartStrategy = "multicolor" | "monochrome" | "neutral";

export type AccentStrategy = "base" | "primary";

export type StateName = "success" | "warning" | "info";

export type RadiusScale = "default" | "none" | "small" | "medium" | "large";

export type FontSourceFontName = string;

export type TokenBridgeFontToken = "font-sans" | "font-mono" | "font-heading";

export type FontCategory =
  | "sans-serif"
  | "serif"
  | "monospace"
  | "display"
  | "handwriting"
  | "other";

export interface FontSourceFont {
  id: FontSourceFontName;
  family: string;
  subsets: Array<string>;
  weights: Array<number>;
  styles: Array<string>;
  defSubset: string;
  variable: boolean;
  lastModified: string;
  category: FontCategory;
  license: string;
  type: string;
}

export type RadixScaleName =
  | "amber"
  | "blue"
  | "bronze"
  | "brown"
  | "crimson"
  | "cyan"
  | "gold"
  | "grass"
  | "gray"
  | "green"
  | "indigo"
  | "iris"
  | "jade"
  | "lime"
  | "mauve"
  | "mint"
  | "olive"
  | "orange"
  | "pink"
  | "plum"
  | "purple"
  | "red"
  | "ruby"
  | "sage"
  | "sand"
  | "sky"
  | "slate"
  | "teal"
  | "tomato"
  | "violet"
  | "yellow";

type BaseSemanticToken =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "destructive-muted"
  | "destructive-muted-foreground"
  | "destructive-border"
  | "border"
  | "input"
  | "ring"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "sidebar"
  | "sidebar-foreground"
  | "sidebar-primary"
  | "sidebar-primary-foreground"
  | "sidebar-accent"
  | "sidebar-accent-foreground"
  | "sidebar-border"
  | "sidebar-ring";

type StateToken =
  | "success"
  | "success-foreground"
  | "success-muted"
  | "success-muted-foreground"
  | "success-border"
  | "warning"
  | "warning-foreground"
  | "warning-muted"
  | "warning-muted-foreground"
  | "warning-border"
  | "info"
  | "info-foreground"
  | "info-muted"
  | "info-muted-foreground"
  | "info-border";

export type SemanticToken = BaseSemanticToken | StateToken;

export type ThemeModeTokens = Record<BaseSemanticToken, string> &
  Partial<Record<StateToken, string>>;

export interface ThemeSelection {
  name: string;
  baseScale: RadixScaleName;
  customBaseEnabled: boolean;
  customBaseColor: string;
  primaryScale: RadixScaleName;
  customPrimaryEnabled: boolean;
  customPrimaryColor: string;
  destructiveScale: RadixScaleName;
  customDestructiveEnabled: boolean;
  customDestructiveColor: string;
  additionalStatesEnabled: boolean;
  successScale: RadixScaleName;
  customSuccessEnabled: boolean;
  customSuccessColor: string;
  warningScale: RadixScaleName;
  customWarningEnabled: boolean;
  customWarningColor: string;
  infoScale: RadixScaleName;
  customInfoEnabled: boolean;
  customInfoColor: string;
  radiusScale: RadiusScale;
  shadowScale: RadixScaleName;
  customShadowEnabled: boolean;
  customShadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  trackingNormal: number;
  spacing: number;
  headingFont: FontSourceFontName;
  sansFont: FontSourceFontName;
  monoFont: FontSourceFontName;
  accentStrategy: AccentStrategy;
  customAccentEnabled: boolean;
  customAccentColor: string;
  chartStrategy: ChartStrategy;
  chartScales: [
    RadixScaleName,
    RadixScaleName,
    RadixScaleName,
    RadixScaleName,
    RadixScaleName,
  ];
  customChartColorEnabled: [boolean, boolean, boolean, boolean, boolean];
  customChartColors: [string, string, string, string, string];
  tokenBridgeEnabled: boolean;
  tokenBridgeMappings: Partial<Record<SemanticToken, string>>;
  tokenBridgeFontMappings: Partial<Record<TokenBridgeFontToken, string>>;
}

export interface GeneratedTheme {
  selection: ThemeSelection;
  light: ThemeModeTokens;
  dark: ThemeModeTokens;
  mappings: Array<TokenMapping>;
  css: string;
}

export interface TokenMapping {
  token: SemanticToken;
  lightSource: string;
  darkSource: string;
  reason: string;
}

export interface RadixScale {
  name: RadixScaleName;
  light: Record<RadixStep, string>;
  dark: Record<RadixStep, string>;
}
