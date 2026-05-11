import { Link } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { buttonVariants } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { RetroGrid } from "@workspace/ui/components/retro-grid";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowRight,
  Braces,
  ExternalLink,
  Layers3,
  Palette,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  DEFAULT_THEME_SELECTION,
  getGeneratedCustomPalettePreview,
} from "@/lib/theme-generator/generator";
import { getRadixHexScale } from "@/lib/theme-generator/radix";
import type { RadixScaleName } from "@/lib/theme-generator/types";
import { RADIX_STEPS } from "@/lib/theme-generator/types";

const RADIX_COLORS_URL = "https://www.radix-ui.com/colors";
const RADIX_COLORS_SCALES_URL =
  "https://www.radix-ui.com/colors/docs/palette-composition/scales";
const RADIX_COLORS_CUSTOM_PALETTE_URL =
  "https://www.radix-ui.com/colors/custom";
const RADIX_COLORS_SCALE_USAGE_URL =
  "https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale";
const RADIX_COLORS_ALIASING_URL =
  "https://www.radix-ui.com/colors/docs/overview/aliasing";

const demoRadixScales = [
  {
    name: "slate",
    label: "Slate",
  },
  {
    name: "indigo",
    label: "Indigo",
  },
  {
    name: "jade",
    label: "Jade",
  },
  {
    name: "tomato",
    label: "Tomato",
  },
] satisfies Array<{ name: RadixScaleName; label: string }>;

type PaletteDemoMode = "radix" | "custom";

const bridgeDemoTokens = [
  {
    shadcn: "--primary",
    product: "--interactive-primary-default",
    value: "oklch(0.56 0.19 263)",
    group: "interactive",
    role: "Main action",
    example: "Button background",
    description:
      "Primary CTAs keep their shadcn name and inherit your brand action token.",
  },
  {
    shadcn: "--background",
    product: "--surface-canvas",
    value: "oklch(0.99 0.01 260)",
    group: "surface",
    role: "App canvas",
    example: "Page background",
    description:
      "Page surfaces can move with your product system without renaming components.",
  },
  {
    shadcn: "--ring",
    product: "--border-focus",
    value: "oklch(0.67 0.16 263)",
    group: "focus",
    role: "Keyboard focus",
    example: "Focus outline",
    description:
      "Focus states stay accessible while resolving to the same focus token everywhere.",
  },
  {
    shadcn: "--font-sans",
    product: "--typography-font-body",
    value: "Inter, sans-serif",
    group: "type",
    role: "Body font",
    example: "Component text",
    description:
      "Typography tokens can travel through the same bridge as color variables.",
  },
] as const;

type BridgeDemoToken = (typeof bridgeDemoTokens)[number]["shadcn"];

