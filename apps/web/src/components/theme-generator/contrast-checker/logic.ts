import Color from "colorjs.io";
import { colorToHex, isValidCssColor } from "@/lib/theme-generator/color";
import {
  generateTheme,
  getSemanticTokenCustomStepPreviewColor,
  getSemanticTokenDefaultStep,
  getSemanticTokenStepPreviewColor,
} from "@/lib/theme-generator/generator";
import {
  type ColorMode,
  RADIX_STEPS,
  type RadixStep,
  type SemanticToken,
  type ThemeModeTokens,
  type ThemeSelection,
} from "@/lib/theme-generator/types";

export const DEFAULT_APCA_TEXT_CONTRAST = 60;
export const MIN_APCA_TEXT_CONTRAST = 30;
export const MAX_APCA_TEXT_CONTRAST = 106;
const CONTRAST_DISPLAY_TOLERANCE = 0.5;
const MAX_BACKGROUND_ONLY_STEP_DISTANCE = 4;

export type ContrastFilter = "all" | "issues";

export type ContrastUseCase =
  | "fluent"
  | "body"
  | "content"
  | "large"
  | "spot"
  | "non-text";

export type ContrastCheck = {
  section: string;
  label: string;
  backgroundToken: SemanticToken;
  foregroundToken: SemanticToken;
  background: string;
  foreground: string;
  score: number;
  target: number;
  passes: boolean;
};

export type ContrastFix = {
  score: number;
  background?: TokenFix;
  foreground?: TokenFix;
};

type TokenFix = {
  step: RadixStep;
  customColor?: string;
};

export type DraftTokenColors = Partial<Record<SemanticToken, string>>;

type ContrastSection = {
  title: string;
  pairs: ReadonlyArray<readonly [string, SemanticToken, SemanticToken]>;
};

export const CONTRAST_SECTIONS = [
  {
    title: "Content & Containers",
    pairs: [
      ["Base", "background", "foreground"],
      ["Card", "card", "card-foreground"],
      ["Popover", "popover", "popover-foreground"],
      ["Muted", "muted", "muted-foreground"],
    ],
  },
  {
    title: "Interactive Elements",
    pairs: [
      ["Primary", "primary", "primary-foreground"],
      ["Secondary", "secondary", "secondary-foreground"],
      ["Accent", "accent", "accent-foreground"],
      ["Destructive", "destructive", "destructive-foreground"],
      [
        "Destructive muted",
        "destructive-muted",
        "destructive-muted-foreground",
      ],
    ],
  },
  {
    title: "Additional States",
    pairs: [
      ["Success", "success", "success-foreground"],
      ["Success muted", "success-muted", "success-muted-foreground"],
      ["Warning", "warning", "warning-foreground"],
      ["Warning muted", "warning-muted", "warning-muted-foreground"],
      ["Info", "info", "info-foreground"],
      ["Info muted", "info-muted", "info-muted-foreground"],
    ],
  },
  {
    title: "Sidebar",
    pairs: [
      ["Sidebar", "sidebar", "sidebar-foreground"],
      ["Sidebar primary", "sidebar-primary", "sidebar-primary-foreground"],
      ["Sidebar accent", "sidebar-accent", "sidebar-accent-foreground"],
    ],
  },
] as const satisfies ReadonlyArray<ContrastSection>;

export function buildContrastChecks({
  targetContrast,
  tokens,
}: {
  targetContrast: number;
  tokens: ThemeModeTokens;
}) {
  return CONTRAST_SECTIONS.flatMap((section) =>
    section.pairs.flatMap(([label, backgroundToken, foregroundToken]) => {
      const background = tokens[backgroundToken];
      const foreground = tokens[foregroundToken];

      if (!background || !foreground) {
        return [];
      }

      const score = getContrastScore(background, foreground);

      if (score === null) {
        return [];
      }

      return {
        section: section.title,
        label,
        backgroundToken,
        foregroundToken,
        background,
        foreground,
        score,
        target: targetContrast,
        passes: contrastPasses(score, targetContrast),
      };
    }),
  );
}

