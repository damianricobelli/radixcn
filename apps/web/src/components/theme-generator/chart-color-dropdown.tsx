import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@workspace/ui/components/dropdown-menu"
import { ColorScaleDropdown } from "@/components/theme-generator/color-scale-menu"
import { CustomColorPickerTriggerRow } from "@/components/theme-generator/theme-color-picker-field"
import {
  CHART_STRATEGIES,
  CHART_STRATEGY_META,
} from "@/components/theme-generator/theme-customizer-constants"
import {
  SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
  SIDEBAR_DROPDOWN_SCROLL_CONTENT_CLASSNAME,
  PanelSectionGroup,
  SidebarDropdown,
} from "@/components/theme-generator/theme-customizer-section"
import {
  getScaleHex,
  getScaleSwatch,
  labelize,
} from "@/components/theme-generator/theme-customizer-utils"
import { normalizeHexColor } from "@/lib/theme-generator/color"
import { CHART_SCALES } from "@/lib/theme-generator/radix"
import type {
  ChartStrategy,
  RadixScaleName,
  ThemeSelection,
} from "@/lib/theme-generator/types"

export function ChartDropdown({
  selection,
  swatches,
  onStrategyChange,
  onChartScaleChange,
  onCustomChartColorChange,
  customEnabled = false,
}: ChartDropdownProps) {
  return (
    <>
      <PanelSectionGroup>
        <SidebarDropdown
          ariaLabel={`Open chart color strategy menu. Current value: ${
            CHART_STRATEGY_META[selection.chartStrategy].label
          }.`}
          label="Chart Color"
          value={CHART_STRATEGY_META[selection.chartStrategy].label}
          swatches={swatches}
          alignOffset={6}
          contentClassName={SIDEBAR_DROPDOWN_SCROLL_CONTENT_CLASSNAME}
        >
          <DropdownMenuRadioGroup
            value={selection.chartStrategy}
            onValueChange={(nextValue) =>
              onStrategyChange(nextValue as ChartStrategy)
            }
          >
            <div>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Strategy</DropdownMenuLabel>
                {CHART_STRATEGIES.map((strategy) => (
                  <DropdownMenuRadioItem
                    className={SIDEBAR_DROPDOWN_ITEM_CLASSNAME}
                    key={strategy}
                    value={strategy}
                  >
                    {CHART_STRATEGY_META[strategy].label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuGroup>
            </div>
          </DropdownMenuRadioGroup>
        </SidebarDropdown>
      </PanelSectionGroup>

      {selection.chartStrategy === "multicolor" ? (
        <PanelSectionGroup>
          {selection.chartScales.map((scale, index) => (
            <ChartColorField
              key={`chart-color-${index + 1}`}
              index={index}
              value={scale}
              customEnabled={selection.customChartColorEnabled[index] ?? false}
              customValue={selection.customChartColors[index] ?? ""}
              globalCustomEnabled={customEnabled}
              onChange={(nextScale) => onChartScaleChange(index, nextScale)}
              onCustomChange={(color) =>
                onCustomChartColorChange(index, color)
              }
            />
          ))}
        </PanelSectionGroup>
      ) : null}
    </>
  )
}

type ChartDropdownProps = {
  selection: ThemeSelection
  swatches: Array<string>
  onStrategyChange: (value: ChartStrategy) => void
  onChartScaleChange: (index: number, scale: RadixScaleName) => void
  onCustomChartColorChange: (index: number, color: string) => void
  customEnabled?: boolean
}

function ChartColorField({
  index,
  value,
  customEnabled,
  customValue,
  globalCustomEnabled,
  onChange,
  onCustomChange,
}: ChartColorFieldProps) {
  const customActive = globalCustomEnabled || customEnabled
  const customSwatch = normalizeHexColor(customValue)
  const swatch =
    customActive && customSwatch ? customSwatch : getScaleSwatch(value)
  const label = `Chart ${index + 1}`
  const displayValue = customActive
    ? (customSwatch ?? "Pick color")
    : labelize(value)

  if (customActive) {
    return (
      <CustomColorPickerTriggerRow
        label={label}
        value={customValue}
        fallback={getScaleHex(value)}
        displayValue={displayValue}
        swatch={swatch}
        palettePreviewRole="accent"
        onChange={onCustomChange}
      />
    )
  }

  return (
    <ColorScaleDropdown
      ariaLabel={`Open ${label} color menu. Current value: ${displayValue}.`}
      label={label}
      value={value}
      displayValue={displayValue}
      swatch={swatch}
      recommended={CHART_SCALES}
      onChange={onChange}
    />
  )
}

type ChartColorFieldProps = {
  index: number
  value: RadixScaleName
  customEnabled: boolean
  customValue: string
  globalCustomEnabled: boolean
  onChange: (value: RadixScaleName) => void
  onCustomChange: (value: string) => void
}
