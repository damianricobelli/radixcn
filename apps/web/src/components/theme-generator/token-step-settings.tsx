import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
} from "@workspace/ui/components/color-picker";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { normalizeColorPickerValue } from "@/components/theme-generator/color-value-utils";
import {
  PanelSection,
  SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
  SidebarDropdown,
} from "@/components/theme-generator/theme-customizer-section";
import { getSolidForegroundForCssColor } from "@/lib/theme-generator/color";
import {
  getSemanticTokenCustomStepPreviewColor,
  getSemanticTokenDefaultStep,
  getSemanticTokenStepPreviewColor,
} from "@/lib/theme-generator/generator";
import {
  type ColorMode,
  RADIX_STEPS,
  type RadixStep,
  type SemanticToken,
  type ThemeSelection,
  type TokenCustomOverride,
  type TokenStepOverride,
} from "@/lib/theme-generator/types";

export function TokenStepSettings({
  mode,
  selection,
  onModeChange,
  onUpdate,
}: TokenStepSettingsProps) {
  const [editingMode, setEditingMode] = useState<ColorMode>(mode);
  const overriddenCount = countModeOverrides(selection.tokenStepOverrides);
  const customCount = countModeOverrides(selection.tokenCustomOverrides);

  return (
    <PanelSection
      title="Tokens"
      info={<TokenStepsInfo />}
      grouped={false}
      action={
        <Button
          aria-label="Reset token overrides"
          disabled={overriddenCount + customCount === 0}
          size="icon-sm"
          variant="ghost"
          onClick={() =>
            onUpdate({ tokenStepOverrides: {}, tokenCustomOverrides: {} })
          }
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
      defaultValue={["Surface"]}
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
              onCustomChange={(value) =>
                onUpdate({
                  tokenCustomOverrides: updateTokenCustomOverride(
                    selection,
                    token,
                    mode,
                    value,
                  ),
                })
              }
              onCustomReset={() =>
                onUpdate({
                  tokenCustomOverrides: updateTokenCustomOverride(
                    selection,
                    token,
                    mode,
                    null,
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
    title: "Surface",
    tokens: ["background", "foreground"],
  },
  {
    title: "Containers",
    tokens: ["card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    title: "Muted",
    tokens: ["muted", "muted-foreground"],
  },
  {
    title: "Interactive / Primary",
    tokens: ["primary", "primary-foreground"],
  },
  {
    title: "Interactive / Secondary",
    tokens: ["secondary", "secondary-foreground"],
  },
  {
    title: "Interactive / Accent",
    tokens: ["accent", "accent-foreground"],
  },
  {
    title: "Status / Destructive",
    tokens: [
      "destructive",
      "destructive-foreground",
      "destructive-muted",
      "destructive-muted-foreground",
      "destructive-border",
    ],
  },
  {
    title: "Structure / Focus",
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

const TOKEN_DROPDOWN_CONTENT_CLASSNAME =
  "w-64 overflow-hidden border border-border p-0 ring-0";

const TOKEN_DROPDOWN_SCROLL_AREA_CLASSNAME =
  "h-[min(34rem,var(--available-height))] max-h-[min(34rem,var(--available-height))] overflow-hidden [--scroll-fade:40px] **:data-[slot=scroll-area-scrollbar]:hidden **:data-[slot=scroll-area-viewport]:animate-[sidebar-scroll-fade_auto_linear] **:data-[slot=scroll-area-viewport]:[mask:linear-gradient(to_bottom,transparent,black_var(--top-fade)_calc(100%-var(--bottom-fade)),transparent)] **:data-[slot=scroll-area-viewport]:[scroll-timeline:--sidebar-scroll-fade_y] **:data-[slot=scroll-area-viewport]:[animation-timeline:--sidebar-scroll-fade] **:data-[slot=scroll-area-viewport]:overflow-x-hidden";

type TokenStepSection = {
  title: string;
  tokens: ReadonlyArray<SemanticToken>;
};

function getTokenStepSections(selection: ThemeSelection) {
  return selection.additionalStatesEnabled
    ? [
        ...BASE_TOKEN_STEP_SECTIONS,
        {
          title: "States",
          tokens: ADDITIONAL_STATE_TOKEN_STEPS,
        },
      ]
    : BASE_TOKEN_STEP_SECTIONS;
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
          Default token steps are tuned to work across color combinations.
          Change them only when a specific light or dark theme needs a higher
          or lower step, or enable a custom scale for a token-specific palette.
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
  onCustomChange,
  onCustomReset,
}: TokenModeStepPickerProps) {
  const defaultStep = getSemanticTokenDefaultStep(selection, token, mode);
  const overrideStep = selection.tokenStepOverrides[token]?.[mode] ?? null;
  const customOverride =
    selection.tokenCustomOverrides?.[token]?.[mode]?.trim() || null;
  const activeStep = overrideStep ?? defaultStep;
  const customActiveStep = overrideStep ?? defaultStep ?? 9;
  const activeColor = activeStep
    ? getSemanticTokenStepPreviewColor(selection, token, mode, activeStep)
    : null;
  const customActiveColor = customOverride
    ? getSemanticTokenCustomStepPreviewColor(
        selection,
        token,
        mode,
        customOverride,
        customActiveStep,
      )
    : null;
  const displayColor = customActiveColor ?? activeColor;
  const usesContrastRule = defaultStep === null;
  const contrastRuleValue = "contrast-rule";
  const fallbackCustomColor =
    activeColor ??
    getSemanticTokenStepPreviewColor(selection, token, mode, 9) ??
    "#000000";
  const displayValue = customOverride
    ? `Custom ${getStepDisplayValue(customActiveStep)}`
    : getStepDisplayValue(activeStep);

  return (
    <SidebarDropdown
      ariaLabel={`Open ${token} ${mode} step menu. Current value: ${displayValue}.`}
      contentClassName={TOKEN_DROPDOWN_CONTENT_CLASSNAME}
      label={
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate">{token}</span>
          {overrideStep || customOverride ? (
            <Settings2
              aria-label="Overridden from recommended step"
              className="size-3.5 shrink-0 text-destructive"
            />
          ) : null}
        </span>
      }
      swatch={displayColor ?? undefined}
      value={displayValue}
    >
      <ScrollArea className={TOKEN_DROPDOWN_SCROLL_AREA_CLASSNAME}>
        <div className="p-1">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Steps</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={
                customOverride
                  ? String(customActiveStep)
                  : activeStep
                    ? String(activeStep)
                    : contrastRuleValue
              }
              onValueChange={(value) => {
                if (value === contrastRuleValue) {
                  onChange(null);
                  return;
                }

                const nextStep = Number(value) as RadixStep;

                onChange(nextStep === defaultStep ? null : nextStep);
              }}
            >
              {usesContrastRule && !customOverride ? (
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
                const color = customOverride
                  ? getSemanticTokenCustomStepPreviewColor(
                      selection,
                      token,
                      mode,
                      customOverride,
                      step,
                    )
                  : getSemanticTokenStepPreviewColor(
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
                      <Badge
                        className="h-4 px-1.5 text-[10px]"
                        variant="outline"
                      >
                        Recommended
                      </Badge>
                    ) : null}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                Custom
                <CustomScaleInfo />
              </span>
              <Button
                aria-label="Reset custom color"
                className="size-6"
                disabled={!customOverride}
                size="icon-sm"
                variant="ghost"
                onClick={onCustomReset}
              >
                <RotateCcw />
              </Button>
            </DropdownMenuLabel>
            <CustomTokenColorPicker
              fallback={fallbackCustomColor}
              value={customOverride ?? ""}
              onChange={onCustomChange}
            />
          </DropdownMenuGroup>
        </div>
      </ScrollArea>
    </SidebarDropdown>
  );
}

type TokenModeStepPickerProps = {
  mode: ColorMode;
  selection: ThemeSelection;
  token: SemanticToken;
  onChange: (step: RadixStep | null) => void;
  onCustomChange: (value: string) => void;
  onCustomReset: () => void;
};

function CustomTokenColorPicker({
  fallback,
  value,
  onChange,
}: CustomTokenColorPickerProps) {
  const pickerValue =
    normalizeColorPickerValue(value) ??
    normalizeColorPickerValue(fallback) ??
    "#000000";

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        className={[
          SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
          "grid grid-cols-[1.5rem_minmax(3.25rem,1fr)_auto_auto] gap-2.5",
        ].join(" ")}
      >
        <span
          className="size-5 shrink-0 rounded-sm shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]"
          style={{ backgroundColor: pickerValue }}
        />
        <span className="min-w-0 flex-1">Base color</span>
        <span className="max-w-24 truncate text-xs text-muted-foreground">
          {pickerValue}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-72">
        <ColorPicker
          inline
          value={pickerValue}
          defaultFormat="hex"
          onValueChange={onChange}
        >
          <ColorPickerContent className="w-full">
            <ColorPickerArea />
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-2">
                <ColorPickerHueSlider />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerFormatSelect />
              <ColorPickerInput withoutAlpha />
            </div>
          </ColorPickerContent>
        </ColorPicker>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

type CustomTokenColorPickerProps = {
  fallback: string;
  value: string;
  onChange: (value: string) => void;
};

function CustomScaleInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <span
            aria-label="Learn how custom token scales work"
            className="inline-flex rounded-full text-sidebar-foreground/55 transition-colors hover:text-sidebar-foreground"
            role="img"
          />
        }
      >
        <Info aria-hidden="true" className="size-3.5" />
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-72 space-y-2">
        <div className="text-sm font-medium">Custom scale</div>
        <p className="text-xs leading-5 text-muted-foreground">
          Pick a base color to generate this token's 12-step scale. The step
          list above updates from that custom color.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

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
  return updateModeOverride(selection.tokenStepOverrides, token, mode, step);
}

function updateTokenCustomOverride(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
  value: string | null,
) {
  return updateModeOverride(
    selection.tokenCustomOverrides,
    token,
    mode,
    value?.trim() || null,
  );
}

function countModeOverrides(
  overrides?: Partial<Record<SemanticToken, TokenModeOverride>>,
) {
  return Object.values(overrides ?? {}).reduce(
    (count, override) =>
      count +
      Number(Boolean(override?.light)) +
      Number(Boolean(override?.dark)),
    0,
  );
}

function updateModeOverride<TValue extends string | number>(
  overrides: Partial<Record<SemanticToken, Partial<Record<ColorMode, TValue>>>>,
  token: SemanticToken,
  mode: ColorMode,
  value: TValue | null,
) {
  const nextOverrides = { ...overrides };
  const tokenOverride = { ...(nextOverrides[token] ?? {}) };

  if (value) {
    tokenOverride[mode] = value;
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

type TokenModeOverride = TokenStepOverride | TokenCustomOverride;
