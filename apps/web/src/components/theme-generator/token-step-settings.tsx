import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@workspace/ui/components/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { CircleAlert, Info, RotateCcw, Settings2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  PanelSection,
  SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
  SIDEBAR_DROPDOWN_SCROLL_CONTENT_CLASSNAME,
  SidebarDropdown,
} from "@/components/theme-generator/theme-customizer-section";
import { getSolidForegroundForCssColor } from "@/lib/theme-generator/color";
import {
  getSemanticTokenDefaultStep,
  getSemanticTokenStepPreviewColor,
} from "@/lib/theme-generator/generator";
import {
  type ColorMode,
  RADIX_STEPS,
  type RadixStep,
  type SemanticToken,
  type ThemeSelection,
} from "@/lib/theme-generator/types";

export function TokenStepSettings({
  mode,
  selection,
  onModeChange,
  onUpdate,
}: TokenStepSettingsProps) {
  const [editingMode, setEditingMode] = useState<ColorMode>(mode);
  const overriddenCount = Object.values(selection.tokenStepOverrides).reduce(
    (count, override) =>
      count +
      Number(Boolean(override?.light)) +
      Number(Boolean(override?.dark)),
    0,
  );

  return (
    <PanelSection
      title="Token steps"
      info={<TokenStepsInfo />}
      grouped={false}
      action={
        <Button
          aria-label="Reset token step overrides"
          disabled={overriddenCount === 0}
          size="icon-sm"
          variant="ghost"
          onClick={() => onUpdate({ tokenStepOverrides: {} })}
        >
          <RotateCcw />
        </Button>
      }
    >
      <Tabs
        className="gap-3"
        value={editingMode}
        onValueChange={(value) => {
          const nextMode = value as ColorMode;

          setEditingMode(nextMode);
          onModeChange(nextMode);
        }}
      >
        <TabsList className="w-full border">
          <TabsTrigger value="light">Light</TabsTrigger>
          <TabsTrigger value="dark">Dark</TabsTrigger>
        </TabsList>
        {(["light", "dark"] as const).map((tokenMode) => (
          <TabsContent key={tokenMode} value={tokenMode}>
            <TokenStepModePanel
              mode={tokenMode}
              selection={selection}
              onUpdate={onUpdate}
            />
          </TabsContent>
        ))}
      </Tabs>
    </PanelSection>
  );
}

type TokenStepSettingsProps = {
  mode: ColorMode;
  selection: ThemeSelection;
  onModeChange: (mode: ColorMode) => void;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};

function TokenStepModePanel({
  mode,
  selection,
  onUpdate,
}: TokenStepModePanelProps) {
  return (
    <Accordion
      className="overflow-hidden rounded-lg border border-sidebar-border bg-transparent"
      defaultValue={["Core"]}
    >
      {getTokenStepSections(selection).map((section) => (
        <TokenStepAccordionItem
          key={section.title}
          title={section.title}
          value={section.title}
        >
          {section.tokens.map((token) => (
            <TokenModeStepPicker
              key={token}
              mode={mode}
              selection={selection}
              token={token}
              onChange={(step) =>
                onUpdate({
                  tokenStepOverrides: updateTokenStepOverride(
                    selection,
                    token,
                    mode,
                    step,
                  ),
                })
              }
            />
          ))}
        </TokenStepAccordionItem>
      ))}
    </Accordion>
  );
}

type TokenStepModePanelProps = {
  mode: ColorMode;
  selection: ThemeSelection;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};

