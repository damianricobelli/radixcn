import { Slider } from "@workspace/ui/components/slider";
import { cn } from "@workspace/ui/lib/utils";
import { Gauge } from "lucide-react";
import { type ReactNode, useId } from "react";
import { ApcaTargetInfo } from "@/components/theme-generator/contrast-checker/apca-target-info";
import {
  MAX_APCA_TEXT_CONTRAST,
  MIN_APCA_TEXT_CONTRAST,
  normalizeTargetContrast,
} from "@/components/theme-generator/contrast-checker/logic";

export function ContrastSummaryCard({
  icon,
  label,
  value,
  tone = "default",
}: ContrastSummaryCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5",
        tone === "danger" && "border-destructive-border bg-destructive-muted",
      )}
    >
      <div
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground",
          tone === "danger" && "bg-destructive text-destructive-foreground",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

type ContrastSummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "default" | "danger";
};

export function ContrastTargetControl({
  className,
  value,
  onChange,
}: ContrastTargetControlProps) {
  const targetId = useId();

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-background px-3 py-2.5",
        className,
      )}
    >
      <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
        <Gauge className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5">
            <label
              className="truncate text-xs text-muted-foreground"
              htmlFor={targetId}
            >
              Lc Target
            </label>
            <ApcaTargetInfo />
          </span>
          <span className="text-sm font-semibold tabular-nums">{value}</span>
        </div>
        <Slider
          aria-label="Lc Target"
          className="mt-2"
          id={targetId}
          max={MAX_APCA_TEXT_CONTRAST}
          min={MIN_APCA_TEXT_CONTRAST}
          step={1}
          value={[value]}
          onValueChange={(nextValues) => {
            const nextValue = Array.isArray(nextValues)
              ? nextValues[0]
              : nextValues;

            onChange(normalizeTargetContrast(nextValue));
          }}
        />
      </div>
    </div>
  );
}

type ContrastTargetControlProps = {
  className?: string;
  value: number;
  onChange: (value: number) => void;
};
