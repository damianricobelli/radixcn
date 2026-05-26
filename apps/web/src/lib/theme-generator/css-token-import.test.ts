import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { importCssTokens } from "./css-token-import";

const SHADCN_THEME_CSS = `
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #2563eb;
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: #7c3aed;
  --accent-foreground: oklch(0.205 0 0);
  --destructive: #dc2626;
  --destructive-foreground: oklch(0.985 0 0);
  --destructive-muted: oklch(0.94 0.03 20);
  --destructive-muted-foreground: oklch(0.5 0.12 25);
  --destructive-border: oklch(0.7 0.1 25);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: #2563eb;
  --chart-1: #2563eb;
  --chart-2: #16a34a;
  --chart-3: #f59e0b;
  --chart-4: #9333ea;
  --chart-5: #ef4444;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: #2563eb;
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: #2563eb;
  --success: #16a34a;
  --success-foreground: oklch(0.985 0 0);
  --success-muted: oklch(0.94 0.04 145);
  --success-muted-foreground: oklch(0.5 0.12 145);
  --success-border: oklch(0.7 0.1 145);
  --warning: #f59e0b;
  --warning-foreground: oklch(0.145 0 0);
  --warning-muted: oklch(0.95 0.06 85);
  --warning-muted-foreground: oklch(0.52 0.12 85);
  --warning-border: oklch(0.78 0.13 85);
  --info: #0ea5e9;
  --info-foreground: oklch(0.985 0 0);
  --info-muted: oklch(0.94 0.04 240);
  --info-muted-foreground: oklch(0.5 0.12 240);
  --info-border: oklch(0.7 0.1 240);
  --font-sans: Inter, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-heading: Inter, sans-serif;
  --radius: 0.75rem;
  --spacing: 0.25rem;
  --tracking-normal: 0.01em;
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --shadow-x: 1px;
  --shadow-y: 2px;
  --shadow-blur: 12px;
  --shadow-spread: -1px;
  --shadow-opacity: 0.24;
  --shadow-color: #111827;
  --shadow-2xs: 1px 2px 12px -1px hsl(220 13% 18% / 0.12);
  --shadow-xs: 1px 2px 12px -1px hsl(220 13% 18% / 0.12);
  --shadow-sm: 1px 2px 12px -1px hsl(220 13% 18% / 0.24);
  --shadow: 1px 2px 12px -1px hsl(220 13% 18% / 0.24);
  --shadow-md: 1px 2px 12px -1px hsl(220 13% 18% / 0.24);
  --shadow-lg: 1px 2px 12px -1px hsl(220 13% 18% / 0.24);
  --shadow-xl: 1px 2px 12px -1px hsl(220 13% 18% / 0.24);
  --shadow-2xl: 1px 2px 12px -1px hsl(220 13% 18% / 0.6);
}

.dark {
  --background: oklch(0.2303 0.0125 264.2926);
  --foreground: oklch(0.9219 0 0);
  --card: oklch(0.3210 0.0078 223.6661);
  --card-foreground: oklch(0.9219 0 0);
  --popover: oklch(0.3210 0.0078 223.6661);
  --popover-foreground: oklch(0.9219 0 0);
  --primary: oklch(0.8027 0.1355 349.2347);
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.7395 0.2268 142.8504);
  --secondary-foreground: oklch(0 0 0);
  --muted: oklch(0.3867 0 0);
  --muted-foreground: oklch(0.7155 0 0);
  --accent: oklch(0.8148 0.0819 225.7537);
  --accent-foreground: oklch(0 0 0);
  --border: oklch(0.3867 0 0);
  --input: oklch(0.3867 0 0);
  --ring: oklch(0.8027 0.1355 349.2347);
}
`;

const EXPECTED_COLOR_TOKENS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--destructive-muted",
  "--destructive-muted-foreground",
  "--destructive-border",
  "--border",
  "--input",
  "--ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
  "--success",
  "--success-foreground",
  "--success-muted",
  "--success-muted-foreground",
  "--success-border",
  "--warning",
  "--warning-foreground",
  "--warning-muted",
  "--warning-muted-foreground",
  "--warning-border",
  "--info",
  "--info-foreground",
  "--info-muted",
  "--info-muted-foreground",
  "--info-border",
] as const;

const EXPECTED_EXTRA_TOKENS = [
  "--font-sans",
  "--font-mono",
  "--font-heading",
  "--radius",
  "--spacing",
  "--tracking-normal",
  "--tracking-tight",
  "--tracking-wide",
  "--shadow-x",
  "--shadow-y",
  "--shadow-blur",
  "--shadow-spread",
  "--shadow-opacity",
  "--shadow-color",
  "--shadow-2xs",
  "--shadow-xs",
  "--shadow-sm",
  "--shadow",
  "--shadow-md",
  "--shadow-lg",
  "--shadow-xl",
  "--shadow-2xl",
] as const;

describe("importCssTokens", () => {
  it("detects shadcn color variables and supported Radixcn extras", () => {
    const result = importCssTokens(SHADCN_THEME_CSS);
    const tokenNames = new Set(result.tokens.map((token) => token.name));
    const colorTokenNames = new Set(
      result.colorTokens.map((token) => token.name),
    );

    assert.deepEqual(
      EXPECTED_COLOR_TOKENS.filter((token) => !colorTokenNames.has(token)),
      [],
    );
    assert.deepEqual(
      EXPECTED_EXTRA_TOKENS.filter((token) => !tokenNames.has(token)),
      [],
    );
    assert.equal(result.colorTokens.length, EXPECTED_COLOR_TOKENS.length);
    assert.equal(result.tokens.length, 72);
  });

  it("maps detected shadcn tokens into theme selection values", () => {
    const result = importCssTokens(SHADCN_THEME_CSS);
    const roles = Object.fromEntries(
      result.matches.map((match) => [match.role, match.name]),
    );

    assert.equal(roles.primary, "--primary");
    assert.equal(roles.accent, "--accent");
    assert.equal(roles.destructive, "--destructive");
    assert.equal(roles.success, "--success");
    assert.equal(roles.warning, "--warning");
    assert.equal(roles.info, "--info");
    assert.equal(roles["chart-1"], "--chart-1");
    assert.equal(roles["chart-5"], "--chart-5");
    assert.equal(Object.values(roles).includes("--muted"), false);
    assert.equal(Object.values(roles).includes("--ring"), false);

    assert.deepEqual(result.selection, {
      name: "Imported CSS",
      customBaseEnabled: true,
      customBaseColor: "#0a0a0a",
      customPrimaryEnabled: true,
      customPrimaryColor: "#2563eb",
      customAccentEnabled: true,
      customAccentColor: "#7c3aed",
      customDestructiveEnabled: true,
      customDestructiveColor: "#dc2626",
      additionalStatesEnabled: true,
      customSuccessEnabled: true,
      customSuccessColor: "#16a34a",
      customWarningEnabled: true,
      customWarningColor: "#f59e0b",
      customInfoEnabled: true,
      customInfoColor: "#0ea5e9",
      chartStrategy: "multicolor",
      customChartColorEnabled: [true, true, true, true, true],
      customChartColors: [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
        "#9333ea",
        "#ef4444",
      ],
      radiusScale: "large",
      customShadowEnabled: true,
      customShadowColor: "#111827",
      shadowOpacity: 0.24,
      shadowBlur: 12,
      shadowSpread: -1,
      shadowOffsetX: 1,
      shadowOffsetY: 2,
      trackingNormal: 0.01,
      spacing: 0.25,
    });
  });
});