export function applyDraftTokenColors(
  checks: Array<ContrastCheck>,
  draftTokenColors: DraftTokenColors,
  targetContrast: number,
) {
  if (Object.keys(draftTokenColors).length === 0) {
    return checks;
  }

  return checks.map((check) => {
    const background =
      draftTokenColors[check.backgroundToken] ?? check.background;
    const foreground =
      draftTokenColors[check.foregroundToken] ?? check.foreground;

    if (background === check.background && foreground === check.foreground) {
      return check;
    }

    const score = getContrastScore(background, foreground) ?? check.score;

    return {
      ...check,
      background,
      foreground,
      score,
      target: targetContrast,
      passes: contrastPasses(score, targetContrast),
    };
  });
}

export function getTokenEditorColor({
  mode,
  resolvedColor,
  selection,
  token,
}: {
  mode: ColorMode;
  resolvedColor: string;
  selection: ThemeSelection;
  token: SemanticToken;
}) {
  return selection.tokenCustomOverrides[token]?.[mode]?.trim() || resolvedColor;
}

export function getTokenPreviewColor({
  mode,
  selection,
  token,
  value,
}: {
  mode: ColorMode;
  selection: ThemeSelection;
  token: SemanticToken;
  value: string;
}) {
  return (
    getSemanticTokenCustomStepPreviewColor(
      selection,
      token,
      mode,
      value,
      getCurrentTokenStep(selection, token, mode),
    ) ?? value
  );
}

export function getTokenColorUpdate(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
  value: string,
) {
  return {
    tokenStepOverrides: updateTokenStepOverride(
      selection,
      token,
      mode,
      getCurrentTokenStep(selection, token, mode),
    ),
    tokenCustomOverrides: updateTokenCustomOverride(
      selection,
      token,
      mode,
      value,
    ),
  };
}

export function getTokenColorReset(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
) {
  return {
    tokenStepOverrides: updateTokenStepOverride(selection, token, mode, null),
    tokenCustomOverrides: updateTokenCustomOverride(
      selection,
      token,
      mode,
      null,
    ),
  };
}

export function findContrastFix({
  check,
  mode,
  selection,
  targetContrast,
}: {
  check: ContrastCheck;
  mode: ColorMode;
  selection: ThemeSelection;
  targetContrast: number;
}) {
  const targetScore = getMinimumPassingScore(targetContrast);
  const backgroundStep = getCurrentTokenStep(
    selection,
    check.backgroundToken,
    mode,
  );
  const foregroundStep = getCurrentTokenStep(
    selection,
    check.foregroundToken,
    mode,
  );
  const backgroundCandidates = getTokenFixCandidates({
    mode,
    selection,
    token: check.backgroundToken,
  });
  const foregroundCandidates = getTokenFixCandidates({
    mode,
    selection,
    token: check.foregroundToken,
  });
  const readableForegroundCandidates = getReadableForegroundCandidates();
  const backgroundOnlyOptions = backgroundCandidates.map((background) => ({
    background,
    score: getContrastScore(background.color, check.foreground) ?? 0,
  }));
  const pairedStepOptions = backgroundCandidates.flatMap((background) =>
    foregroundCandidates.map((foreground) => ({
      background,
      foreground,
      score: getContrastScore(background.color, foreground.color) ?? 0,
    })),
  );
  const readableForegroundOptions = backgroundCandidates.flatMap((background) =>
    readableForegroundCandidates.map((foreground) => ({
      background,
      foreground,
      score: getContrastScore(background.color, foreground.color) ?? 0,
    })),
  );
  const backgroundOnlyFix = pickBestPassingFix(backgroundOnlyOptions, {
    backgroundStep,
    check,
    foregroundStep,
    mode,
    selection,
    targetScore,
  });

  if (
    backgroundOnlyFix &&
    getFixDistance(backgroundOnlyFix, backgroundStep, foregroundStep) <=
      MAX_BACKGROUND_ONLY_STEP_DISTANCE
  ) {
    return backgroundOnlyFix;
  }

  const pairedStepFix = pickBestPassingFix(pairedStepOptions, {
    backgroundStep,
    check,
    foregroundStep,
    mode,
    selection,
    targetScore,
  });

  if (pairedStepFix) {
    return pairedStepFix;
  }

  if (backgroundOnlyFix) {
    return backgroundOnlyFix;
  }

  const readableForegroundFix = pickBestPassingFix(readableForegroundOptions, {
    backgroundStep,
    check,
    foregroundStep,
    mode,
    selection,
    targetScore,
  });

  return (
    readableForegroundFix ??
    pickBestImprovingFix(
      [
        ...backgroundOnlyOptions,
        ...pairedStepOptions,
        ...readableForegroundOptions,
      ],
      { backgroundStep, check, foregroundStep, mode, selection },
    )
  );
}

