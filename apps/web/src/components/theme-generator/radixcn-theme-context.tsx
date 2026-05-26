import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getClosestRadixScale,
  pick,
} from "@/components/theme-generator/theme-customizer-utils";
import {
  FALLBACK_FONT_OPTIONS,
  getMonoFontOptions,
  getSansFontOptions,
} from "@/lib/theme-generator/fonts";
import {
  DEFAULT_THEME_SELECTION,
  generateTheme,
  RADIUS_OPTIONS,
} from "@/lib/theme-generator/generator";
import {
  BASE_SCALES,
  CHART_SCALES,
  DESTRUCTIVE_SCALES,
  PRIMARY_SCALES,
  STATE_SCALE_RECOMMENDATIONS,
} from "@/lib/theme-generator/radix";
import type {
  ColorMode,
  FontSourceFont,
  RadixScaleName,
  SemanticToken,
  ThemeSelection,
} from "@/lib/theme-generator/types";

const BALANCED_CHART_SCALES: ThemeSelection["chartScales"] = [
  "indigo",
  "teal",
  "amber",
  "purple",
  "red",
];
const THEME_STORAGE_KEY = "radixcn.theme-customizer";
const THEME_STORAGE_VERSION = 1;

interface RadixCnThemeContextValue {
  fonts: ReadonlyArray<FontSourceFont>;
  selection: ThemeSelection;
  previewSelection: ThemeSelection;
  mode: ColorMode;
  generated: ReturnType<typeof generateTheme>;
  activeTokens: ReturnType<typeof generateTheme>["light"];
  setMode: (mode: ColorMode) => void;
  applyTemplate: (selection: ThemeSelection) => void;
  reset: () => void;
  randomize: () => void;
  updateSelection: (selection: Partial<ThemeSelection>) => void;
  updateChartScale: (index: number, scale: RadixScaleName) => void;
  updateCustomChartColor: (index: number, color: string) => void;
  updateCustomChartEnabled: (index: number, enabled: boolean) => void;
}

const RadixCnThemeContext = createContext<RadixCnThemeContextValue | null>(
  null,
);

export function RadixCnThemeProvider({
  children,
  fonts = FALLBACK_FONT_OPTIONS,
  initialSelection,
}: RadixCnThemeProviderProps) {
  const savedThemeState = useMemo(
    () => readSavedThemeState(initialSelection),
    [initialSelection],
  );
  const [selection, setSelection] = useState<ThemeSelection>(
    savedThemeState.selection,
  );
  const [mode, setMode] = useState<ColorMode>(savedThemeState.mode);
  const sansFontOptions = useMemo(() => getSansFontOptions(fonts), [fonts]);
  const monoFontOptions = useMemo(() => getMonoFontOptions(fonts), [fonts]);
  const previewSelection = useDeferredValue(selection);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      saveThemeState({ mode, selection });
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mode, selection]);

  useEffect(() => {
    if (initialSelection) {
      setSelection(normalizeThemeSelectionPayload(initialSelection));
    }
  }, [initialSelection]);

  const generated = useMemo(
    () => generateTheme(previewSelection, fonts),
    [fonts, previewSelection],
  );
  const activeTokens = mode === "light" ? generated.light : generated.dark;
  const applyTemplate = useCallback((nextSelection: ThemeSelection) => {
    setSelection({ ...nextSelection });
  }, []);
  const reset = useCallback(() => {
    setSelection(DEFAULT_THEME_SELECTION);
  }, []);
  const randomize = useCallback(() => {
    setSelection((currentSelection) =>
      createRandomSelection(currentSelection, sansFontOptions, monoFontOptions),
    );
  }, [monoFontOptions, sansFontOptions]);
  const updateSelection = useCallback(
    (nextSelection: Partial<ThemeSelection>) => {
      setSelection((currentSelection) => {
        const resolvedSelection = resolveDisabledCustomScales(
          currentSelection,
          nextSelection,
        );

        return {
          ...currentSelection,
          name: resolvedSelection.name ?? "Custom",
          ...resolvedSelection,
        };
      });
    },
    [],
  );
  const updateChartScale = useCallback(
    (index: number, scale: RadixScaleName) => {
      setSelection((currentSelection) => ({
        ...currentSelection,
        name: "Custom",
        chartScales: updateIndexedValue(
          currentSelection.chartScales,
          index,
          scale,
        ),
      }));
    },
    [],
  );
  const updateCustomChartColor = useCallback((index: number, color: string) => {
    setSelection((currentSelection) => ({
      ...currentSelection,
      name: "Custom",
      customChartColors: updateIndexedValue(
        currentSelection.customChartColors,
        index,
        color,
      ),
      customChartColorEnabled: updateIndexedValue(
        currentSelection.customChartColorEnabled,
        index,
        true,
      ),
    }));
  }, []);
  const updateCustomChartEnabled = useCallback(
    (index: number, enabled: boolean) => {
      setSelection((currentSelection) => ({
        ...currentSelection,
        name: "Custom",
        chartScales: enabled
          ? currentSelection.chartScales
          : updateIndexedValue(
              currentSelection.chartScales,
              index,
              getClosestRadixScale(
                currentSelection.customChartColors[index] ?? "",
                CHART_SCALES,
                currentSelection.chartScales[index] ?? "indigo",
              ),
            ),
        customChartColorEnabled: updateIndexedValue(
          currentSelection.customChartColorEnabled,
          index,
          enabled,
        ),
      }));
    },
    [],
  );

  const value = useMemo<RadixCnThemeContextValue>(
    () => ({
      fonts,
      selection,
      previewSelection,
      mode,
      generated,
      activeTokens,
      setMode,
      applyTemplate,
      reset,
      randomize,
      updateSelection,
      updateChartScale,
      updateCustomChartColor,
      updateCustomChartEnabled,
    }),
    [
      activeTokens,
      applyTemplate,
      fonts,
      generated,
      mode,
      previewSelection,
      randomize,
      reset,
      selection,
      updateChartScale,
      updateCustomChartColor,
      updateCustomChartEnabled,
      updateSelection,
    ],
  );

  return (
    <RadixCnThemeContext.Provider value={value}>
      {children}
    </RadixCnThemeContext.Provider>
  );
}

