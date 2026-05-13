import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import type { CSSProperties } from "react";
import { useMemo, useRef, useState } from "react";
import { ComponentShowcase } from "@/components/component-showcase";
import { AppHeader } from "@/components/theme-generator/app-header";
import {
  RadixCnThemeProvider,
  useRadixCnTheme,
} from "@/components/theme-generator/radixcn-theme-context";
import { ThemeCustomizerSidebar } from "@/components/theme-generator/theme-customizer-sidebar";
import {
  createPreviewCss,
  createPreviewStyle,
} from "@/components/theme-generator/theme-customizer-utils";
import {
  FALLBACK_FONT_OPTIONS,
  getFontFaceCss,
} from "@/lib/theme-generator/fonts";
import type { SharedThemePreset } from "@/lib/theme-presets";
import type { FontSourceFont } from "@/lib/theme-generator/types";

export function ThemeGeneratorApp({
  fonts = FALLBACK_FONT_OPTIONS,
  initialPreset,
}: ThemeGeneratorAppProps) {
  return (
    <RadixCnThemeProvider
      fonts={fonts}
      initialSelection={initialPreset?.selection}
    >
      <ThemeGeneratorShell initialPreset={initialPreset} />
    </RadixCnThemeProvider>
  );
}

type ThemeGeneratorAppProps = {
  fonts?: ReadonlyArray<FontSourceFont>;
  initialPreset?: SharedThemePreset | null;
};

function ThemeGeneratorShell({ initialPreset }: ThemeGeneratorShellProps) {
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef<number | null>(null);
  const {
    activeTokens,
    generated,
    mode,
    setMode,
    reset,
    randomize,
    selection,
    previewSelection,
    updateChartScale,
    updateCustomChartColor,
    updateCustomChartEnabled,
    updateSelection,
    fonts,
  } = useRadixCnTheme();

  const previewStyle = useMemo(
    () => createPreviewStyle(activeTokens, previewSelection, fonts),
    [activeTokens, fonts, previewSelection],
  );
  const previewCss = useMemo(
    () => createPreviewCss(activeTokens, previewSelection, fonts),
    [activeTokens, fonts, previewSelection],
  );
  const previewFontFaces = useMemo(
    () =>
      getFontFaceCss(
        [
          previewSelection.headingFont,
          previewSelection.sansFont,
          previewSelection.monoFont,
        ],
        fonts,
      ),
    [
      fonts,
      previewSelection.headingFont,
      previewSelection.monoFont,
      previewSelection.sansFont,
    ],
  );
  const previewGrainyBackgroundClass =
    previewSelection.grainyBackgroundEnabled &&
    previewSelection.grainyBackgroundScope === "class"
      ? "grainy-background"
      : "";
  const sidebarStyle = useMemo(
    () =>
      ({
        "--sidebar-width": getScaledSidebarWidth(24, previewSelection.spacing),
        "--sidebar-width-mobile": `min(${getScaledSidebarWidth(
          22,
          previewSelection.spacing,
        )}, calc(100vw - 2rem))`,
      }) as CSSProperties,
    [previewSelection.spacing],
  );

  async function copyCss() {
    await navigator.clipboard.writeText(generated.css);
    if (copyResetTimerRef.current !== null) {
      window.clearTimeout(copyResetTimerRef.current);
    }

    setCopied(true);
    copyResetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyResetTimerRef.current = null;
    }, 1600);
  }

  return (
    <main
      data-theme-preview
      style={previewStyle}
      className={[
        mode === "dark" ? "dark" : "",
        "h-svh overflow-hidden bg-background text-foreground",
      ].join(" ")}
    >
      <style>{`${previewFontFaces}\n${previewCss}`}</style>
      <SidebarProvider
        className={[
          "h-svh min-h-0 overflow-hidden bg-background",
          previewGrainyBackgroundClass,
        ].join(" ")}
        style={sidebarStyle}
      >
        <ThemeCustomizerSidebar
          copied={copied}
          fonts={fonts}
          mode={mode}
          tokens={activeTokens}
          selection={selection}
          onCopy={copyCss}
          onModeChange={setMode}
          onRandomize={randomize}
          onReset={reset}
          onUpdate={updateSelection}
          onUpdateChartScale={updateChartScale}
          onUpdateCustomChartColor={updateCustomChartColor}
          onUpdateCustomChartEnabled={updateCustomChartEnabled}
        />

        <SidebarInset className="min-h-0 min-w-0 overflow-hidden bg-background shadow-xl shadow-foreground/10 ring-1 ring-border/60 dark:shadow-black/30">
          <AppHeader
            copied={copied}
            css={generated.css}
            preset={initialPreset}
            selection={selection}
            onCopy={copyCss}
          />
          <div className="min-h-0 flex-1 overflow-hidden bg-secondary/35 px-3 py-3 md:px-5 md:py-4 dark:bg-background">
            <ComponentShowcase />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}

type ThemeGeneratorShellProps = {
  initialPreset?: SharedThemePreset | null;
};

const BASE_SPACING_REM = 0.25;

function getScaledSidebarWidth(baseRem: number, spacingRem: number) {
  const width = baseRem * (spacingRem / BASE_SPACING_REM);

  return `${Number(width.toFixed(3))}rem`;
}
