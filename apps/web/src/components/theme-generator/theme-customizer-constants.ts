import type {
  AccentStrategy,
  ChartStrategy,
} from "@/lib/theme-generator/types";

export const CHART_STRATEGIES: Array<ChartStrategy> = [
  "monochrome",
  "neutral",
  "multicolor",
];

export const ACCENT_STRATEGIES: Array<AccentStrategy> = ["primary", "base"];

export const ACCENT_STRATEGY_META: Record<AccentStrategy, { label: string }> = {
  primary: {
    label: "Based on primary",
  },
  base: {
    label: "Based on base",
  },
};

export const CHART_STRATEGY_META: Record<ChartStrategy, { label: string }> = {
  multicolor: {
    label: "Multicolor",
  },
  monochrome: {
    label: "Based on primary",
  },
  neutral: {
    label: "Based on base",
  },
};
