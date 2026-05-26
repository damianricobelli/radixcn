import Color from "colorjs.io";
import { colorToHex } from "@/lib/theme-generator/color";
import type { RadiusScale, ThemeSelection } from "@/lib/theme-generator/types";

export type CssTokenImportRole =
  | "base"
  | "primary"
  | "accent"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5";

export type CssColorToken = {
  name: string;
  value: string;
  kind: "color";
  hex: string;
};

export type CssExtraTokenKind =
  | "font"
  | "radius"
  | "shadow"
  | "spacing"
  | "tracking";

export type CssExtraToken = {
  name: string;
  value: string;
  kind: CssExtraTokenKind;
};

export type CssToken = CssColorToken | CssExtraToken;

export type CssTokenImportMatch = CssColorToken & {
  role: CssTokenImportRole;
  confidence: number;
};

export type CssTokenImportResult = {
  tokens: Array<CssToken>;
  colorTokens: Array<CssColorToken>;
  matches: Array<CssTokenImportMatch>;
  selection: Partial<ThemeSelection>;
};

type RoleCandidate = CssColorToken & {
  score: number;
};

const ROLE_TOKEN_NAMES = {
  base: ["--foreground"],
  primary: ["--primary"],
  accent: ["--accent"],
  destructive: ["--destructive"],
  success: ["--success"],
  warning: ["--warning"],
  info: ["--info"],
  "chart-1": ["--chart-1"],
  "chart-2": ["--chart-2"],
  "chart-3": ["--chart-3"],
  "chart-4": ["--chart-4"],
  "chart-5": ["--chart-5"],
} as const satisfies Record<CssTokenImportRole, ReadonlyArray<string>>;

const ROLE_FALLBACK_LABELS: Record<
  CssTokenImportRole,
  ReadonlyArray<RegExp>
> = {
  base: [/\b(base|gray|grey|neutral|slate|zinc|stone)\b/],
  primary: [/\b(primary|brand|main|action|interactive|cta)\b/],
  accent: [/\b(accent|highlight|link)\b/],
  destructive: [/\b(destructive|danger|error|critical|negative|red)\b/],
  success: [/\b(success|positive|valid|green)\b/],
  warning: [/\b(warning|caution|alert|amber|yellow)\b/],
  info: [/\b(info|information|notice|blue|cyan)\b/],
  "chart-1": [/\b(chart|data|viz|graph).*(1|one|primary)\b/],
  "chart-2": [/\b(chart|data|viz|graph).*(2|two|secondary)\b/],
  "chart-3": [/\b(chart|data|viz|graph).*(3|three|tertiary)\b/],
  "chart-4": [/\b(chart|data|viz|graph).*(4|four)\b/],
  "chart-5": [/\b(chart|data|viz|graph).*(5|five)\b/],
};

const CHART_ROLES = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const satisfies ReadonlyArray<CssTokenImportRole>;

const RADIUS_SCALE_VALUES = {
  default: "0.625rem",
  none: "0rem",
  small: "0.3rem",
  medium: "0.5rem",
  large: "0.75rem",
  "extra-large": "0.875rem",
} as const satisfies Record<RadiusScale, string>;

export function importCssTokens(css: string): CssTokenImportResult {
  const tokens = parseCssTokens(css);
  const colorTokens = tokens.filter(
    (token): token is CssColorToken => token.kind === "color",
  );
  const usedNames = new Set<string>();
  const matches: Array<CssTokenImportMatch> = [];

  for (const role of getRolePriority()) {
    const candidate = pickRoleCandidate(role, colorTokens, usedNames);

    if (!candidate) {
      continue;
    }

    usedNames.add(candidate.name);
    matches.push({
      name: candidate.name,
      value: candidate.value,
      kind: candidate.kind,
      hex: candidate.hex,
      role,
      confidence: candidate.score,
    });
  }

  return {
    tokens,
    colorTokens,
    matches,
    selection: {
      ...createSelectionPatch(matches),
      ...createExtraSelectionPatch(tokens),
    },
  };
}

function parseCssTokens(css: string) {
  const tokens = new Map<string, CssToken>();
  const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const declarationRegex = /(--[\w-]+)\s*:\s*([^;{}]+);/g;

  for (const match of cssWithoutComments.matchAll(declarationRegex)) {
    const name = match[1]?.trim();
    const value = match[2]?.trim();

    if (!name || !value) {
      continue;
    }

    const kind = getExtraTokenKind(name);

    if (kind) {
      if (!tokens.has(name)) {
        tokens.set(name, { name, value, kind });
      }
      continue;
    }

    if (value.includes("var(")) {
      continue;
    }

    const hex = normalizeColorValue(value);

    if (hex) {
      if (!tokens.has(name)) {
        tokens.set(name, { name, value, kind: "color", hex });
      }
    }
  }

  return Array.from(tokens.values());
}