const mappingRows = [
  ["background", "base · step 1", "App canvas"],
  ["foreground", "base · step 12", "Primary text"],
  ["card / popover", "base · step 2", "Raised surfaces"],
  ["muted", "base · step 2", "Quiet surfaces"],
  ["muted-foreground", "base · step 11", "Supporting text"],
  ["primary", "brand · step 9", "Main action"],
  ["primary-foreground", "solid foreground", "Text on action"],
  ["border", "base · step 6", "Default divider"],
  ["input", "base · step 7", "Editable field edge"],
  ["ring", "brand · step 8", "Visible focus"],
  ["sidebar", "base · step 2", "Navigation surface"],
  ["sidebar-foreground", "base · step 12", "Sidebar text"],
  ["sidebar-primary", "brand · step 9", "Sidebar action"],
  ["sidebar-primary-foreground", "solid foreground", "Text on action"],
  ["sidebar-accent", "accent · step 3", "Hover / active"],
  ["sidebar-accent-foreground", "accent · step 12", "Text on accent"],
  ["sidebar-border", "base · step 6", "Sidebar dividers"],
  ["sidebar-ring", "brand · step 8", "Sidebar focus"],
] as const;

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const featureReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function isFullHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function LandingPage() {
  const [paletteDemoMode, setPaletteDemoMode] =
    useState<PaletteDemoMode>("radix");
  const [selectedScale, setSelectedScale] = useState<RadixScaleName>("indigo");
  const [customColor, setCustomColor] = useState("#2563eb");
  const [selectedBridgeToken, setSelectedBridgeToken] =
    useState<BridgeDemoToken>("--primary");
  const paletteDemo = useMemo(() => {
    if (paletteDemoMode === "custom") {
      return getGeneratedCustomPalettePreview({
        selection: DEFAULT_THEME_SELECTION,
        color: customColor,
        role: "accent",
      });
    }

    return getRadixHexScale(selectedScale);
  }, [customColor, paletteDemoMode, selectedScale]);
  const previewColor = paletteDemo?.light[9] ?? customColor;
  const previewSurface = paletteDemo?.light[2] ?? "var(--muted)";
  const previewBorder = paletteDemo?.light[6] ?? "var(--border)";
  const previewText = paletteDemo?.light[12] ?? "var(--foreground)";
  const previewMutedText = paletteDemo?.light[11] ?? "var(--muted-foreground)";
  const colorInputValue = isFullHexColor(customColor) ? customColor : "#2563eb";
  const activeBridgeToken =
    bridgeDemoTokens.find((token) => token.shadcn === selectedBridgeToken) ??
    bridgeDemoTokens[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate overflow-hidden">
        <RetroGrid
          aria-hidden="true"
          angle={12}
          cellSize={128}
          className="absolute inset-0 -z-10"
          darkLineColor="var(--border)"
          lightLineColor="var(--border)"
          opacity={0.8}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--background)_72%,transparent)_0,transparent_45%),linear-gradient(to_bottom,transparent_38%,var(--background)_92%)]"
        />
        <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            animate="visible"
            className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center"
            initial="hidden"
            transition={{ staggerChildren: 0.08 }}
          >
            <motion.h1
              className="text-5xl font-semibold tracking-normal text-balance sm:text-6xl lg:text-7xl"
              variants={fadeIn}
            >
              Build Shadcn themes from a{" "}
              <a
                className="relative inline-block text-foreground transition-colors hover:text-foreground"
                href={RADIX_COLORS_SCALES_URL}
                rel="noreferrer"
                target="_blank"
              >
                <span className="relative z-10">real color scale</span>
                <motion.span
                  aria-hidden="true"
                  className="-bottom-1.5 absolute right-0 left-0 h-1 origin-left -rotate-1 rounded-full bg-orange-500"
                  transition={{ delay: 0.45, duration: 0.45, ease: "easeOut" }}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1 },
                  }}
                />
              </a>
              .
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
              variants={fadeIn}
            >
              Choose the{" "}
              <ExternalTextLink href={RADIX_COLORS_URL}>
                Radix Color palette
              </ExternalTextLink>
              , keep the Shadcn API. Same components, better color decisions
              behind them.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              variants={fadeIn}
            >
              <Link
                className={cn(buttonVariants({ size: "lg" }), "w-fit")}
                to="/create"
              >
                Create theme
                <ArrowRight aria-hidden="true" />
              </Link>
              <a
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-fit bg-background/80 backdrop-blur",
                )}
                href="https://github.com/damianricobelli/radixcn"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
                <ExternalLink aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        id="why"
        initial="hidden"
        transition={{ duration: 0.45, ease: "easeOut" }}
        variants={featureReveal}
        viewport={{ once: true, amount: 0.35 }}
        whileInView="visible"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28">
          <div className="self-center">
            <Badge variant="outline">Radix Color scales</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
              Start from color scales that already know their job.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                Pick{" "}
                <ExternalTextLink href={RADIX_COLORS_SCALES_URL}>
                  Radix families
                </ExternalTextLink>{" "}
                for neutral surfaces, brand actions, accents, states, and
                charts. RadixCN translates those 1-12 steps into the shadcn
                token contract.
              </p>
              <p>
                Custom palettes are inspired by{" "}
                <ExternalTextLink href={RADIX_COLORS_CUSTOM_PALETTE_URL}>
                  Radix Colors custom palette
                </ExternalTextLink>
                : one color becomes a full scale, then each semantic token gets
                a deliberate step.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b bg-muted/35 px-4 py-3">
              <div className="flex items-center gap-2">
                <Palette
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                <span className="text-sm font-medium">Palette demo</span>
              </div>
              <span className="rounded-sm border bg-background px-2 py-1 font-mono text-[0.7rem] text-muted-foreground">
                12 steps
              </span>
            </div>
            <div className="space-y-5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex h-8 w-fit rounded-md bg-muted p-0.75">
                  {(["radix", "custom"] as const).map((mode) => (
                    <button
                      aria-pressed={paletteDemoMode === mode}
                      className={cn(
                        "rounded-sm px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        paletteDemoMode === mode &&
                          "bg-background text-foreground shadow-sm",
                      )}
                      key={mode}
                      onClick={() => setPaletteDemoMode(mode)}
                      type="button"
                    >
                      {mode === "radix" ? "Radix" : "Custom"}
                    </button>
                  ))}
                </div>

                {paletteDemoMode === "custom" ? (
                  <div className="flex w-full items-center gap-2 sm:w-44">
                    <input
                      aria-label="Custom palette color"
                      className="size-8 shrink-0 cursor-pointer rounded-md border bg-background p-1"
                      onChange={(event) => setCustomColor(event.target.value)}
                      type="color"
                      value={colorInputValue}
                    />
                    <Input
                      aria-label="Custom hex color"
                      className="h-8 font-mono text-xs"
                      onChange={(event) => setCustomColor(event.target.value)}
                      value={customColor}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {demoRadixScales.map((scale) => (
                      <button
                        aria-pressed={selectedScale === scale.name}
                        className={cn(
                          "rounded-sm border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          selectedScale === scale.name &&
                            "border-foreground/20 bg-muted text-foreground",
                        )}
                        key={scale.name}
                        onClick={() => setSelectedScale(scale.name)}
                        type="button"
                      >
                        {scale.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <PaletteScaleRow
                  colors={paletteDemo?.light}
                  label="Light"
                  selectedStep={9}
                />
                <PaletteScaleRow
                  colors={paletteDemo?.dark}
                  label="Dark"
                  selectedStep={9}
                />
              </div>

              <div
                className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_auto]"
                style={{
                  backgroundColor: previewSurface,
                  borderColor: previewBorder,
                  color: previewText,
                }}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Primary action</div>
                  <div
                    className="mt-1 text-xs"
                    style={{ color: previewMutedText }}
                  >
                    <ExternalTextLink href={RADIX_COLORS_SCALE_USAGE_URL}>
                      Step 9
                    </ExternalTextLink>{" "}
                    powers the solid color while the scale keeps hover, borders,
                    and quiet surfaces related.
                  </div>
                </div>
                <button
                  className="h-8 rounded-md px-3 text-sm font-medium text-white shadow-sm transition-transform active:translate-y-px"
                  style={{ backgroundColor: previewColor }}
                  type="button"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28"
        initial="hidden"
        transition={{ duration: 0.45, ease: "easeOut" }}
        variants={featureReveal}
        viewport={{ once: true, amount: 0.35 }}
        whileInView="visible"
      >
        <div className="self-center">
          <Badge variant="outline">Token Bridge</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
            Keep shadcn compatible without giving up your token system.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              Bridge mode is a compatibility layer for teams with an existing
              design system. Your components still read{" "}
              <span className="font-mono text-foreground">--primary</span>,
              <span className="font-mono text-foreground"> --background</span>,
              <span className="font-mono text-foreground"> --ring</span>, and
              <span className="font-mono text-foreground"> --font-sans</span>,
              while those variables resolve to{" "}
              <ExternalTextLink href={RADIX_COLORS_ALIASING_URL}>
                semantic aliases
              </ExternalTextLink>{" "}
              in your product tokens.
            </p>
          </div>
        </div>

        <div className="h-fit overflow-hidden rounded-md border bg-background shadow-sm lg:self-center">
          <div className="flex items-center justify-between border-b bg-muted/35 px-4 py-3">
            <div className="flex items-center gap-2">
              <Braces
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm font-medium">Bridge export</span>
            </div>
            <span className="rounded-sm border bg-background px-2 py-1 font-mono text-[0.7rem] text-muted-foreground">
              :root
            </span>
          </div>
          <div className="space-y-5 p-4">
            <div className="flex flex-wrap gap-1.5">
              {bridgeDemoTokens.map((token) => (
                <button
                  aria-pressed={selectedBridgeToken === token.shadcn}
                  className={cn(
                    "rounded-sm border px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedBridgeToken === token.shadcn &&
                      "border-foreground/20 bg-muted text-foreground",
                  )}
                  key={token.shadcn}
                  onClick={() => setSelectedBridgeToken(token.shadcn)}
                  type="button"
                >
                  {token.shadcn}
                </button>
              ))}
            </div>

            <div className="grid gap-3 rounded-md border bg-muted/20 p-3">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <BridgeTokenStep
                  label="shadcn token"
                  value={activeBridgeToken.shadcn}
                />
                <div className="hidden justify-center text-muted-foreground sm:flex">
                  <ArrowRight aria-hidden="true" className="size-4" />
                </div>
                <BridgeTokenStep
                  label="your token"
                  value={activeBridgeToken.product}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {activeBridgeToken.example} resolves through{" "}
                <span className="font-mono text-foreground">
                  {activeBridgeToken.group}
                </span>
                .
              </div>
            </div>

            <div className="grid gap-3 rounded-md border bg-background p-3 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <div className="text-sm font-semibold">
                  {activeBridgeToken.role}
                </div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                  {activeBridgeToken.shadcn}: var({activeBridgeToken.product})
                </div>
              </div>
              <button
                className={cn(
                  "h-8 rounded-md px-3 text-sm font-medium transition-all active:translate-y-px",
                  selectedBridgeToken === "--ring"
                    ? "border bg-background text-foreground ring-3 ring-ring/50"
                    : "bg-primary text-primary-foreground",
                  selectedBridgeToken === "--background" &&
                    "border bg-muted text-foreground",
                )}
                style={
                  selectedBridgeToken === "--font-sans"
                    ? { fontFamily: "var(--font-sans)" }
                    : undefined
                }
                type="button"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28"
        initial="hidden"
        transition={{ duration: 0.45, ease: "easeOut" }}
        variants={featureReveal}
        viewport={{ once: true, amount: 0.35 }}
        whileInView="visible"
      >
        <div className="self-center">
          <Badge variant="outline">Token map</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
            Every shadcn token gets a deliberate{" "}
            <ExternalTextLink href={RADIX_COLORS_SCALE_USAGE_URL}>
              Radix step
            </ExternalTextLink>
            .
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              RadixCN preserves the API your components already use, then maps
              each token to the scale step that fits its role.
            </p>
            <p>
              The result is predictable CSS: surfaces stay quiet, text stays
              readable, actions stay prominent, and focus states stay visible.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b bg-muted/35 px-4 py-3">
            <div className="flex items-center gap-2">
              <Layers3
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="text-sm font-medium">Mapping preview</span>
            </div>
            <span className="rounded-sm border bg-background px-2 py-1 font-mono text-[0.7rem] text-muted-foreground">
              {mappingRows.length} tokens
            </span>
          </div>
          <div className="max-h-[22rem] divide-y overflow-y-auto">
            {mappingRows.map(([token, source, role]) => (
              <div
                className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[0.75fr_0.75fr_1fr] sm:items-center"
                key={token}
              >
                <span className="font-mono text-foreground">{token}</span>
                <span className="w-fit rounded-sm border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                  {source}
                </span>
                <span className="text-muted-foreground">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        transition={{ duration: 0.45, ease: "easeOut" }}
        variants={featureReveal}
        viewport={{ once: true, amount: 0.45 }}
        whileInView="visible"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-24 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Layers3 aria-hidden="true" className="size-4" />
              <span>Scale, semantic tokens, bridge aliases.</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-normal">
              Ready to generate a theme?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a{" "}
              <ExternalTextLink href={RADIX_COLORS_SCALES_URL}>
                Radix color family
              </ExternalTextLink>{" "}
              or generate a custom 1-12 palette, then copy fixed shadcn CSS or
              bridge it to your system.
            </p>
          </div>
          <Link className={buttonVariants()} to="/create">
            Open generator
            <Sparkles aria-hidden="true" />
          </Link>
        </div>
      </motion.section>
    </main>
  );
}

function PaletteScaleRow({
  colors,
  label,
  selectedStep,
}: PaletteScaleRowProps) {
  return (
    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="grid min-w-0 grid-cols-12 overflow-hidden rounded-sm border">
        {RADIX_STEPS.map((step) => (
          <span
            aria-label={`${label} step ${step}`}
            className={cn(
              "h-8 min-w-0 border-border border-r last:border-r-0",
              step === selectedStep && "ring-2 ring-foreground/50 ring-inset",
            )}
            key={step}
            role="img"
            style={{ backgroundColor: colors?.[step] ?? "var(--muted)" }}
            title={`${label} ${step}: ${colors?.[step] ?? "Unavailable"}`}
          />
        ))}
      </div>
    </div>
  );
}

type PaletteScaleRowProps = {
  colors?: Record<(typeof RADIX_STEPS)[number], string>;
  label: string;
  selectedStep: (typeof RADIX_STEPS)[number];
};

function BridgeTokenStep({ label, value }: BridgeTokenStepProps) {
  return (
    <div className="min-w-0 rounded-sm border bg-background p-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 break-all font-mono text-sm text-foreground">
        {value}
      </div>
    </div>
  );
}

type BridgeTokenStepProps = {
  label: string;
  value: string;
};

function ExternalTextLink({ children, href }: ExternalTextLinkProps) {
  return (
    <a
      className="font-medium text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

type ExternalTextLinkProps = {
  children: ReactNode;
  href: string;
};
