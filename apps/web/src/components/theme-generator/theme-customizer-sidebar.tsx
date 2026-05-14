import { Button } from "@workspace/ui/components/button";
import { FieldGroup } from "@workspace/ui/components/field";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@workspace/ui/components/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  ExternalLink,
  GitCompareArrows,
  ListOrdered,
  Paintbrush,
  Palette,
  RotateCcw,
  Settings2,
  Shuffle,
  SlidersHorizontal,
  Type,
} from "lucide-react";
import type { ReactNode } from "react";
import { ChartDropdown } from "@/components/theme-generator/chart-color-dropdown";
import { FontDropdown } from "@/components/theme-generator/font-dropdown";
import { ThemeCodeDialog } from "@/components/theme-code-dialog";
import { CustomColorPickerTriggerRow } from "@/components/theme-generator/theme-color-picker-field";
import {
  ACCENT_STRATEGIES,
  ACCENT_STRATEGY_META,
} from "@/components/theme-generator/theme-customizer-constants";
import {
  CustomPaletteHoverCard,
  GrainyBackgroundHoverCard,
  OptionDropdown,
  PanelSection,
  PanelSectionGroup,
  SectionCustomSwitch,
} from "@/components/theme-generator/theme-customizer-section";
import {
  AdditionalStatesCheckbox,
  GrainyBackgroundSwitch,
  getRadiusLabel,
  RadixColorImportsCheckbox,
  ShadowNumberControl,
  ThemeModeSwitch,
} from "@/components/theme-generator/theme-customizer-sidebar-controls";
import {
  getChartSwatches,
  getScaleHex,
} from "@/components/theme-generator/theme-customizer-utils";
import { ScaleDropdown } from "@/components/theme-generator/theme-scale-dropdown";
import { ThemeTemplateDropdown } from "@/components/theme-generator/theme-template-dropdown";
import { TokenBridgeSettings } from "@/components/theme-generator/token-bridge-settings";
import { TokenStepSettings } from "@/components/theme-generator/token-step-settings";
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
  RadixScaleName,
  ThemeModeTokens,
  ThemeSelection,
} from "@/lib/theme-generator/types";