export function applyContrastFix(
  selection: ThemeSelection,
  check: ContrastCheck,
  mode: ColorMode,
  fix: ContrastFix,
) {
  let nextSelection = selection;

  if (fix.background) {
    nextSelection = applyTokenFix(
      nextSelection,
      check.backgroundToken,
      mode,
      fix.background,
    );
  }

  if (fix.foreground) {
    nextSelection = applyTokenFix(
      nextSelection,
      check.foregroundToken,
      mode,
      fix.foreground,
    );
  }

  return {
    tokenStepOverrides: nextSelection.tokenStepOverrides,
    tokenCustomOverrides: nextSelection.tokenCustomOverrides,
  };
}

export function applyContrastFixes({
  issues,
  mode,
  selection,
  targetContrast,
}: {
  issues: Array<ContrastCheck>;
  mode: ColorMode;
  selection: ThemeSelection;
  targetContrast: number;
}) {
  let nextSelection = selection;

  for (const issue of issues) {
    const nextTokens = generateTheme(nextSelection)[mode];
    const nextIssue = resolveCurrentContrastCheck(issue, nextTokens);

    if (nextIssue.passes) {
      continue;
    }

    const fix = findContrastFix({
      check: nextIssue,
      mode,
      selection: nextSelection,
      targetContrast,
    });

    if (!fix) {
      continue;
    }

    nextSelection = {
      ...nextSelection,
      ...applyContrastFix(nextSelection, nextIssue, mode, fix),
    };
  }

  return {
    tokenStepOverrides: nextSelection.tokenStepOverrides,
    tokenCustomOverrides: nextSelection.tokenCustomOverrides,
  };
}

function resolveCurrentContrastCheck(
  check: ContrastCheck,
  tokens: ThemeModeTokens,
): ContrastCheck {
  const background = tokens[check.backgroundToken] ?? check.background;
  const foreground = tokens[check.foregroundToken] ?? check.foreground;
  const score = getContrastScore(background, foreground) ?? check.score;

  return {
    ...check,
    background,
    foreground,
    score,
    passes: contrastPasses(score, check.target),
  };
}

export function normalizeTargetContrast(value: number | string) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_APCA_TEXT_CONTRAST;
  }

  return Math.min(
    MAX_APCA_TEXT_CONTRAST,
    Math.max(MIN_APCA_TEXT_CONTRAST, Math.round(parsedValue)),
  );
}

export function getContrastScore(background: string, foreground: string) {
  try {
    return Math.abs(new Color(foreground).contrastAPCA(new Color(background)));
  } catch {
    return null;
  }
}

function contrastPasses(score: number, targetContrast: number) {
  return score >= getMinimumPassingScore(targetContrast);
}

function getMinimumPassingScore(targetContrast: number) {
  return Math.max(0, targetContrast - CONTRAST_DISPLAY_TOLERANCE);
}

export function formatColor(value: string) {
  return isValidCssColor(value) ? colorToHex(value) : value;
}

export function getContrastUseCase(score: number): {
  description: string;
  label: string;
  type: ContrastUseCase;
} {
  if (score >= 90) {
    return {
      description: "Preferred for long-form reading and fluent body text.",
      label: "Fluent reading",
      type: "fluent",
    };
  }

  if (score >= 75) {
    return {
      description: "Works for body copy at common UI sizes and weights.",
      label: "Body text",
      type: "body",
    };
  }

  if (score >= 60) {
    return {
      description: "Good for readable UI labels and non-body content.",
      label: "UI/content text",
      type: "content",
    };
  }

  if (score >= 45) {
    return {
      description: "Best kept to large or heavy headings.",
      label: "Large text only",
      type: "large",
    };
  }

  if (score >= 30) {
    return {
      description: "Use only for placeholder, disabled, or secondary text.",
      label: "Spot readable",
      type: "spot",
    };
  }

  return {
    description: "Below the recommended floor for text.",
    label: "Non-text only",
    type: "non-text",
  };
}

