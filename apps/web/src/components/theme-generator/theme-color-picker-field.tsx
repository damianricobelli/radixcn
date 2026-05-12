import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerTrigger,
} from "@workspace/ui/components/color-picker";
import { useState } from "react";
import { normalizeColorPickerValue } from "@/components/theme-generator/color-value-utils";
import { MenuRow } from "@/components/theme-generator/theme-customizer-section";

export function CustomColorPickerTriggerRow({
  label,
  value,
  fallback,
  displayValue,
  swatch,
  onChange,
}: CustomColorPickerTriggerRowProps) {
  const { pickerValue, normalized, setPickerValue } = useColorPickerValue({
    value,
    fallback,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const triggerDisplayValue = normalized ?? displayValue;
  const triggerSwatch = normalized ?? swatch;

  return (
    <div className="min-w-0">
      <ColorPicker
        className="w-full"
        value={pickerValue}
        onValueChange={setPickerValue}
        open={open}
        onOpenChange={setOpen}
        defaultFormat="hex"
      >
        <ColorPickerTrigger
          render={
            <button
              aria-label={`Open ${label} color picker. Current value: ${triggerDisplayValue}.`}
              className="group/menu-trigger block w-full text-left focus-visible:outline-none"
              type="button"
            />
          }
        >
          <MenuRow
            label={label}
            value={triggerDisplayValue}
            swatch={triggerSwatch}
          />
        </ColorPickerTrigger>
        {open ? (
          <ColorPickerContent side="right" align="start">
            <ThemeColorPickerControls />
          </ColorPickerContent>
        ) : null}
      </ColorPicker>
    </div>
  );
}

type CustomColorPickerTriggerRowProps = {
  label: string;
  value: string;
  fallback: string;
  displayValue: string;
  swatch: string;
  onChange: (value: string) => void;
};

function ThemeColorPickerControls() {
  return (
    <>
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
    </>
  );
}

function useColorPickerValue({
  value,
  fallback,
  onChange,
}: ColorPickerValueOptions) {
  const normalized = normalizeColorPickerValue(value);
  const pickerValue = normalized ?? fallback;

  return {
    normalized,
    pickerValue,
    setPickerValue(nextValue: string) {
      const normalizedNextValue = normalizeColorPickerValue(nextValue);

      if (normalizedNextValue && normalizedNextValue !== normalized) {
        onChange(normalizedNextValue);
      }
    },
  };
}

type ColorPickerValueOptions = {
  value: string;
  fallback: string;
  onChange: (value: string) => void;
};
