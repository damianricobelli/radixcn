import { ColorScaleDropdown } from "@/components/theme-generator/color-scale-menu";
import { CustomColorPickerTriggerRow } from "@/components/theme-generator/theme-color-picker-field";
import {
  getScaleSwatch,
  labelize,
} from "@/components/theme-generator/theme-customizer-utils";
import { normalizeHexColor } from "@/lib/theme-generator/color";
import type { RadixScaleName } from "@/lib/theme-generator/types";

export function ScaleDropdown({
  label,
  value,
  recommended,
  customEnabled,
  customPickerEnabled = customEnabled,
  customValue,
  fallback,
  onChange,
  onCustomChange,
  compact = false,
  recommendedOnly = false,
}: ScaleDropdownProps) {
  const customActive = customPickerEnabled;
  const customSwatch = normalizeHexColor(customValue);
  const fallbackSwatch = normalizeHexColor(fallback);
  const swatch =
    customActive && (customSwatch || fallbackSwatch)
      ? (customSwatch ?? fallbackSwatch ?? getScaleSwatch(value))
      : getScaleSwatch(value);
  const displayValue = customActive
    ? (customSwatch ?? fallbackSwatch ?? labelize(value))
    : compact
      ? value
      : labelize(value);

  return (
    <div className="min-w-0">
      {customActive ? (
        <CustomColorPickerTriggerRow
          label={label}
          value={customValue}
          fallback={fallback}
          displayValue={displayValue}
          swatch={swatch}
          onChange={onCustomChange}
        />
      ) : (
        <ColorScaleDropdown
          ariaLabel={`Open ${label} color menu. Current value: ${
            compact ? value : labelize(value)
          }.`}
          label={label}
          value={value}
          displayValue={displayValue}
          swatch={swatch}
          recommended={recommended}
          recommendedOnly={recommendedOnly}
          onChange={onChange}
        />
      )}
    </div>
  );
}

type ScaleDropdownProps = {
  label: string;
  value: RadixScaleName;
  recommended: ReadonlyArray<RadixScaleName>;
  customEnabled: boolean;
  customPickerEnabled?: boolean;
  customValue: string;
  fallback: string;
  onChange: (value: RadixScaleName) => void;
  onCustomChange: (value: string) => void;
  compact?: boolean;
  recommendedOnly?: boolean;
};