function getExtraTokenKind(name: string): CssExtraTokenKind | null {
  if (/^--font-(sans|mono|heading)$/.test(name)) {
    return "font";
  }

  if (name === "--radius") {
    return "radius";
  }

  if (
    /^--shadow(?:-(?:2xs|xs|sm|md|lg|xl|2xl|x|y|blur|spread|opacity|color))?$/.test(
      name,
    )
  ) {
    return "shadow";
  }

  if (name === "--spacing") {
    return "spacing";
  }

  if (
    /^--tracking-(?:normal|tighter|tight|wide|wider|widest)$/.test(name) ||
    name === "--letter-spacing"
  ) {
    return "tracking";
  }

  return null;
}

function normalizeColorValue(value: string) {
  try {
    const color = new Color(value);

    if (color.alpha < 0.95) {
      return null;
    }

    return colorToHex(color);
  } catch {
    return null;
  }
}

function pickRoleCandidate(
  role: CssTokenImportRole,
  tokens: ReadonlyArray<CssColorToken>,
  usedNames: ReadonlySet<string>,
) {
  let bestCandidate: RoleCandidate | null = null;

  for (const token of tokens) {
    if (usedNames.has(token.name)) {
      continue;
    }

    const score = scoreRoleCandidate(role, token);

    if (score <= 0) {
      continue;
    }

    if (!bestCandidate || score > bestCandidate.score) {
      bestCandidate = { ...token, score };
    }
  }

  return bestCandidate;
}

function scoreRoleCandidate(role: CssTokenImportRole, token: CssColorToken) {
  const normalizedName = token.name.replace(/^--/, "").toLowerCase();
  const hasExactRoleName = ROLE_TOKEN_NAMES[role].some(
    (tokenName) => tokenName === token.name,
  );

  if (!hasExactRoleName && isInternalSemanticTokenName(normalizedName)) {
    return 0;
  }

  const color = new Color(token.hex).to("oklch");
  const [lightness = 0, chroma = 0] = color.coords;
  const fallbackNameScore = getFallbackNameScore(role, normalizedName);

  if (!hasExactRoleName && fallbackNameScore === 0) {
    return 0;
  }

  let score = hasExactRoleName ? 100 : fallbackNameScore;

  if (role === "base") {
    score += Math.max(0, 4 - Math.abs((chroma ?? 0) * 100));
    score += isMidSolid(lightness ?? 0) ? 2 : -2;
  } else {
    score += Math.min((chroma ?? 0) * 18, 3);
    score += isMidSolid(lightness ?? 0) ? 1.5 : -1;
  }

  if (/\b(foreground|background|canvas|white|black)\b/.test(normalizedName)) {
    score -= role === "base" ? 2 : 4;
  }

  return score;
}

function getFallbackNameScore(role: CssTokenImportRole, name: string) {
  return ROLE_FALLBACK_LABELS[role].some((pattern) => pattern.test(name))
    ? 8
    : 0;
}

function isInternalSemanticTokenName(name: string) {
  return (
    name === "background" ||
    name === "muted" ||
    name === "border" ||
    name === "input" ||
    name === "ring" ||
    name.startsWith("sidebar-") ||
    name.endsWith("-foreground") ||
    name.endsWith("-muted") ||
    name.endsWith("-border")
  );
}

function isMidSolid(lightness: number) {
  return lightness > 0.18 && lightness < 0.82;
}