function resolveDisabledCustomScales(
  currentSelection: ThemeSelection,
  nextSelection: Partial<ThemeSelection>,
): Partial<ThemeSelection> {
  const resolvedSelection = { ...nextSelection };

  if (nextSelection.customBaseEnabled === false) {
    resolvedSelection.baseScale = getClosestRadixScale(
      nextSelection.customBaseColor ?? currentSelection.customBaseColor,
      BASE_SCALES,
      nextSelection.baseScale ?? currentSelection.baseScale,
    );
  }

  if (nextSelection.customPrimaryEnabled === false) {
    resolvedSelection.primaryScale = getClosestRadixScale(
      nextSelection.customPrimaryColor ?? currentSelection.customPrimaryColor,
      undefined,
      nextSelection.primaryScale ?? currentSelection.primaryScale,
    );
  }

  if (nextSelection.customDestructiveEnabled === false) {
    resolvedSelection.destructiveScale = getClosestRadixScale(
      nextSelection.customDestructiveColor ??
        currentSelection.customDestructiveColor,
      DESTRUCTIVE_SCALES,
      nextSelection.destructiveScale ?? currentSelection.destructiveScale,
    );
  }

  if (nextSelection.customSuccessEnabled === false) {
    resolvedSelection.successScale = getClosestRadixScale(
      nextSelection.customSuccessColor ?? currentSelection.customSuccessColor,
      STATE_SCALE_RECOMMENDATIONS.success,
      nextSelection.successScale ?? currentSelection.successScale,
    );
  }

  if (nextSelection.customWarningEnabled === false) {
    resolvedSelection.warningScale = getClosestRadixScale(
      nextSelection.customWarningColor ?? currentSelection.customWarningColor,
      STATE_SCALE_RECOMMENDATIONS.warning,
      nextSelection.warningScale ?? currentSelection.warningScale,
    );
  }

  if (nextSelection.customInfoEnabled === false) {
    resolvedSelection.infoScale = getClosestRadixScale(
      nextSelection.customInfoColor ?? currentSelection.customInfoColor,
      STATE_SCALE_RECOMMENDATIONS.info,
      nextSelection.infoScale ?? currentSelection.infoScale,
    );
  }

  if (nextSelection.customShadowEnabled === false) {
    resolvedSelection.shadowScale = getClosestRadixScale(
      nextSelection.customShadowColor ?? currentSelection.customShadowColor,
      BASE_SCALES,
      nextSelection.shadowScale ?? currentSelection.shadowScale,
    );
  }

  return clearDerivedSolidForegroundOverrides(
    currentSelection,
    resolvedSelection,
  );
}

function clearDerivedSolidForegroundOverrides(
  currentSelection: ThemeSelection,
  nextSelection: Partial<ThemeSelection>,
) {
  const tokensToClear = getChangedSolidForegroundTokens(
    currentSelection,
    nextSelection,
  );

  if (tokensToClear.length === 0) {
    return nextSelection;
  }

  return {
    ...nextSelection,
    tokenStepOverrides: clearTokenOverrides(
      nextSelection.tokenStepOverrides ?? currentSelection.tokenStepOverrides,
      tokensToClear,
    ),
    tokenCustomOverrides: clearTokenOverrides(
      nextSelection.tokenCustomOverrides ??
        currentSelection.tokenCustomOverrides,
      tokensToClear,
    ),
  };
}

