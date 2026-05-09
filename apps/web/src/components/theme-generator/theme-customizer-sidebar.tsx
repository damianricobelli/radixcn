import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { FieldGroup } from "@workspace/ui/components/field";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
} from "@workspace/ui/components/number-field";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@workspace/ui/components/sidebar";
import { Slider } from "@workspace/ui/components/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Check, Clipboard, Moon, RotateCcw, Shuffle, Sun } from "lucide-react";
import { ChartDropdown } from "@/components/theme-generator/chart-color-dropdown";
import { FontDropdown } from "@/components/theme-generator/font-dropdown";
import { ACCENT_STRATEGIES } from "@/components/theme-generator/theme-customizer-constants";
import {
  CustomPaletteHoverCard,
  OptionDropdown,
  PanelSection,
  PanelSectionGroup,
  SectionCustomSwitch,
} from "@/components/theme-generator/theme-customizer-section";
import {
  getChartSwatches,
  getScaleHex,
} from "@/components/theme-generator/theme-customizer-utils";
import { ScaleDropdown } from "@/components/theme-generator/theme-scale-dropdown";
import { ThemeTemplateDropdown } from "@/components/theme-generator/theme-template-dropdown";
import { RADIUS_OPTIONS } from "@/lib/theme-generator/generator";
import {
  BASE_SCALES,
  DESTRUCTIVE_SCALES,
  PRIMARY_SCALES,
  STATE_SCALE_RECOMMENDATIONS,
} from "@/lib/theme-generator/radix";
import type {
  ColorMode,
  FontSourceFont,
  RadiusScale,
  RadixScaleName,
  ThemeModeTokens,
  ThemeSelection,
} from "@/lib/theme-generator/types";

