import {
  applyContrastFixes,
  buildContrastChecks,
  DEFAULT_APCA_TEXT_CONTRAST,
} from "@/components/theme-generator/contrast-checker/logic";
import { generateTheme } from "@/lib/theme-generator/generator";
import type { ColorMode, ThemeSelection } from "@/lib/theme-generator/types";

const MAX_TEMPLATE_CONTRAST_PASSES = 4;

export function ensureTemplateContrast(
  selection: ThemeSelection,
  targetContrast = DEFAULT_APCA_TEXT_CONTRAST,
) {
  let nextSelection = selection;

  for (const mode of ["light", "dark"] as const satisfies Array<ColorMode>) {
    nextSelection = ensureModeTemplateContrast({
      mode,
      selection: nextSelection,
      targetContrast,
    });
  }

  return nextSelection;
}

function ensureModeTemplateContrast({
  mode,
  selection,
  targetContrast,
}: {
  mode: ColorMode;
  selection: ThemeSelection;
  targetContrast: number;
}) {
  let nextSelection = selection;

  for (let pass = 0; pass < MAX_TEMPLATE_CONTRAST_PASSES; pass += 1) {
    const tokens = generateTheme(nextSelection)[mode];
    const issues = buildContrastChecks({ targetContrast, tokens }).filter(
      (check) => !check.passes,
    );

    if (issues.length === 0) {
      break;
    }

    const contrastFix = applyContrastFixes({
      issues,
      mode,
      selection: nextSelection,
      targetContrast,
    });

    if (
      contrastFix.tokenStepOverrides === nextSelection.tokenStepOverrides &&
      contrastFix.tokenCustomOverrides === nextSelection.tokenCustomOverrides
    ) {
      break;
    }

    nextSelection = {
      ...nextSelection,
      ...contrastFix,
    };
  }

  return nextSelection;
}