function getCurrentTokenStep(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
) {
  return (
    selection.tokenStepOverrides[token]?.[mode] ??
    getSemanticTokenDefaultStep(selection, token, mode) ??
    9
  );
}

function getTokenFixCandidates({
  mode,
  selection,
  token,
}: {
  mode: ColorMode;
  selection: ThemeSelection;
  token: SemanticToken;
}): Array<TokenFixCandidate> {
  const customOverride =
    selection.tokenCustomOverrides[token]?.[mode]?.trim() || null;
  const defaultStep = getSemanticTokenDefaultStep(selection, token, mode);

  if (!customOverride && defaultStep === null) {
    return [];
  }

  return RADIX_STEPS.map((step) =>
    createTokenFixCandidate({
      fix: customOverride ? { customColor: customOverride, step } : { step },
      mode,
      selection,
      token,
    }),
  ).filter((candidate): candidate is TokenFixCandidate => Boolean(candidate));
}

function getReadableForegroundCandidates(): Array<TokenFixCandidate> {
  return [
    { color: "#000000", customColor: "#000000", step: 12 },
    { color: "#ffffff", customColor: "#ffffff", step: 1 },
  ];
}

function createTokenFixCandidate({
  fix,
  mode,
  selection,
  token,
}: {
  fix: TokenFix;
  mode: ColorMode;
  selection: ThemeSelection;
  token: SemanticToken;
}): TokenFixCandidate | null {
  const color = fix.customColor
    ? getSemanticTokenCustomStepPreviewColor(
        selection,
        token,
        mode,
        fix.customColor,
        fix.step,
      )
    : getSemanticTokenStepPreviewColor(selection, token, mode, fix.step);

  if (!color) {
    return null;
  }

  return {
    ...fix,
    color,
  };
}

type TokenFixCandidate = TokenFix & {
  color: string;
};

type ContrastFixOption = {
  background?: TokenFixCandidate;
  foreground?: TokenFixCandidate;
  score: number;
};

function pickBestPassingFix(
  options: Array<ContrastFixOption>,
  {
    backgroundStep,
    check,
    foregroundStep,
    mode,
    selection,
    targetScore,
  }: {
    backgroundStep: RadixStep;
    check: ContrastCheck;
    foregroundStep: RadixStep;
    mode: ColorMode;
    selection: ThemeSelection;
    targetScore: number;
  },
) {
  const sortedOptions = options
    .filter((option) => option.score >= targetScore)
    .sort(
      (a, b) =>
        getFixDistance(a, backgroundStep, foregroundStep) -
          getFixDistance(b, backgroundStep, foregroundStep) ||
        getCustomFixCount(a) - getCustomFixCount(b) ||
        b.score - a.score,
    );

  for (const option of sortedOptions) {
    const validatedFix = validateContrastFix({
      check,
      fix: toContrastFix(option),
      mode,
      selection,
    });

    if (validatedFix && validatedFix.score >= targetScore) {
      return validatedFix;
    }
  }

  return null;
}

function pickBestImprovingFix(
  options: Array<ContrastFixOption>,
  {
    backgroundStep,
    check,
    foregroundStep,
    mode,
    selection,
  }: {
    backgroundStep: RadixStep;
    check: ContrastCheck;
    foregroundStep: RadixStep;
    mode: ColorMode;
    selection: ThemeSelection;
  },
) {
  const sortedOptions = options
    .filter((option) => option.score > check.score + CONTRAST_DISPLAY_TOLERANCE)
    .sort(
      (a, b) =>
        b.score - a.score ||
        getFixDistance(a, backgroundStep, foregroundStep) -
          getFixDistance(b, backgroundStep, foregroundStep) ||
        getCustomFixCount(a) - getCustomFixCount(b),
    )
    .slice(0, 32);
  let bestFix: ContrastFix | null = null;

  for (const option of sortedOptions) {
    const validatedFix = validateContrastFix({
      check,
      fix: toContrastFix(option),
      mode,
      selection,
    });

    if (
      validatedFix &&
      validatedFix.score > check.score + CONTRAST_DISPLAY_TOLERANCE &&
      (!bestFix || validatedFix.score > bestFix.score)
    ) {
      bestFix = validatedFix;
    }
  }

  return bestFix;
}

