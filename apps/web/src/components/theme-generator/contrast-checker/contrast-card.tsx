import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { AlertTriangle, Check, Sparkles } from "lucide-react";
import { TokenSwatch } from "@/components/theme-generator/contrast-checker/token-swatch";
import {
  type ContrastCheck,
  getContrastUseCase,
  getTokenEditorColor,
} from "@/components/theme-generator/contrast-checker/logic";
import type {
  ColorMode,
  SemanticToken,
  ThemeSelection,
} from "@/lib/theme-generator/types";

export function ContrastCard({
  check,
  mode,
  onFix,
  onPreviewTokenColor,
  onResetTokenColor,
  onUpdateTokenColor,
  selection,
}: ContrastCardProps) {
  const backgroundEditorColor = getTokenEditorColor({
    mode,
    resolvedColor: check.background,
    selection,
    token: check.backgroundToken,
  });
  const foregroundEditorColor = getTokenEditorColor({
    mode,
    resolvedColor: check.foreground,
    selection,
    token: check.foregroundToken,
  });
  const useCase = getContrastUseCase(check.score);

  return (
    <article
      className={cn(
        "grid h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-4 rounded-lg border bg-background p-4 shadow-sm transition-colors xl:p-5",
        !check.passes && "border-destructive-border bg-destructive-muted/35",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div
            className={cn(
              "truncate text-sm font-semibold",
              !check.passes && "text-destructive",
            )}
          >
            {check.label}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {check.backgroundToken} / {check.foregroundToken}
          </div>
        </div>
        <Badge className="h-6 shrink-0 px-2" variant="outline">
          Lc {check.score.toFixed(0)}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            "h-5 gap-1 px-2 text-[11px]",
            check.passes ? "text-success" : "text-destructive",
          )}
          variant="outline"
        >
          {check.passes ? (
            <Check className="size-3" />
          ) : (
            <AlertTriangle className="size-3" />
          )}
          {useCase.label}
        </Badge>
        <span className="min-w-0 text-xs text-muted-foreground">
          {useCase.description}
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(13rem,1fr)_minmax(14rem,0.95fr)] xl:items-start">
        <div className="grid gap-2.5">
          <TokenSwatch
            editorValue={backgroundEditorColor}
            label="Background"
            resolvedValue={check.background}
            token={check.backgroundToken}
            onPreviewChange={(value) =>
              onPreviewTokenColor(check.backgroundToken, value)
            }
            onChange={(value) =>
              onUpdateTokenColor(check.backgroundToken, value)
            }
            onReset={() => onResetTokenColor(check.backgroundToken)}
          />
          <TokenSwatch
            editorValue={foregroundEditorColor}
            label="Foreground"
            resolvedValue={check.foreground}
            token={check.foregroundToken}
            onPreviewChange={(value) =>
              onPreviewTokenColor(check.foregroundToken, value)
            }
            onChange={(value) =>
              onUpdateTokenColor(check.foregroundToken, value)
            }
            onReset={() => onResetTokenColor(check.foregroundToken)}
          />
        </div>
        <div
          className="grid min-h-36 gap-3 rounded-lg border p-4 shadow-sm"
          style={{
            backgroundColor: check.background,
            color: check.foreground,
          }}
        >
          <ContrastSample
            fontSize={14}
            fontWeight={400}
            label="Body"
            score={check.score}
            threshold={90}
          />
          <ContrastSample
            fontSize={16}
            fontWeight={700}
            label="UI label"
            score={check.score}
            threshold={60}
          />
          <ContrastSample
            fontSize={24}
            fontWeight={700}
            label="Heading"
            score={check.score}
            threshold={45}
          />
        </div>
      </div>

      <div className="flex items-start">
        {!check.passes ? (
          <div className="flex w-full flex-col gap-3 rounded-md border border-destructive-border bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 text-xs leading-5 text-muted-foreground">
              Needs Lc {check.target}. Fix searches the nearest passing Radix
              token combination.
            </div>
            <Button className="shrink-0" size="sm" onClick={onFix}>
              <Sparkles />
              Fix
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

type ContrastCardProps = {
  check: ContrastCheck;
  mode: ColorMode;
  onFix: () => void;
  onPreviewTokenColor: (token: SemanticToken, value: string) => void;
  onResetTokenColor: (token: SemanticToken) => void;
  onUpdateTokenColor: (token: SemanticToken, value: string) => void;
  selection: ThemeSelection;
};

function ContrastSample({
  fontSize,
  fontWeight,
  label,
  score,
  threshold,
}: ContrastSampleProps) {
  const passes = score >= threshold - 0.5;

  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0">
        <div
          className="truncate"
          style={{
            fontSize,
            fontWeight,
            lineHeight: fontSize < 20 ? "1.25" : "1.15",
          }}
        >
          Sample text
        </div>
        <div className="text-[11px] opacity-75">
          {label} · {fontSize}px/{fontWeight}
        </div>
      </div>
      <Badge
        className="h-5 shrink-0 gap-1 bg-background/85 px-1.5 text-[10px]"
        variant="outline"
      >
        {passes ? (
          <Check className="size-3" />
        ) : (
          <AlertTriangle className="size-3" />
        )}
        Lc {threshold}
      </Badge>
    </div>
  );
}

type ContrastSampleProps = {
  fontSize: number;
  fontWeight: number;
  label: string;
  score: number;
  threshold: number;
};