const BASE_TOKEN_STEP_SECTIONS = [
  {
    title: "Core",
    tokens: [
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
    ],
  },
  {
    title: "Structure",
    tokens: ["border", "input", "ring"],
  },
  {
    title: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    title: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
] as const satisfies ReadonlyArray<TokenStepSection>;

const DESTRUCTIVE_TOKEN_STEPS = [
  "destructive",
  "destructive-foreground",
  "destructive-muted",
  "destructive-muted-foreground",
  "destructive-border",
] as const satisfies ReadonlyArray<SemanticToken>;

const ADDITIONAL_STATE_TOKEN_STEPS = [
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
] as const satisfies ReadonlyArray<SemanticToken>;

type TokenStepSection = {
  title: string;
  tokens: ReadonlyArray<SemanticToken>;
};

function getTokenStepSections(selection: ThemeSelection) {
  const stateTokens = selection.additionalStatesEnabled
    ? [...DESTRUCTIVE_TOKEN_STEPS, ...ADDITIONAL_STATE_TOKEN_STEPS]
    : DESTRUCTIVE_TOKEN_STEPS;
  const [coreSection, ...remainingSections] = BASE_TOKEN_STEP_SECTIONS;

  return [
    coreSection,
    {
      title: "States",
      tokens: stateTokens,
    },
    ...remainingSections,
  ];
}

function TokenStepAccordionItem({
  title,
  value,
  children,
}: TokenStepAccordionItemProps) {
  return (
    <AccordionItem
      className="border-sidebar-border last:border-b-0"
      value={value}
    >
      <AccordionTrigger className="rounded-none px-2.5 py-2 hover:no-underline focus-visible:ring-sidebar-ring">
        <span className="truncate text-[11px] font-semibold tracking-wide text-sidebar-foreground/65 uppercase">
          {title}
        </span>
      </AccordionTrigger>
      <AccordionContent className="divide-y divide-sidebar-border/70 border-sidebar-border border-t p-0 pb-0">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

type TokenStepAccordionItemProps = {
  title: string;
  value: string;
  children: ReactNode;
};

function TokenStepsInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            aria-label="Learn how token steps work"
            className="inline-flex rounded-full text-destructive transition-colors hover:text-destructive/85 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:outline-none"
            type="button"
          />
        }
      >
        <CircleAlert aria-hidden="true" className="size-4" />
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-80 space-y-2">
        <div className="text-sm font-medium text-destructive">
          Override carefully
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Default steps are tuned to work across color combinations. Change them
          only when a specific light or dark theme needs a higher or lower step.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

function TokenModeStepPicker({
  mode,
  selection,
  token,
  onChange,
}: TokenModeStepPickerProps) {
  const defaultStep = getSemanticTokenDefaultStep(selection, token, mode);
  const overrideStep = selection.tokenStepOverrides[token]?.[mode] ?? null;
  const activeStep = overrideStep ?? defaultStep;
  const activeColor = activeStep
    ? getSemanticTokenStepPreviewColor(selection, token, mode, activeStep)
    : null;
  const usesContrastRule = defaultStep === null;
  const contrastRuleValue = "contrast-rule";

  return (
    <SidebarDropdown
      ariaLabel={`Open ${token} ${mode} step menu. Current value: ${getStepDisplayValue(activeStep)}.`}
      contentClassName={SIDEBAR_DROPDOWN_SCROLL_CONTENT_CLASSNAME}
      label={
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate">{token}</span>
          {overrideStep ? (
            <Settings2
              aria-label="Overridden from recommended step"
              className="size-3.5 shrink-0 text-destructive"
            />
          ) : null}
        </span>
      }
      swatch={activeColor ?? undefined}
      value={getStepDisplayValue(activeStep)}
    >
      <DropdownMenuRadioGroup
        value={activeStep ? String(activeStep) : contrastRuleValue}
        onValueChange={(value) => {
          if (value === contrastRuleValue) {
            onChange(null);
            return;
          }

          const nextStep = Number(value) as RadixStep;

          onChange(nextStep === defaultStep ? null : nextStep);
        }}
      >
        {usesContrastRule ? (
          <DropdownMenuRadioItem
            className={[
              SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
              "grid grid-cols-[1.5rem_minmax(3.25rem,1fr)_auto] gap-2.5 pr-8",
            ].join(" ")}
            value={contrastRuleValue}
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-sm bg-sidebar-accent text-[10px] font-semibold text-sidebar-foreground shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]">
              Aa
            </span>
            <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              Contrast
              <ContrastRuleInfo />
            </span>
            <Badge className="h-4 px-1.5 text-[10px]" variant="outline">
              Recommended
            </Badge>
          </DropdownMenuRadioItem>
        ) : null}
        {RADIX_STEPS.map((step) => {
          const color = getSemanticTokenStepPreviewColor(
            selection,
            token,
            mode,
            step,
          );
          const foreground = color
            ? getSolidForegroundForCssColor(color)
            : "var(--sidebar-foreground)";

          return (
            <DropdownMenuRadioItem
              className={[
                SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
                "grid grid-cols-[1.5rem_minmax(3.25rem,1fr)_auto] gap-2.5 pr-8",
              ].join(" ")}
              key={step}
              value={String(step)}
            >
              <span
                className="grid size-6 shrink-0 place-items-center rounded-sm text-[10px] font-semibold shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]"
                style={{
                  backgroundColor: color ?? "var(--sidebar-accent)",
                  color: foreground,
                }}
              >
                {step}
              </span>
              <span className="whitespace-nowrap">Step {step}</span>
              {step === defaultStep ? (
                <Badge className="h-4 px-1.5 text-[10px]" variant="outline">
                  Recommended
                </Badge>
              ) : null}
            </DropdownMenuRadioItem>
          );
        })}
      </DropdownMenuRadioGroup>
    </SidebarDropdown>
  );
}

type TokenModeStepPickerProps = {
  mode: ColorMode;
  selection: ThemeSelection;
  token: SemanticToken;
  onChange: (step: RadixStep | null) => void;
};

function ContrastRuleInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <span
            aria-label="Learn how contrast steps work"
            className="inline-flex rounded-full text-sidebar-foreground/55 transition-colors hover:text-sidebar-foreground"
            role="img"
          />
        }
      >
        <Info aria-hidden="true" className="size-3.5" />
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-72 space-y-2">
        <div className="text-sm font-medium">Contrast rule</div>
        <p className="text-xs leading-5 text-muted-foreground">
          Contrast chooses a readable foreground color from the active
          background instead of locking this token to a fixed Radix step.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

function getStepDisplayValue(step: RadixStep | null) {
  return step ? `Step ${step}` : "Contrast";
}

function updateTokenStepOverride(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
  step: RadixStep | null,
) {
  const nextOverrides = { ...selection.tokenStepOverrides };
  const tokenOverride = { ...(nextOverrides[token] ?? {}) };

  if (step) {
    tokenOverride[mode] = step;
  } else {
    delete tokenOverride[mode];
  }

  if (tokenOverride.light || tokenOverride.dark) {
    nextOverrides[token] = tokenOverride;
  } else {
    delete nextOverrides[token];
  }

  return nextOverrides;
}