function createSelectionPatch(matches: ReadonlyArray<CssTokenImportMatch>) {
  const byRole = Object.fromEntries(
    matches.map((match) => [match.role, match]),
  ) as Partial<Record<CssTokenImportRole, CssTokenImportMatch>>;
  const chartMatches = CHART_ROLES.map((role) => byRole[role]);
  const hasCharts = chartMatches.some(Boolean);

  return {
    name: "Imported CSS",
    ...(byRole.base
      ? {
          customBaseEnabled: true,
          customBaseColor: byRole.base.hex,
        }
      : {}),
    ...(byRole.primary
      ? {
          customPrimaryEnabled: true,
          customPrimaryColor: byRole.primary.hex,
        }
      : {}),
    ...(byRole.accent
      ? {
          customAccentEnabled: true,
          customAccentColor: byRole.accent.hex,
        }
      : {}),
    ...(byRole.destructive
      ? {
          customDestructiveEnabled: true,
          customDestructiveColor: byRole.destructive.hex,
        }
      : {}),
    ...(byRole.success || byRole.warning || byRole.info
      ? {
          additionalStatesEnabled: true,
          ...(byRole.success
            ? {
                customSuccessEnabled: true,
                customSuccessColor: byRole.success.hex,
              }
            : {}),
          ...(byRole.warning
            ? {
                customWarningEnabled: true,
                customWarningColor: byRole.warning.hex,
              }
            : {}),
          ...(byRole.info
            ? {
                customInfoEnabled: true,
                customInfoColor: byRole.info.hex,
              }
            : {}),
        }
      : {}),
    ...(hasCharts
      ? {
          chartStrategy: "multicolor" as const,
          customChartColorEnabled: chartMatches.map(Boolean) as [
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
          ],
          customChartColors: chartMatches.map((match) => match?.hex ?? "") as [
            string,
            string,
            string,
            string,
            string,
          ],
        }
      : {}),
  } satisfies Partial<ThemeSelection>;
}

function createExtraSelectionPatch(tokens: ReadonlyArray<CssToken>) {
  const byName = Object.fromEntries(
    tokens.map((token) => [token.name, token]),
  ) as Partial<Record<string, CssToken>>;
  const radiusScale = getRadiusScale(byName["--radius"]?.value);
  const shadowColor = getColorHex(byName["--shadow-color"]?.value);
  const shadowOpacity = getNumber(byName["--shadow-opacity"]?.value);
  const shadowBlur = getCssLengthPx(byName["--shadow-blur"]?.value);
  const shadowSpread = getCssLengthPx(byName["--shadow-spread"]?.value);
  const shadowOffsetX = getCssLengthPx(byName["--shadow-x"]?.value);
  const shadowOffsetY = getCssLengthPx(byName["--shadow-y"]?.value);
  const trackingNormal = getCssLengthEm(
    byName["--tracking-normal"]?.value ?? byName["--letter-spacing"]?.value,
  );
  const spacing = getCssLengthRem(byName["--spacing"]?.value);

  return {
    ...(radiusScale ? { radiusScale } : {}),
    ...(shadowColor
      ? {
          customShadowEnabled: true,
          customShadowColor: shadowColor,
        }
      : {}),
    ...(shadowOpacity !== null ? { shadowOpacity } : {}),
    ...(shadowBlur !== null ? { shadowBlur } : {}),
    ...(shadowSpread !== null ? { shadowSpread } : {}),
    ...(shadowOffsetX !== null ? { shadowOffsetX } : {}),
    ...(shadowOffsetY !== null ? { shadowOffsetY } : {}),
    ...(trackingNormal !== null ? { trackingNormal } : {}),
    ...(spacing !== null ? { spacing } : {}),
  } satisfies Partial<ThemeSelection>;
}

function getRadiusScale(value: string | undefined) {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue) {
    return null;
  }

  return (Object.entries(RADIUS_SCALE_VALUES).find(
    ([, radiusValue]) => radiusValue === normalizedValue,
  )?.[0] ?? null) as RadiusScale | null;
}

function getColorHex(value: string | undefined) {
  return value ? normalizeColorValue(value) : null;
}

function getNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const number = Number(value.trim());

  return Number.isFinite(number) ? number : null;
}

function getCssLengthPx(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "0") {
    return 0;
  }

  if (!normalizedValue.endsWith("px")) {
    return null;
  }

  const number = Number(normalizedValue.replace(/px$/, ""));

  return Number.isFinite(number) ? number : null;
}

function getCssLengthEm(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "0") {
    return 0;
  }

  if (!normalizedValue.endsWith("em")) {
    return null;
  }

  const number = Number(normalizedValue.replace(/em$/, ""));

  return Number.isFinite(number) ? number : null;
}

function getCssLengthRem(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "0") {
    return 0;
  }

  if (!normalizedValue.endsWith("rem")) {
    return null;
  }

  const number = Number(normalizedValue.replace(/rem$/, ""));

  return Number.isFinite(number) ? number : null;
}

function getRolePriority() {
  return [
    "base",
    "primary",
    "accent",
    "destructive",
    "success",
    "warning",
    "info",
    ...CHART_ROLES,
  ] as const satisfies ReadonlyArray<CssTokenImportRole>;
}