export function ThemeCustomizerSidebar({
  css,
  fonts,
  mode,
  tokens,
  selection,
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
      <Tabs defaultValue="design" className="min-h-0 flex-1 gap-0">
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

          <TabsList className="w-full border">
            <TabsTrigger value="design">
              <Paintbrush className="size-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings2 className="size-4" />
              Advanced
            </TabsTrigger>
          </TabsList>
        </SidebarHeader>

        <SidebarContent className="overflow-hidden">
          <SidebarGroup className="min-w-0 min-h-0 flex-1 px-3 pt-1 pb-2">
            <TabsContent className="flex min-w-0 min-h-0 flex-1" value="design">
              <Tabs
                defaultValue="colors"
                className="min-w-0 min-h-0 flex-1 gap-0"
              >
                <TabsList className="w-full shrink-0 border">
                  <TabsTrigger value="colors">
                    <Palette className="size-4" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="typography">
                    <Type className="size-4" />
                    Typography
                  </TabsTrigger>
                  <TabsTrigger value="other">
                    <SlidersHorizontal className="size-4" />
                    Other
                  </TabsTrigger>
                </TabsList>

                <TabsContent className="min-w-0 min-h-0 flex-1" value="colors">
                  <SidebarScrollArea>
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
                          customPickerEnabled={colorsCustomEnabled}
                          customValue={selection.customBaseColor}
                          fallback={getScaleHex(selection.baseScale)}
                          onChange={(value) => onUpdate({ baseScale: value })}
                          onCustomChange={(value) =>
                            onUpdate({
                              customBaseEnabled: true,
                              customBaseColor: value,
                            })
                          }
                        />

                        <ScaleDropdown
                          label="Primary"
                          value={selection.primaryScale}
                          recommended={PRIMARY_SCALES}
                          customEnabled={selection.customPrimaryEnabled}
                          customPickerEnabled={colorsCustomEnabled}
                          customValue={selection.customPrimaryColor}
                          fallback={getScaleHex(selection.primaryScale)}
                          onChange={(value) =>
                            onUpdate({ primaryScale: value })
                          }
                          onCustomChange={(value) =>
                            onUpdate({
                              customPrimaryEnabled: true,
                              customPrimaryColor: value,
                            })
                          }
                        />

                        <ScaleDropdown
                          label="Destructive"
                          value={selection.destructiveScale}
                          recommended={DESTRUCTIVE_SCALES}
                          customEnabled={selection.customDestructiveEnabled}
                          customPickerEnabled={colorsCustomEnabled}
                          customValue={selection.customDestructiveColor}
                          fallback={getScaleHex(selection.destructiveScale)}
                          recommendedOnly
                          onChange={(value) =>
                            onUpdate({ destructiveScale: value })
                          }
                          onCustomChange={(value) =>
                            onUpdate({
                              customDestructiveEnabled: true,
                              customDestructiveColor: value,
                            })
                          }
                        />
                      </PanelSection>

                      <PanelSection
                        title="Accent"
                        action={
                          <SectionCustomSwitch
                            checked={selection.customAccentEnabled}
                            onCheckedChange={(enabled) =>
                              onUpdate({ customAccentEnabled: enabled })
                            }
                          />
                        }
                      >
                        {selection.customAccentEnabled ? (
                          <CustomColorPickerTriggerRow
                            label="Accent"
                            value={selection.customAccentColor}
                            fallback={
                              selection.customPrimaryColor ||
                              getScaleHex(selection.primaryScale)
                            }
                            displayValue="Pick color"
                            swatch={
                              selection.customPrimaryColor ||
                              getScaleHex(selection.primaryScale)
                            }
                            onChange={(value) =>
                              onUpdate({ customAccentColor: value })
                            }
                          />
                        ) : (
                          <OptionDropdown
                            label="Source"
                            value={selection.accentStrategy}
                            options={ACCENT_STRATEGIES}
                            getLabel={(value) =>
                              ACCENT_STRATEGY_META[value].label
                            }
                            onChange={(value) =>
                              onUpdate({ accentStrategy: value })
                            }
                          />
                        )}
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
                              customPickerEnabled={statesCustomEnabled}
                              customValue={selection.customSuccessColor}
                              fallback={getScaleHex(selection.successScale)}
                              recommendedOnly
                              onChange={(value) =>
                                onUpdate({ successScale: value })
                              }
                              onCustomChange={(value) =>
                                onUpdate({
                                  customSuccessEnabled: true,
                                  customSuccessColor: value,
                                })
                              }
                            />

                            <ScaleDropdown
                              label="Warning"
                              value={selection.warningScale}
                              recommended={STATE_SCALE_RECOMMENDATIONS.warning}
                              customEnabled={selection.customWarningEnabled}
                              customPickerEnabled={statesCustomEnabled}
                              customValue={selection.customWarningColor}
                              fallback={getScaleHex(selection.warningScale)}
                              recommendedOnly
                              onChange={(value) =>
                                onUpdate({ warningScale: value })
                              }
                              onCustomChange={(value) =>
                                onUpdate({
                                  customWarningEnabled: true,
                                  customWarningColor: value,
                                })
                              }
                            />

                            <ScaleDropdown
                              label="Info"
                              value={selection.infoScale}
                              recommended={STATE_SCALE_RECOMMENDATIONS.info}
                              customEnabled={selection.customInfoEnabled}
                              customPickerEnabled={statesCustomEnabled}
                              customValue={selection.customInfoColor}
                              fallback={getScaleHex(selection.infoScale)}
                              recommendedOnly
                              onChange={(value) =>
                                onUpdate({ infoScale: value })
                              }
                              onCustomChange={(value) =>
                                onUpdate({
                                  customInfoEnabled: true,
                                  customInfoColor: value,
                                })
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
                          swatches={getChartSwatches(
                            selection.chartStrategy,
                            tokens,
                          )}
                          onStrategyChange={(value) =>
                            onUpdate({ chartStrategy: value })
                          }
                          onChartScaleChange={onUpdateChartScale}
                          onCustomChartColorChange={onUpdateCustomChartColor}
                          customPickerEnabled={chartsCustomEnabled}
                        />
                      </PanelSection>
                    </FieldGroup>
                  </SidebarScrollArea>
                </TabsContent>

                <TabsContent
                  className="min-w-0 min-h-0 flex-1"
                  value="typography"
                >
                  <SidebarScrollArea>
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
                          onSansFontChange={(value) =>
                            onUpdate({ sansFont: value })
                          }
                          onMonoFontChange={(value) =>
                            onUpdate({ monoFont: value })
                          }
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
                          onChange={(value) =>
                            onUpdate({ trackingNormal: value })
                          }
                        />
                      </PanelSection>
                    </FieldGroup>
                  </SidebarScrollArea>
                </TabsContent>

                <TabsContent className="min-w-0 min-h-0 flex-1" value="other">
                  <SidebarScrollArea>
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
                        title="Background"
                        info={<GrainyBackgroundHoverCard />}
                      >
                        <GrainyBackgroundSwitch
                          checked={selection.grainyBackgroundEnabled}
                          onCheckedChange={(enabled) =>
                            onUpdate({ grainyBackgroundEnabled: enabled })
                          }
                        />

                        {selection.grainyBackgroundEnabled ? (
                          <>
                            <ShadowNumberControl
                              label="Light"
                              value={selection.grainyBackgroundLightOpacity}
                              min={0.02}
                              max={0.3}
                              step={0.01}
                              onChange={(value) =>
                                onUpdate({
                                  grainyBackgroundLightOpacity: value,
                                })
                              }
                            />
                            <ShadowNumberControl
                              label="Dark"
                              value={selection.grainyBackgroundDarkOpacity}
                              min={0.02}
                              max={0.3}
                              step={0.01}
                              onChange={(value) =>
                                onUpdate({
                                  grainyBackgroundDarkOpacity: value,
                                })
                              }
                            />
                          </>
                        ) : null}
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
                            onChange={(value) =>
                              onUpdate({ shadowScale: value })
                            }
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
                            onChange={(value) =>
                              onUpdate({ shadowOpacity: value })
                            }
                          />
                          <ShadowNumberControl
                            label="Blur"
                            value={selection.shadowBlur}
                            min={0}
                            max={64}
                            step={1}
                            unit="px"
                            onChange={(value) =>
                              onUpdate({ shadowBlur: value })
                            }
                          />
                          <ShadowNumberControl
                            label="Spread"
                            value={selection.shadowSpread}
                            min={-32}
                            max={32}
                            step={1}
                            unit="px"
                            onChange={(value) =>
                              onUpdate({ shadowSpread: value })
                            }
                          />
                          <ShadowNumberControl
                            label="Offset X"
                            value={selection.shadowOffsetX}
                            min={-32}
                            max={32}
                            step={1}
                            unit="px"
                            onChange={(value) =>
                              onUpdate({ shadowOffsetX: value })
                            }
                          />
                          <ShadowNumberControl
                            label="Offset Y"
                            value={selection.shadowOffsetY}
                            min={-32}
                            max={32}
                            step={1}
                            unit="px"
                            onChange={(value) =>
                              onUpdate({ shadowOffsetY: value })
                            }
                          />
                        </PanelSectionGroup>
                      </PanelSection>
                    </FieldGroup>
                  </SidebarScrollArea>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent
              className="flex min-w-0 min-h-0 flex-1"
              value="advanced"
            >
              <OverrideSettings
                mode={mode}
                selection={selection}
                onModeChange={onModeChange}
                onUpdate={onUpdate}
              />
            </TabsContent>
          </SidebarGroup>
        </SidebarContent>
      </Tabs>

      <SidebarFooter className="gap-2">
        <ThemeCodeDialog css={css} fullWidth />
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

function OverrideSettings({
  mode,
  selection,
  onModeChange,
  onUpdate,
}: OverrideSettingsProps) {
  return (
    <Tabs defaultValue="bridge" className="min-w-0 min-h-0 flex-1 gap-0">
      <TabsList className="w-full shrink-0 border">
        <TabsTrigger value="bridge">
          <GitCompareArrows className="size-4" />
          Bridge
        </TabsTrigger>
        <TabsTrigger value="steps">
          <ListOrdered className="size-4" />
          Steps
        </TabsTrigger>
        <TabsTrigger value="radix">
          <Palette className="size-4" />
          Radix
        </TabsTrigger>
      </TabsList>

      <TabsContent className="min-w-0 min-h-0 flex-1" value="bridge">
        <SidebarScrollArea>
          <FieldGroup className="gap-5">
            <TokenBridgeSettings selection={selection} onUpdate={onUpdate} />
          </FieldGroup>
        </SidebarScrollArea>
      </TabsContent>

      <TabsContent className="min-w-0 min-h-0 flex-1" value="steps">
        <SidebarScrollArea>
          <FieldGroup className="gap-5">
            <TokenStepSettings
              mode={mode}
              selection={selection}
              onModeChange={onModeChange}
              onUpdate={onUpdate}
            />
          </FieldGroup>
        </SidebarScrollArea>
      </TabsContent>

      <TabsContent className="min-w-0 min-h-0 flex-1" value="radix">
        <SidebarScrollArea>
          <FieldGroup className="gap-5">
            <PanelSection title="Radix colors">
              <RadixColorImportsCheckbox
                checked={selection.radixColorImportsEnabled}
                onCheckedChange={(enabled) =>
                  onUpdate({ radixColorImportsEnabled: enabled })
                }
              />
            </PanelSection>

            <PanelSection title="Docs" grouped={false}>
              <a
                className="flex items-start justify-between gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/20 p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent/45"
                href="https://www.radix-ui.com/colors/docs/overview/usage"
                rel="noreferrer"
                target="_blank"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    Radix Colors usage
                  </span>
                  <span className="block text-xs leading-5 text-sidebar-foreground/65">
                    Read the official CSS import and scale variable docs.
                  </span>
                </span>
                <ExternalLink className="mt-0.5 size-4 shrink-0 text-sidebar-foreground/65" />
              </a>
            </PanelSection>
          </FieldGroup>
        </SidebarScrollArea>
      </TabsContent>
    </Tabs>
  );
}

function SidebarScrollArea({ children }: SidebarScrollAreaProps) {
  return (
    <ScrollArea className="min-w-0 min-h-0 size-full overflow-hidden [--scroll-fade:40px] **:data-[slot=scroll-area-scrollbar]:hidden **:data-[slot=scroll-area-viewport]:animate-[sidebar-scroll-fade_auto_linear] **:data-[slot=scroll-area-viewport]:[mask:linear-gradient(to_bottom,transparent,black_var(--top-fade)_calc(100%-var(--bottom-fade)),transparent)] **:data-[slot=scroll-area-viewport]:[scroll-timeline:--sidebar-scroll-fade_y] **:data-[slot=scroll-area-viewport]:[animation-timeline:--sidebar-scroll-fade] **:data-[slot=scroll-area-viewport]:overflow-x-hidden">
      <div className="min-w-0 pt-4">{children}</div>
    </ScrollArea>
  );
}

type SidebarScrollAreaProps = {
  children: ReactNode;
};

type ThemeCustomizerSidebarProps = {
  css: string;
  fonts: ReadonlyArray<FontSourceFont>;
  mode: ColorMode;
  tokens: ThemeModeTokens;
  selection: ThemeSelection;
  onModeChange: (mode: ColorMode) => void;
  onRandomize: () => void;
  onReset: () => void;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
  onUpdateChartScale: (index: number, scale: RadixScaleName) => void;
  onUpdateCustomChartColor: (index: number, color: string) => void;
  onUpdateCustomChartEnabled: (index: number, enabled: boolean) => void;
};

type OverrideSettingsProps = {
  mode: ColorMode;
  selection: ThemeSelection;
  onModeChange: (mode: ColorMode) => void;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};