export function ThemeCustomizerSidebar({
  copied,
  fonts,
  mode,
  tokens,
  selection,
  onCopy,
  onModeChange,
  onRandomize,
  onReset,
  onUpdate,
  onUpdateChartScale,
  onUpdateCustomChartColor,
  onUpdateCustomChartEnabled,
}: ThemeCustomizerSidebarProps) {
  const colorsCustomEnabled =
    selection.customBaseEnabled ||
    selection.customPrimaryEnabled ||
    selection.customDestructiveEnabled;
  const statesCustomEnabled =
    selection.customSuccessEnabled ||
    selection.customWarningEnabled ||
    selection.customInfoEnabled;
  const chartsCustomEnabled = selection.customChartColorEnabled.some(Boolean);

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader className="gap-3 px-3 pt-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold">Customize</div>
            <div className="truncate text-xs text-sidebar-foreground/65">
              Theme configuration
            </div>
          </div>
          <ThemeModeSwitch mode={mode} onModeChange={onModeChange} />
        </div>
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/25 p-1">
          <ThemeTemplateDropdown />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 pt-1 pb-2">
          <Tabs defaultValue="colors" className="gap-3">
            <TabsList className="grid h-9 w-full grid-cols-3 rounded-lg border border-sidebar-border bg-sidebar-accent/35 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
              <TabsTrigger
                className="rounded-md text-xs data-active:bg-sidebar data-active:shadow-sm"
                value="colors"
              >
                Colors
              </TabsTrigger>
              <TabsTrigger
                className="rounded-md text-xs data-active:bg-sidebar data-active:shadow-sm"
                value="typography"
              >
                Typography
              </TabsTrigger>
              <TabsTrigger
                className="rounded-md text-xs data-active:bg-sidebar data-active:shadow-sm"
                value="other"
              >
                Other
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors">
              <FieldGroup className="gap-5">
                <PanelSection
                  title="Colors"
                  info={<CustomPaletteHoverCard />}
                  action={
                    <SectionCustomSwitch
                      checked={colorsCustomEnabled}
                      onCheckedChange={(enabled) =>
                        onUpdate({
                          customBaseEnabled: enabled,
                          customPrimaryEnabled: enabled,
                          customDestructiveEnabled: enabled,
                        })
                      }
                    />
                  }
                >
                  <ScaleDropdown
                    label="Base"
                    value={selection.baseScale}
                    recommended={BASE_SCALES}
                    customEnabled={selection.customBaseEnabled}
                    customValue={selection.customBaseColor}
                    fallback={getScaleHex(selection.baseScale)}
                    globalCustomEnabled={colorsCustomEnabled}
                    palettePreviewRole="gray"
                    onChange={(value) => onUpdate({ baseScale: value })}
                    onCustomChange={(value) =>
                      onUpdate({ customBaseColor: value })
                    }
                  />

                  <ScaleDropdown
                    label="Primary"
                    value={selection.primaryScale}
                    recommended={PRIMARY_SCALES}
                    customEnabled={selection.customPrimaryEnabled}
                    customValue={selection.customPrimaryColor}
                    fallback={getScaleHex(selection.primaryScale)}
                    globalCustomEnabled={colorsCustomEnabled}
                    palettePreviewRole="accent"
                    onChange={(value) => onUpdate({ primaryScale: value })}
                    onCustomChange={(value) =>
                      onUpdate({ customPrimaryColor: value })
                    }
                  />

                  <ScaleDropdown
                    label="Destructive"
                    value={selection.destructiveScale}
                    recommended={DESTRUCTIVE_SCALES}
                    customEnabled={selection.customDestructiveEnabled}
                    customValue={selection.customDestructiveColor}
                    fallback={getScaleHex(selection.destructiveScale)}
                    globalCustomEnabled={colorsCustomEnabled}
                    palettePreviewRole="accent"
                    onChange={(value) => onUpdate({ destructiveScale: value })}
                    onCustomChange={(value) =>
                      onUpdate({ customDestructiveColor: value })
                    }
                  />

                  <OptionDropdown
                    label="Accent"
                    value={selection.accentStrategy}
                    options={ACCENT_STRATEGIES}
                    onChange={(value) => onUpdate({ accentStrategy: value })}
                  />

                </PanelSection>

                <PanelSection
                  title="States"
                  action={
                    <SectionCustomSwitch
                      checked={statesCustomEnabled}
                      disabled={!selection.additionalStatesEnabled}
                      onCheckedChange={(enabled) =>
                        onUpdate({
                          customSuccessEnabled: enabled,
                          customWarningEnabled: enabled,
                          customInfoEnabled: enabled,
                        })
                      }
                    />
                  }
                >
                  <AdditionalStatesCheckbox
                    checked={selection.additionalStatesEnabled}
                    onCheckedChange={(enabled) =>
                      onUpdate({ additionalStatesEnabled: enabled })
                    }
                  />

                  {selection.additionalStatesEnabled ? (
                    <>
                      <ScaleDropdown
                        label="Success"
                        value={selection.successScale}
                        recommended={STATE_SCALE_RECOMMENDATIONS.success}
                        customEnabled={selection.customSuccessEnabled}
                        customValue={selection.customSuccessColor}
                        fallback={getScaleHex(selection.successScale)}
                        globalCustomEnabled={statesCustomEnabled}
                        palettePreviewRole="accent"
                        onChange={(value) => onUpdate({ successScale: value })}
                        onCustomChange={(value) =>
                          onUpdate({ customSuccessColor: value })
                        }
                      />

                      <ScaleDropdown
                        label="Warning"
                        value={selection.warningScale}
                        recommended={STATE_SCALE_RECOMMENDATIONS.warning}
                        customEnabled={selection.customWarningEnabled}
                        customValue={selection.customWarningColor}
                        fallback={getScaleHex(selection.warningScale)}
                        globalCustomEnabled={statesCustomEnabled}
                        palettePreviewRole="accent"
                        onChange={(value) => onUpdate({ warningScale: value })}
                        onCustomChange={(value) =>
                          onUpdate({ customWarningColor: value })
                        }
                      />

                      <ScaleDropdown
                        label="Info"
                        value={selection.infoScale}
                        recommended={STATE_SCALE_RECOMMENDATIONS.info}
                        customEnabled={selection.customInfoEnabled}
                        customValue={selection.customInfoColor}
                        fallback={getScaleHex(selection.infoScale)}
                        globalCustomEnabled={statesCustomEnabled}
                        palettePreviewRole="accent"
                        onChange={(value) => onUpdate({ infoScale: value })}
                        onCustomChange={(value) =>
                          onUpdate({ customInfoColor: value })
                        }
                      />
                    </>
                  ) : null}
                </PanelSection>

                <PanelSection
                  title="Charts"
                  grouped={false}
                  action={
                    <SectionCustomSwitch
                      checked={chartsCustomEnabled}
                      disabled={selection.chartStrategy !== "multicolor"}
                      onCheckedChange={(enabled) => {
                        selection.chartScales.forEach((_, index) => {
                          onUpdateCustomChartEnabled(index, enabled);
                        });
                      }}
                    />
                  }
                >
                  <ChartDropdown
                    selection={selection}
                    swatches={getChartSwatches(selection.chartStrategy, tokens)}
                    onStrategyChange={(value) =>
                      onUpdate({ chartStrategy: value })
                    }
                    onChartScaleChange={onUpdateChartScale}
                    onCustomChartColorChange={onUpdateCustomChartColor}
                    customEnabled={chartsCustomEnabled}
                  />
                </PanelSection>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="typography">
              <FieldGroup className="gap-5">
                <PanelSection title="Fonts">
                  <FontDropdown
                    fonts={fonts}
                    headingFont={selection.headingFont}
                    sansFont={selection.sansFont}
                    monoFont={selection.monoFont}
                    onHeadingFontChange={(value) =>
                      onUpdate({ headingFont: value })
                    }
                    onSansFontChange={(value) => onUpdate({ sansFont: value })}
                    onMonoFontChange={(value) => onUpdate({ monoFont: value })}
                  />
                </PanelSection>

                <PanelSection title="Letter spacing">
                  <ShadowNumberControl
                    label="Tracking"
                    value={selection.trackingNormal}
                    min={-0.5}
                    max={0.5}
                    step={0.01}
                    unit="em"
                    onChange={(value) => onUpdate({ trackingNormal: value })}
                  />
                </PanelSection>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="other">
              <FieldGroup className="gap-5">
                <PanelSection title="Radius">
                  <OptionDropdown
                    label="Radius"
                    value={selection.radiusScale}
                    options={RADIUS_OPTIONS}
                    getLabel={getRadiusLabel}
                    onChange={(value) => onUpdate({ radiusScale: value })}
                  />
                </PanelSection>

                <PanelSection title="Spacing">
                  <ShadowNumberControl
                    label="Spacing"
                    value={selection.spacing}
                    min={0.15}
                    max={0.35}
                    step={0.01}
                    unit="rem"
                    onChange={(value) => onUpdate({ spacing: value })}
                  />
                </PanelSection>

                <PanelSection
                  title="Shadow"
                  grouped={false}
                  action={
                    <SectionCustomSwitch
                      checked={selection.customShadowEnabled}
                      onCheckedChange={(enabled) =>
                        onUpdate({ customShadowEnabled: enabled })
                      }
                    />
                  }
                >
                  <PanelSectionGroup>
                    <ScaleDropdown
                      label="Color"
                      value={selection.shadowScale}
                      recommended={BASE_SCALES}
                      customEnabled={selection.customShadowEnabled}
                      customValue={selection.customShadowColor}
                      fallback={getScaleHex(selection.shadowScale)}
                      globalCustomEnabled={false}
                      onChange={(value) => onUpdate({ shadowScale: value })}
                      onCustomChange={(value) =>
                        onUpdate({ customShadowColor: value })
                      }
                    />
                  </PanelSectionGroup>

                  <PanelSectionGroup>
                    <ShadowNumberControl
                      label="Opacity"
                      value={selection.shadowOpacity}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(value) => onUpdate({ shadowOpacity: value })}
                    />
                    <ShadowNumberControl
                      label="Blur"
                      value={selection.shadowBlur}
                      min={0}
                      max={64}
                      step={1}
                      unit="px"
                      onChange={(value) => onUpdate({ shadowBlur: value })}
                    />
                    <ShadowNumberControl
                      label="Spread"
                      value={selection.shadowSpread}
                      min={-32}
                      max={32}
                      step={1}
                      unit="px"
                      onChange={(value) => onUpdate({ shadowSpread: value })}
                    />
                    <ShadowNumberControl
                      label="Offset X"
                      value={selection.shadowOffsetX}
                      min={-32}
                      max={32}
                      step={1}
                      unit="px"
                      onChange={(value) => onUpdate({ shadowOffsetX: value })}
                    />
                    <ShadowNumberControl
                      label="Offset Y"
                      value={selection.shadowOffsetY}
                      min={-32}
                      max={32}
                      step={1}
                      unit="px"
                      onChange={(value) => onUpdate({ shadowOffsetY: value })}
                    />
                  </PanelSectionGroup>
                </PanelSection>
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2">
        <Button onClick={onCopy}>
          {copied ? <Check /> : <Clipboard />}
          {copied ? "Copied" : "Copy CSS"}
        </Button>
        <div className="grid w-full grid-cols-2 gap-2">
          <Button variant="outline" onClick={onRandomize}>
            <Shuffle />
            Random
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw />
            Reset
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