function getChangedSolidForegroundTokens(
  currentSelection: ThemeSelection,
  nextSelection: Partial<ThemeSelection>,
) {
  const tokens: Array<SemanticToken> = [];

  if (
    didChange(nextSelection, currentSelection, "primaryScale") ||
    didChange(nextSelection, currentSelection, "customPrimaryEnabled") ||
    didChange(nextSelection, currentSelection, "customPrimaryColor")
  ) {
    tokens.push("primary-foreground", "sidebar-primary-foreground");
  }

  if (
    didChange(nextSelection, currentSelection, "destructiveScale") ||
    didChange(nextSelection, currentSelection, "customDestructiveEnabled") ||
    didChange(nextSelection, currentSelection, "customDestructiveColor")
  ) {
    tokens.push("destructive-foreground");
  }

  if (
    didChange(nextSelection, currentSelection, "successScale") ||
    didChange(nextSelection, currentSelection, "customSuccessEnabled") ||
    didChange(nextSelection, currentSelection, "customSuccessColor")
  ) {
    tokens.push("success-foreground");
  }

  if (
    didChange(nextSelection, currentSelection, "warningScale") ||
    didChange(nextSelection, currentSelection, "customWarningEnabled") ||
    didChange(nextSelection, currentSelection, "customWarningColor")
  ) {
    tokens.push("warning-foreground");
  }

  if (
    didChange(nextSelection, currentSelection, "infoScale") ||
    didChange(nextSelection, currentSelection, "customInfoEnabled") ||
    didChange(nextSelection, currentSelection, "customInfoColor")
  ) {
    tokens.push("info-foreground");
  }

  return tokens;
}

function didChange<TKey extends keyof ThemeSelection>(
  nextSelection: Partial<ThemeSelection>,
  currentSelection: ThemeSelection,
  key: TKey,
) {
  return key in nextSelection && nextSelection[key] !== currentSelection[key];
}

function clearTokenOverrides<TOverride>(
  overrides: Partial<Record<SemanticToken, TOverride>>,
  tokens: Array<SemanticToken>,
) {
  let changed = false;
  const nextOverrides = { ...overrides };

  for (const token of tokens) {
    if (token in nextOverrides) {
      delete nextOverrides[token];
      changed = true;
    }
  }

  return changed ? nextOverrides : overrides;
}

type RadixCnThemeProviderProps = {
  children: ReactNode;
  fonts?: ReadonlyArray<FontSourceFont>;
  initialSelection?: ThemeSelection;
};

type SavedThemeState = {
  mode: ColorMode;
  selection: ThemeSelection;
};

type ThemeStoragePayload = Partial<SavedThemeState> & {
  version?: number;
};

function readSavedThemeState(
  initialSelection?: ThemeSelection,
): SavedThemeState {
  if (initialSelection) {
    return {
      mode: "light",
      selection: normalizeThemeSelectionPayload(initialSelection),
    };
  }

  if (typeof window === "undefined") {
    return getDefaultThemeState();
  }

  try {
    const rawPayload = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (!rawPayload) {
      return getDefaultThemeState();
    }

    const payload = JSON.parse(rawPayload) as ThemeStoragePayload;

    if (payload.version !== THEME_STORAGE_VERSION) {
      return getDefaultThemeState();
    }

    return {
      mode: isColorMode(payload.mode) ? payload.mode : "light",
      selection: isThemeSelectionPayload(payload.selection)
        ? normalizeThemeSelectionPayload(payload.selection)
        : DEFAULT_THEME_SELECTION,
    };
  } catch {
    return getDefaultThemeState();
  }
}

function saveThemeState(state: SavedThemeState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        version: THEME_STORAGE_VERSION,
        ...state,
      }),
    );
  } catch {
    // Ignore storage failures so private browsing or quota limits do not break the UI.
  }
}

function getDefaultThemeState(): SavedThemeState {
  return {
    mode: "light",
    selection: DEFAULT_THEME_SELECTION,
  };
}

function isColorMode(value: unknown): value is ColorMode {
  return value === "light" || value === "dark";
}

