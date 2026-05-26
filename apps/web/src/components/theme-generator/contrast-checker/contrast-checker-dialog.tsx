import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ContrastCard } from "@/components/theme-generator/contrast-checker/contrast-card";
import {
  ContrastSummaryCard,
  ContrastTargetControl,
} from "@/components/theme-generator/contrast-checker/contrast-summary";
import {
  applyContrastFix,
  applyContrastFixes,
  applyDraftTokenColors,
  buildContrastChecks,
  CONTRAST_SECTIONS,
  type ContrastCheck,
  type ContrastFilter,
  DEFAULT_APCA_TEXT_CONTRAST,
  type DraftTokenColors,
  findContrastFix,
  formatColor,
  getTokenColorReset,
  getTokenColorUpdate,
  getTokenPreviewColor,
} from "@/components/theme-generator/contrast-checker/logic";
import type {
  ColorMode,
  SemanticToken,
  ThemeModeTokens,
  ThemeSelection,
} from "@/lib/theme-generator/types";

export function ContrastCheckerDialog({
  className,
  mode,
  selection,
  tokens,
  onUpdate,
}: ContrastCheckerDialogProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<ContrastFilter>("all");
  const [targetContrast, setTargetContrast] = useState(
    DEFAULT_APCA_TEXT_CONTRAST,
  );
  const [draftTokenColors, setDraftTokenColors] = useState<DraftTokenColors>(
    {},
  );
  const baseChecks = useMemo(
    () => buildContrastChecks({ targetContrast, tokens }),
    [targetContrast, tokens],
  );
  const checks = useMemo(
    () => applyDraftTokenColors(baseChecks, draftTokenColors, targetContrast),
    [baseChecks, draftTokenColors, targetContrast],
  );
  const issues = useMemo(
    () => checks.filter((check) => !check.passes),
    [checks],
  );
  const visibleChecks = filter === "issues" ? issues : checks;
  const averageScore =
    checks.length > 0
      ? checks.reduce((total, check) => total + check.score, 0) / checks.length
      : 0;

  useEffect(() => {
    setDraftTokenColors((currentDrafts) => {
      let changed = false;
      const nextDrafts = { ...currentDrafts };

      for (const [token, draftColor] of Object.entries(currentDrafts) as Array<
        [SemanticToken, string]
      >) {
        const tokenColor = tokens[token];

        if (tokenColor && formatColor(tokenColor) === formatColor(draftColor)) {
          delete nextDrafts[token];
          changed = true;
        }
      }

      return changed ? nextDrafts : currentDrafts;
    });
  }, [tokens]);

  const previewTokenColor = (token: SemanticToken, value: string) => {
    const previewColor = getTokenPreviewColor({
      mode,
      selection,
      token,
      value,
    });

    setDraftTokenColors((currentDrafts) => {
      if (currentDrafts[token] === previewColor) {
        return currentDrafts;
      }

      return {
        ...currentDrafts,
        [token]: previewColor,
      };
    });
  };

  const updateTokenColor = (token: SemanticToken, value: string) => {
    onUpdate(getTokenColorUpdate(selection, token, mode, value));
  };

  const resetTokenColor = (token: SemanticToken) => {
    setDraftTokenColors((currentDrafts) => {
      if (!(token in currentDrafts)) {
        return currentDrafts;
      }

      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[token];
      return nextDrafts;
    });

    onUpdate(getTokenColorReset(selection, token, mode));
  };

  const fixIssue = (check: ContrastCheck) => {
    const fix = findContrastFix({
      check,
      mode,
      selection,
      targetContrast,
    });

    if (fix) {
      onUpdate(applyContrastFix(selection, check, mode, fix));
    }
  };

  const fixAllIssues = () => {
    onUpdate(
      applyContrastFixes({
        issues,
        mode,
        selection,
        targetContrast,
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button className={className} variant="outline" />}
      >
        {issues.length === 0 ? (
          <CheckCircle2 className="text-success" />
        ) : (
          <CircleAlert className="text-destructive" />
        )}
        Contrast
        {issues.length > 0 ? (
          <Badge
            className="ml-auto h-4 px-1.5 text-[10px]"
            variant="destructive"
          >
            {issues.length}
          </Badge>
        ) : null}
      </DialogTrigger>

      <DialogContent className="grid h-[calc(100svh-2rem)] max-h-[calc(100svh-2rem)] w-[calc(100vw-2rem)] max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-6xl lg:h-[calc(100svh-3rem)] lg:max-h-[calc(100svh-3rem)]">
        <DialogHeader className="sticky top-0 z-10 border-b bg-popover px-5 pt-5 pb-4 text-left sm:px-6">
          <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <DialogTitle>Contrast Checker</DialogTitle>
              <DialogDescription>
                APCA text contrast should reach your selected Lc target.{" "}
                <a
                  className="underline underline-offset-3 hover:text-foreground"
                  href="https://apcacontrast.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn more
                </a>
              </DialogDescription>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                disabled={issues.length === 0}
                variant="default"
                onClick={fixAllIssues}
              >
                <Sparkles />
                Fix all
              </Button>
              <Tabs
                className="gap-0"
                value={filter}
                onValueChange={(value) => setFilter(value as ContrastFilter)}
              >
                <TabsList className="border">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="issues">
                    <AlertTriangle />
                    Issues ({issues.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="grid gap-3 pt-4 sm:grid-cols-2 xl:grid-cols-[minmax(10rem,0.75fr)_minmax(10rem,0.75fr)_minmax(10rem,0.75fr)_minmax(24rem,1.5fr)]">
            <ContrastSummaryCard
              icon={<CheckCircle2 className="size-4" />}
              label="Passing"
              value={`${checks.length - issues.length}/${checks.length}`}
            />
            <ContrastSummaryCard
              icon={<AlertTriangle className="size-4" />}
              label="Issues"
              tone={issues.length > 0 ? "danger" : "default"}
              value={String(issues.length)}
            />
            <ContrastSummaryCard
              icon={<Gauge className="size-4" />}
              label="Average Lc"
              value={averageScore.toFixed(0)}
            />
            <ContrastTargetControl
              className="sm:col-span-2 xl:col-span-1"
              value={targetContrast}
              onChange={setTargetContrast}
            />
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-col overflow-y-auto overscroll-contain bg-muted/30 px-5 py-5 sm:px-6">
          {CONTRAST_SECTIONS.map((section) => {
            const sectionChecks = visibleChecks.filter(
              (check) => check.section === section.title,
            );

            if (sectionChecks.length === 0) {
              return null;
            }

            return (
              <section className="space-y-3 pb-5" key={section.title}>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {sectionChecks.map((check) => (
                    <ContrastCard
                      check={check}
                      key={`${check.backgroundToken}:${check.foregroundToken}`}
                      mode={mode}
                      selection={selection}
                      onFix={() => fixIssue(check)}
                      onPreviewTokenColor={previewTokenColor}
                      onResetTokenColor={resetTokenColor}
                      onUpdateTokenColor={updateTokenColor}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {visibleChecks.length === 0 ? (
            <div className="grid min-h-56 flex-1 place-items-center rounded-lg border border-dashed bg-background/70 text-center">
              <div className="space-y-2">
                <CheckCircle2 className="mx-auto size-7 text-success" />
                <div className="text-sm font-medium">No contrast issues</div>
                <p className="max-w-72 text-xs text-muted-foreground">
                  Every checked foreground and background token pair reaches
                  APCA Lc {targetContrast} in the current mode.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ContrastCheckerDialogProps = {
  className?: string;
  mode: ColorMode;
  selection: ThemeSelection;
  tokens: ThemeModeTokens;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};
