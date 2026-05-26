import { Button } from "@workspace/ui/components/button";
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
import { Pipette, RotateCcw } from "lucide-react";
import { normalizeColorPickerValue } from "@/components/theme-generator/color-value-utils";
import { formatColor } from "@/components/theme-generator/contrast-checker/logic";
import type { SemanticToken } from "@/lib/theme-generator/types";

export function TokenSwatch({
  editorValue,
  label,
  resolvedValue,
  token,
  onChange,
  onPreviewChange,
  onReset,
}: TokenSwatchProps) {
  const pickerValue =
    normalizeColorPickerValue(formatColor(editorValue)) ?? "#000000";

  const scheduleChange = (nextValue: string) => {
    const nextPickerValue = normalizeColorPickerValue(nextValue);

    if (!nextPickerValue) {
      return;
    }

    onPreviewChange(nextPickerValue);
    onChange(nextPickerValue);
  };

  const resetColor = () => {
    onReset();
  };

  return (
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 rounded-md border bg-background/70 p-2">
      <ColorPicker
        value={pickerValue}
        defaultFormat="hex"
        onValueChange={scheduleChange}
      >
        <ColorPickerTrigger
          aria-label={`Edit ${token} color`}
          render={
            <button
              className="size-10 rounded-md border shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ backgroundColor: resolvedValue }}
              type="button"
            />
          }
        />
        <ColorPickerContent
          align="start"
          className="w-[min(calc(100vw-2rem),20rem)]"
        >
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper size="icon-sm" variant="outline">
              <Pipette />
            </ColorPickerEyeDropper>
            <div className="min-w-0 flex-1">
              <ColorPickerHueSlider />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerFormatSelect />
            <ColorPickerInput withoutAlpha />
          </div>
        </ColorPickerContent>
      </ColorPicker>
      <span className="min-w-0">
        <span className="flex items-center justify-between gap-1.5 text-xs font-medium">
          <span className="truncate">{label}</span>
          <Button
            aria-label={`Reset ${token} custom color`}
            className="size-5"
            size="icon-xs"
            variant="ghost"
            onClick={resetColor}
          >
            <RotateCcw className="size-3" />
          </Button>
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {token} · {formatColor(resolvedValue)}
        </span>
        <span className="block truncate text-[11px] text-muted-foreground/70">
          Source {formatColor(pickerValue)}
        </span>
      </span>
    </div>
  );
}

type TokenSwatchProps = {
  editorValue: string;
  label: string;
  resolvedValue: string;
  token: SemanticToken;
  onChange: (value: string) => void;
  onPreviewChange: (value: string) => void;
  onReset: () => void;
};