type ThemeCustomizerSidebarProps = {
  copied: boolean;
  fonts: ReadonlyArray<FontSourceFont>;
  mode: ColorMode;
  tokens: ThemeModeTokens;
  selection: ThemeSelection;
  onCopy: () => void;
  onModeChange: (mode: ColorMode) => void;
  onRandomize: () => void;
  onReset: () => void;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
  onUpdateChartScale: (index: number, scale: RadixScaleName) => void;
  onUpdateCustomChartColor: (index: number, color: string) => void;
  onUpdateCustomChartEnabled: (index: number, enabled: boolean) => void;
};

function ThemeModeSwitch({ mode, onModeChange }: ThemeModeSwitchProps) {
  const isDark = mode === "dark";

  return (
    <button
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex h-8 w-[58px] shrink-0 items-center rounded-full border border-sidebar-border bg-sidebar-accent p-1 text-sidebar-foreground transition-colors outline-none hover:bg-sidebar-accent/80 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
      onClick={() => onModeChange(isDark ? "light" : "dark")}
      role="switch"
      type="button"
    >
      <span className="grid w-full grid-cols-2 place-items-center">
        <Sun className="size-3.5 text-sidebar-foreground/55" />
        <Moon className="size-3.5 text-sidebar-foreground/55" />
      </span>
      <span
        className={[
          "absolute top-1 left-1 grid size-6 place-items-center rounded-full bg-sidebar shadow-sm ring-1 ring-sidebar-border transition-transform",
          isDark ? "translate-x-6" : "translate-x-0",
        ].join(" ")}
      >
        {isDark ? (
          <Moon className="size-3.5 text-sidebar-foreground" />
        ) : (
          <Sun className="size-3.5 text-sidebar-foreground" />
        )}
      </span>
    </button>
  );
}