function isThemeSelectionPayload(
  value: unknown,
): value is Partial<ThemeSelection> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeThemeSelectionPayload(
  selection: Partial<ThemeSelection> & {
    grainyBackgroundOpacity?: number;
    grainyBackgroundScope?: unknown;
  },
) {
  const {
    grainyBackgroundOpacity,
    grainyBackgroundScope: _grainyBackgroundScope,
    ...nextSelection
  } = selection;
  const legacyOpacity =
    typeof grainyBackgroundOpacity === "number"
      ? grainyBackgroundOpacity
      : undefined;

  return {
    ...DEFAULT_THEME_SELECTION,
    ...nextSelection,
    grainyBackgroundLightOpacity:
      nextSelection.grainyBackgroundLightOpacity ??
      legacyOpacity ??
      DEFAULT_THEME_SELECTION.grainyBackgroundLightOpacity,
    grainyBackgroundDarkOpacity:
      nextSelection.grainyBackgroundDarkOpacity ??
      legacyOpacity ??
      DEFAULT_THEME_SELECTION.grainyBackgroundDarkOpacity,
  };
}

function createRandomSelection(
  currentSelection: ThemeSelection,
  sansFontOptions: ReadonlyArray<FontSourceFont>,
  monoFontOptions: ReadonlyArray<FontSourceFont>,
): ThemeSelection {
  return {
    ...currentSelection,
    name: "Random",
    baseScale: pick(BASE_SCALES),
    customBaseEnabled: false,
    customBaseColor: "",
    primaryScale: pick(PRIMARY_SCALES),
    customPrimaryEnabled: false,
    customPrimaryColor: "",
    destructiveScale: pick(DESTRUCTIVE_SCALES),
    customDestructiveEnabled: false,
    customDestructiveColor: "",
    additionalStatesEnabled: false,
    successScale: pick(STATE_SCALE_RECOMMENDATIONS.success),
    customSuccessEnabled: false,
    customSuccessColor: "",
    warningScale: pick(STATE_SCALE_RECOMMENDATIONS.warning),
    customWarningEnabled: false,
    customWarningColor: "",
    infoScale: pick(STATE_SCALE_RECOMMENDATIONS.info),
    customInfoEnabled: false,
    customInfoColor: "",
    radiusScale: pick(RADIUS_OPTIONS),
    shadowScale: DEFAULT_THEME_SELECTION.shadowScale,
    customShadowEnabled: DEFAULT_THEME_SELECTION.customShadowEnabled,
    customShadowColor: DEFAULT_THEME_SELECTION.customShadowColor,
    shadowOpacity: DEFAULT_THEME_SELECTION.shadowOpacity,
    shadowBlur: DEFAULT_THEME_SELECTION.shadowBlur,
    shadowSpread: DEFAULT_THEME_SELECTION.shadowSpread,
    shadowOffsetX: DEFAULT_THEME_SELECTION.shadowOffsetX,
    shadowOffsetY: DEFAULT_THEME_SELECTION.shadowOffsetY,
    grainyBackgroundEnabled: DEFAULT_THEME_SELECTION.grainyBackgroundEnabled,
    grainyBackgroundLightOpacity:
      DEFAULT_THEME_SELECTION.grainyBackgroundLightOpacity,
    grainyBackgroundDarkOpacity:
      DEFAULT_THEME_SELECTION.grainyBackgroundDarkOpacity,
    trackingNormal: DEFAULT_THEME_SELECTION.trackingNormal,
    spacing: DEFAULT_THEME_SELECTION.spacing,
    headingFont: pick(sansFontOptions).id,
    sansFont: pick(sansFontOptions).id,
    monoFont: pick(monoFontOptions).id,
    accentStrategy: DEFAULT_THEME_SELECTION.accentStrategy,
    customAccentEnabled: DEFAULT_THEME_SELECTION.customAccentEnabled,
    customAccentColor: DEFAULT_THEME_SELECTION.customAccentColor,
    chartScales: BALANCED_CHART_SCALES,
    customChartColorEnabled: [false, false, false, false, false],
    customChartColors: ["", "", "", "", ""],
    tokenBridgeEnabled: DEFAULT_THEME_SELECTION.tokenBridgeEnabled,
    radixColorImportsEnabled: DEFAULT_THEME_SELECTION.radixColorImportsEnabled,
    tokenBridgeMappings: DEFAULT_THEME_SELECTION.tokenBridgeMappings,
    tokenBridgeFontMappings: DEFAULT_THEME_SELECTION.tokenBridgeFontMappings,
    tokenStepOverrides: DEFAULT_THEME_SELECTION.tokenStepOverrides,
    tokenCustomOverrides: DEFAULT_THEME_SELECTION.tokenCustomOverrides,
  };
}

function updateIndexedValue<TItem, TItems extends ReadonlyArray<TItem>>(
  items: TItems,
  index: number,
  value: TItem,
) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? value : item,
  ) as unknown as TItems;
}

export function useRadixCnTheme() {
  const context = useContext(RadixCnThemeContext);

  if (!context) {
    throw new Error("useRadixCnTheme must be used inside RadixCnThemeProvider");
  }

  return context;
}
