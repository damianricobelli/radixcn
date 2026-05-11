import { Link } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { buttonVariants } from "@workspace/ui/components/button";
import { RetroGrid } from "@workspace/ui/components/retro-grid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Braces, Layers3, Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const colorDecisionRows = [
  ["base", "Slate", "canvas, text, borders"],
  ["brand", "Indigo", "primary, ring, focus"],
  ["accent", "Jade", "hover, active, subtle UI"],
  ["status", "Tomato / Amber", "destructive, warning"],
  ["charts", "Multicolor", "chart-1 through chart-5"],
];

const paletteSwatches = [
  {
    name: "Slate",
    colors: ["#f8fafc", "#e2e8f0", "#94a3b8", "#475569", "#0f172a"],
  },
  {
    name: "Indigo",
    colors: ["#eef2ff", "#c7d2fe", "#818cf8", "#4f46e5", "#312e81"],
  },
  {
    name: "Jade",
    colors: ["#ecfdf5", "#a7f3d0", "#34d399", "#059669", "#064e3b"],
  },
];

const bridgeRows = [
  ["--background", "var(--surface-canvas)", "surface"],
  ["--foreground", "var(--content-default)", "content"],
  ["--primary", "var(--interactive-primary-default)", "interactive"],
  ["--primary-foreground", "var(--interactive-primary-foreground)", "content"],
  ["--ring", "var(--border-focus)", "focus"],
  ["--font-sans", "var(--typography-font-body)", "typography"],
];

const mappingRows = [
  ["background", "App canvas", "base · step 1"],
  ["foreground", "Primary text", "base · step 12"],
  ["card / popover", "Raised surfaces", "base · step 2"],
  ["muted", "Quiet surface", "base · step 2"],
  ["muted-foreground", "Supporting text", "base · step 11"],
  ["primary", "Main action", "brand · step 9"],
  ["primary-foreground", "Text on action", "solid foreground rule"],
  ["border", "Default divider", "base · step 6"],
  ["input", "Editable field edge", "base · step 7"],
  ["ring", "Visible focus", "brand · step 8"],
  ["sidebar", "Navigation surface", "base · step 2"],
  ["sidebar-foreground", "Sidebar text", "base · step 12"],
  ["sidebar-primary", "Sidebar main action", "brand · step 9"],
  [
    "sidebar-primary-foreground",
    "Text on sidebar action",
    "solid foreground rule",
  ],
  ["sidebar-accent", "Sidebar hover / active", "accent · step 3"],
  ["sidebar-accent-foreground", "Text on sidebar accent", "accent · step 12"],
  ["sidebar-border", "Sidebar dividers", "base · step 6"],
  ["sidebar-ring", "Sidebar focus ring", "brand · step 8"],
];

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b">
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
              Build Shadcn themes from a real color scale.
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
              variants={fadeIn}
            >
              Choose the Radix Color palette, keep the Shadcn API. Same
              components, better color decisions behind them.
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
                href="#why"
              >
                Why it exists
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-y bg-muted/20" id="why">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="self-center">
            <Badge variant="outline">Radix Color scales</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
              Start from color scales that already know their job.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                Pick Radix families for neutral surfaces, brand actions,
                accents, states, and charts. RadixCN translates those 1-12 steps
                into the shadcn token contract.
              </p>
              <p>
                Custom palettes are powered by the Radix Colors algorithm: one
                color becomes a full scale, then each semantic token gets a
                deliberate step.
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
                <span className="text-sm font-medium">Color decisions</span>
              </div>
              <span className="rounded-sm border bg-background px-2 py-1 font-mono text-[0.7rem] text-muted-foreground">
                example
              </span>
            </div>
            <div className="divide-y">
              {colorDecisionRows.map(([role, scale, usage]) => (
                <div
                  className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[0.45fr_0.45fr_1fr]"
                  key={role}
                >
                  <span className="font-mono text-foreground">{role}</span>
                  <span className="font-medium text-foreground">{scale}</span>
                  <span className="text-muted-foreground">{usage}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-4 border-t bg-muted/20 p-4 sm:grid-cols-3">
              {paletteSwatches.map(({ name, colors }) => (
                <div className="min-w-0" key={name}>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">
                    {name}
                  </div>
                  <div className="grid grid-cols-5 overflow-hidden rounded-sm border">
                    {colors.map((color) => (
                      <span
                        aria-hidden="true"
                        className="h-8"
                        key={color}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
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
              while those variables resolve to your product tokens.
            </p>
            <p>
              It keeps RadixCN as the palette studio without forcing your app to
              mix naming systems. Map shadcn tokens to surface, content,
              interactive, structure, status, and typography tokens you already
              use.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border bg-background shadow-sm">
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
          <div className="divide-y">
            {bridgeRows.map(([token, value, group]) => (
              <div
                className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[0.75fr_1.25fr_0.5fr]"
                key={token}
              >
                <span className="font-mono text-foreground">{token}</span>
                <span className="font-mono text-muted-foreground">{value}</span>
                <span className="text-muted-foreground">{group}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <Badge variant="outline">Mapping table</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance">
              How shadcn tokens map to Radix steps
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">
            RadixCN keeps the full shadcn token contract you already know. Then
            it decides which Radix step should power each token across
            backgrounds, text, borders, accents, rings, sidebars, and charts.
          </p>
        </div>
        <div className="mt-5 overflow-hidden rounded-md border bg-background shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>shadcn token</TableHead>
                <TableHead>UI role</TableHead>
                <TableHead>Radix source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappingRows.map(([token, role, source]) => (
                <TableRow key={token}>
                  <TableCell className="font-mono text-xs">{token}</TableCell>
                  <TableCell>{role}</TableCell>
                  <TableCell>
                    <span className="border bg-muted px-2 py-1 font-mono text-xs">
                      {source}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Layers3 aria-hidden="true" className="size-4" />
              <span>Scale, semantic tokens, bridge aliases.</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-normal">
              Ready to generate a theme?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a Radix color family or generate a custom 1-12 palette, then
              copy fixed shadcn CSS or bridge it to your system.
            </p>
          </div>
          <Link className={buttonVariants()} to="/create">
            Open generator
            <Sparkles aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
