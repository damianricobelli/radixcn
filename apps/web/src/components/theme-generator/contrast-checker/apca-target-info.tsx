import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { Info } from "lucide-react";

export function ApcaTargetInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            aria-label="Learn about APCA Lc targets"
            className="inline-flex rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            type="button"
          />
        }
      >
        <Info aria-hidden="true" className="size-3.5" />
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="w-[min(calc(100vw-2rem),34rem)] space-y-3"
      >
        <div className="space-y-1">
          <div className="text-sm font-medium">APCA Lc targets</div>
          <p className="text-xs leading-5 text-muted-foreground">
            APCA evaluates contrast relative to text size, weight, and polarity.
            Light text on dark backgrounds can be negative; use the absolute Lc
            value for these guidelines.
          </p>
        </div>
        <div className="overflow-hidden rounded-md border text-xs">
          <div className="grid grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.35fr)] border-b bg-muted/70 text-[11px] font-medium text-muted-foreground">
            <div className="px-2.5 py-2">Target</div>
            <div className="border-l px-2.5 py-2">Use</div>
            <div className="border-l px-2.5 py-2">Minimum examples</div>
          </div>
          {APCA_TARGET_GUIDELINES.map((guideline) => (
            <div
              className="grid grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.35fr)] border-b last:border-b-0"
              key={guideline.value}
            >
              <div className="bg-background px-2.5 py-2 font-semibold tabular-nums">
                {guideline.value}
              </div>
              <div className="border-l px-2.5 py-2 font-medium">
                {guideline.use}
              </div>
              <div className="border-l px-2.5 py-2 leading-5 text-muted-foreground">
                {guideline.examples}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] leading-4 text-muted-foreground">
          Defaults to Lc 60 for readable UI/content text. Values are summarized
          from the APCA Bronze guidelines.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

const APCA_TARGET_GUIDELINES = [
  {
    value: "Lc 90",
    use: "Fluent reading",
    examples: "Body text columns; 14px/400 or 18px/300 and larger.",
  },
  {
    value: "Lc 75",
    use: "Body text",
    examples: "Minimum for body copy, e.g. 18px/400 or 14px/700.",
  },
  {
    value: "Lc 60",
    use: "UI/content",
    examples: "Readable labels and content text; 16px/700 or larger.",
  },
  {
    value: "Lc 45",
    use: "Large text",
    examples: "Headlines, 36px regular or 24px bold; detailed icons.",
  },
  {
    value: "Lc 30",
    use: "Spot readable",
    examples: "Placeholder, disabled text, copyright, or solid icons.",
  },
  {
    value: "Lc 15",
    use: "Non-text",
    examples: "Dividers, large buttons, or thick focus outlines.",
  },
] as const;
