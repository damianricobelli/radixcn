import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
} from "@workspace/ui/components/number-field";
import { Slider } from "@workspace/ui/components/slider";
import { Switch } from "@workspace/ui/components/switch";
import { ExternalLink, Moon, Sun } from "lucide-react";
import type { ColorMode, RadiusScale } from "@/lib/theme-generator/types";

export function ThemeModeSwitch({ mode, onModeChange }: ThemeModeSwitchProps) {
  const isDark = mode === "dark";

  return (
    <button
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex h-8 w-14.5 shrink-0 items-center rounded-full border border-sidebar-border bg-sidebar-accent p-1 text-sidebar-foreground transition-colors outline-none hover:bg-sidebar-accent/80 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
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

export function getRadiusLabel(radius: RadiusScale) {
  if (radius === "default") {
    return "Default";
  }

  if (radius === "none") {
    return "None";
  }

  if (radius === "extra-large") {
    return "Extra large";
  }

  return `${radius.slice(0, 1).toUpperCase()}${radius.slice(1)}`;
}

export function AdditionalStatesCheckbox({
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

export function RadixColorImportsCheckbox({
  checked,
  onCheckedChange,
}: RadixColorImportsCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md px-2.5 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent/55">
      <Checkbox
        aria-label="Include Radix color scale imports"
        checked={checked}
        className="mt-0.5"
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked === true)}
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium">Radix scale imports</span>
        <span className="block text-xs leading-5 text-sidebar-foreground/65">
          Adds light and dark @radix-ui/colors imports for the Radix palettes
          used by this theme. Custom palettes are skipped.
        </span>
        <a
          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-sidebar-foreground/75 underline-offset-4 hover:text-sidebar-foreground hover:underline"
          href="https://www.radix-ui.com/colors/docs/overview/usage"
          rel="noreferrer"
          target="_blank"
          onClick={(event) => event.stopPropagation()}
        >
          Radix Colors usage
          <ExternalLink className="size-3" />
        </a>
      </span>
    </label>
  );
}

type RadixColorImportsCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function GrainyBackgroundSwitch({
  checked,
  onCheckedChange,
}: GrainyBackgroundSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 px-2.5 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent/55">
      <span className="min-w-0">
        <span className="block text-sm font-medium">Grainy background</span>
        <span className="block text-xs text-sidebar-foreground/65">
          SVG noise texture overlay.
        </span>
      </span>
      <Switch
        aria-label="Enable grainy background"
        checked={checked}
        size="sm"
        onCheckedChange={onCheckedChange}
      />
    </label>
  );
}

type GrainyBackgroundSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function ShadowNumberControl({
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
