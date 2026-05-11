import { useMemo } from "react";
import { useRadixCnTheme } from "@/components/theme-generator/radixcn-theme-context";
import {
  type CustomPalettePreviewRole,
  getGeneratedCustomPalettePreview,
} from "@/lib/theme-generator/generator";
import { RADIX_STEPS } from "@/lib/theme-generator/types";

export function ColorPickerPalettePreview({
  color,
  role,
}: ColorPickerPalettePreviewProps) {
  const { selection } = useRadixCnTheme();
  const preview = useMemo(
    () => getGeneratedCustomPalettePreview({ selection, color, role }),
    [color, role, selection],
  );

  if (!preview) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-foreground">
          Generated palette
        </div>
        <div className="text-[11px] font-medium text-muted-foreground">
          Radix 12 steps
        </div>
      </div>
      <div className="space-y-1.5">
        <PaletteRow label="Light" colors={preview.light} />
        <PaletteRow label="Dark" colors={preview.dark} />
      </div>
    </div>
  );
}

type ColorPickerPalettePreviewProps = {
  color: string;
  role: CustomPalettePreviewRole;
};

function PaletteRow({ label, colors }: PaletteRowProps) {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2">
      <div className="text-[11px] font-medium text-muted-foreground">
        {label}
      </div>
      <div className="grid min-w-0 grid-cols-12 overflow-hidden rounded-md border border-border">
        {RADIX_STEPS.map((step) => (
          <span
            className="aspect-square min-w-0 border-border border-r last:border-r-0"
            key={step}
            title={`${label} ${step}: ${colors[step]}`}
            style={{ background: colors[step] }}
          />
        ))}
      </div>
    </div>
  );
}

type PaletteRowProps = {
  label: string;
  colors: Record<(typeof RADIX_STEPS)[number], string>;
};