type ThemeModeSwitchProps = {
  mode: ColorMode;
  onModeChange: (mode: ColorMode) => void;
};

function getRadiusLabel(radius: RadiusScale) {
  if (radius === "default") {
    return "Default";
  }

  if (radius === "none") {
    return "None";
  }

  return `${radius.slice(0, 1).toUpperCase()}${radius.slice(1)}`;
}

function AdditionalStatesCheckbox({
  checked,
  onCheckedChange,
}: AdditionalStatesCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md px-2.5 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent/55">
      <Checkbox
        checked={checked}
        className="mt-0.5"
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked === true)}
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium">Add states</span>
        <span className="block text-xs text-sidebar-foreground/65">
          Success, warning, and info.
        </span>
      </span>
    </label>
  );
}

type AdditionalStatesCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function ShadowNumberControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: ShadowNumberControlProps) {
  return (
    <NumberField
      className="grid grid-cols-[72px_minmax(0,1fr)_80px] items-center gap-2 px-2.5 py-2 text-sidebar-foreground"
      value={value}
      min={min}
      max={max}
      step={step}
      format={{
        maximumFractionDigits: getStepPrecision(step),
      }}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "number") {
          onChange(clamp(roundByStep(nextValue, step), min, max));
        }
      }}
    >
      <NumberFieldScrubArea className="min-w-0">
        <span className="truncate text-sm font-medium">{label}</span>
        <NumberFieldScrubAreaCursor />
      </NumberFieldScrubArea>
      <Slider
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(nextValues) => {
          const nextValue = Array.isArray(nextValues)
            ? nextValues[0]
            : nextValues;
          if (typeof nextValue === "number") {
            onChange(roundByStep(nextValue, step));
          }
        }}
      />
      <div className="flex items-center gap-1">
        <NumberFieldGroup className="h-7 w-14 rounded-md bg-sidebar-accent/25">
          <NumberFieldInput
            aria-label={`${label} value`}
            className="px-1.5 text-right text-xs"
          />
        </NumberFieldGroup>
        {unit ? (
          <span className="w-4 shrink-0 text-xs text-sidebar-foreground/55">
            {unit}
          </span>
        ) : null}
      </div>
    </NumberField>
  );
}

type ShadowNumberControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
};

function getStepPrecision(step: number) {
  return step < 1 ? Math.ceil(Math.abs(Math.log10(step))) : 0;
}

function roundByStep(value: number, step: number) {
  const precision = getStepPrecision(step);
  return Number(value.toFixed(precision));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