function validateContrastFix({
  check,
  fix,
  mode,
  selection,
}: {
  check: ContrastCheck;
  fix: ContrastFix;
  mode: ColorMode;
  selection: ThemeSelection;
}): ContrastFix | null {
  const fixedSelection = {
    ...selection,
    ...applyContrastFix(selection, check, mode, fix),
  };
  const fixedTokens = generateTheme(fixedSelection)[mode];
  const background = fixedTokens[check.backgroundToken];
  const foreground = fixedTokens[check.foregroundToken];
  const score =
    background && foreground ? getContrastScore(background, foreground) : null;

  if (score === null) {
    return null;
  }

  return {
    ...fix,
    score,
  } satisfies ContrastFix;
}

function toContrastFix(option: ContrastFixOption): ContrastFix {
  return {
    score: option.score,
    background: option.background ? getTokenFix(option.background) : undefined,
    foreground: option.foreground ? getTokenFix(option.foreground) : undefined,
  };
}

function getTokenFix(candidate: TokenFixCandidate): TokenFix {
  return {
    customColor: candidate.customColor,
    step: candidate.step,
  };
}

function getFixDistance(
  option: { background?: TokenFix; foreground?: TokenFix },
  backgroundStep: RadixStep,
  foregroundStep: RadixStep,
) {
  const backgroundDistance = option.background
    ? Math.abs(option.background.step - backgroundStep)
    : 0;
  const foregroundDistance = option.foreground
    ? Math.abs(option.foreground.step - foregroundStep)
    : 0;

  return foregroundDistance * 1.5 + backgroundDistance;
}

function getCustomFixCount(option: ContrastFixOption) {
  return (
    Number(Boolean(option.background?.customColor)) +
    Number(Boolean(option.foreground?.customColor))
  );
}

function applyTokenFix(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
  fix: TokenFix,
) {
  const selectionWithStep = {
    ...selection,
    tokenStepOverrides: updateTokenStepOverride(
      selection,
      token,
      mode,
      fix.step,
    ),
  };

  return {
    ...selectionWithStep,
    tokenCustomOverrides:
      fix.customColor === undefined
        ? selectionWithStep.tokenCustomOverrides
        : updateTokenCustomOverride(
            selectionWithStep,
            token,
            mode,
            fix.customColor,
          ),
  };
}

function updateTokenStepOverride(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
  step: RadixStep | null,
) {
  const defaultStep = getSemanticTokenDefaultStep(selection, token, mode);
  const nextTokenOverride = {
    ...(selection.tokenStepOverrides[token] ?? {}),
  };
  const nextOverrides = { ...selection.tokenStepOverrides };

  if (step === null || step === defaultStep) {
    delete nextTokenOverride[mode];
  } else {
    nextTokenOverride[mode] = step;
  }

  if (nextTokenOverride.light || nextTokenOverride.dark) {
    nextOverrides[token] = nextTokenOverride;
  } else {
    delete nextOverrides[token];
  }

  return nextOverrides;
}

function updateTokenCustomOverride(
  selection: ThemeSelection,
  token: SemanticToken,
  mode: ColorMode,
  value: string | null,
) {
  const nextTokenOverride = {
    ...(selection.tokenCustomOverrides[token] ?? {}),
  };
  const nextOverrides = { ...selection.tokenCustomOverrides };
  const nextValue = value?.trim();

  if (nextValue) {
    nextTokenOverride[mode] = nextValue;
  } else {
    delete nextTokenOverride[mode];
  }

  if (nextTokenOverride.light || nextTokenOverride.dark) {
    nextOverrides[token] = nextTokenOverride;
  } else {
    delete nextOverrides[token];
  }

  return nextOverrides;
}
