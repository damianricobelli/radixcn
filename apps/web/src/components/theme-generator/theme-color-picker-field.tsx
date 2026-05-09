import { Button } from "@workspace/ui/components/button";
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@workspace/ui/components/color-picker";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { ColorPickerPalettePreview } from "@/components/theme-generator/color-picker-palette-preview";
import { normalizeColorPickerValue } from "@/components/theme-generator/color-value-utils";
import { MenuRow } from "@/components/theme-generator/theme-customizer-section";
import type { CustomPalettePreviewRole } from "@/lib/theme-generator/generator";

export function CustomColorPickerTriggerRow({
  label,
  value,
  fallback,
  displayValue,
  swatch,
  palettePreviewRole,
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
            <ThemeColorPickerControls
              palettePreviewRole={palettePreviewRole}
              previewColor={pickerValue}
            />
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
  palettePreviewRole?: CustomPalettePreviewRole;
  onChange: (value: string) => void;
};

export function CustomColorPickerSwatchTrigger({
  label,
  value,
  fallback,
  swatch,
  palettePreviewRole,
  onChange,
  children,
}: CustomColorPickerSwatchTriggerProps) {
  const { pickerValue, normalized, setPickerValue } = useColorPickerValue({
    value,
    fallback,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const triggerSwatch = normalized ?? swatch;

  return (
    <ColorPicker
      className="contents"
      value={pickerValue}
      onValueChange={setPickerValue}
      open={open}
      onOpenChange={setOpen}
      defaultFormat="hex"
    >
      <ColorPickerTrigger
        render={
          <button
            aria-label={`Open ${label} color picker.`}
            className="group/chart-color relative flex size-7 items-center justify-center rounded-md transition-colors hover:bg-sidebar/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
            style={{ "--chart-color": triggerSwatch } as CSSProperties}
            type="button"
          />
        }
      >
        {children}
      </ColorPickerTrigger>
      {open ? (
        <ColorPickerContent side="right" align="start">
          <ThemeColorPickerControls
            palettePreviewRole={palettePreviewRole}
            previewColor={pickerValue}
          />
        </ColorPickerContent>
      ) : null}
    </ColorPicker>
  );
}

type CustomColorPickerSwatchTriggerProps = {
  label: string;
  value: string;
  fallback: string;
  swatch: string;
  palettePreviewRole?: CustomPalettePreviewRole;
  onChange: (value: string) => void;
  children: ReactNode;
};

export function CustomColorPickerField({
  label,
  value,
  fallback,
  palettePreviewRole,
  onChange,
  compact = false,
}: CustomColorPickerFieldProps) {
  const { pickerValue, normalized, setPickerValue } = useColorPickerValue({
    value,
    fallback,
    onChange,
  });
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-md px-2.5 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent/55">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-sidebar-foreground/65">{label}</div>
          <div className="text-sm font-medium">
            {normalized ?? "Pick color"}
          </div>
        </div>
        <div className="shrink-0">
          <ColorPicker
            value={pickerValue}
            onValueChange={setPickerValue}
            open={open}
            onOpenChange={setOpen}
            defaultFormat="hex"
          >
            <ColorPickerTrigger
              render={<Button size="icon-sm" variant="outline" />}
            >
              <ColorPickerSwatch className="size-4 rounded-full" />
            </ColorPickerTrigger>
            {open ? (
              <ColorPickerContent side="right" align="start">
                <ThemeColorPickerControls
                  palettePreviewRole={palettePreviewRole}
                  previewColor={pickerValue}
                />
              </ColorPickerContent>
            ) : null}
          </ColorPicker>
        </div>
      </div>
      {normalized ? (
        <Button
          className="mt-2 w-full"
          size="sm"
          variant="ghost"
          onClick={() => onChange("")}
        >
          Clear custom color
        </Button>
      ) : null}
      {!compact ? (
        <p className="mt-2 text-xs leading-5 text-sidebar-foreground/65">
          Generates accessible light and dark palettes from this Radix step 9
          color.
        </p>
      ) : null}
    </div>
  );
}

type CustomColorPickerFieldProps = {
  label: string;
  value: string;
  fallback: string;
  palettePreviewRole?: CustomPalettePreviewRole;
  onChange: (value: string) => void;
  compact?: boolean;
};

function ThemeColorPickerControls({
  palettePreviewRole,
  previewColor,
}: ThemeColorPickerControlsProps) {
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
      {palettePreviewRole ? (
        <ColorPickerPalettePreview
          color={previewColor}
          role={palettePreviewRole}
        />
      ) : null}
    </>
  );
}

type ThemeColorPickerControlsProps = {
  palettePreviewRole?: CustomPalettePreviewRole;
  previewColor: string;
};

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
