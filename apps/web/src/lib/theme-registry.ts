import {
  createRegistryStyleCss,
  createRegistryThemeCssVars,
} from "@/lib/theme-generator/generator";
import type { FontSourceFont } from "@/lib/theme-generator/types";
import type { SharedThemePreset, ThemePresetSummary } from "@/lib/theme-presets";

export type RegistryThemeItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json";
  name: string;
  type: "registry:style";
  title?: string;
  description?: string;
  categories?: Array<string>;
  meta?: Record<string, unknown>;
  css: ReturnType<typeof createRegistryStyleCss>;
  cssVars: ReturnType<typeof createRegistryThemeCssVars>;
};

export type ThemeRegistryIndex = {
  $schema: "https://ui.shadcn.com/schema/registry.json";
  name: "radixcn-themes";
  homepage: string;
  items: Array<ThemeRegistryIndexItem>;
};

type ThemeRegistryIndexItem = {
  name: string;
  type: "registry:style";
  title: string;
  description: string;
  categories: Array<string>;
  meta: {
    url: string;
    editable: boolean;
    updatedAt: string;
  };
};

export function createThemeRegistryItem(
  preset: SharedThemePreset,
  fonts?: ReadonlyArray<FontSourceFont>,
): RegistryThemeItem {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: getRegistryItemName(preset),
    type: "registry:style",
    title: preset.name,
    description: getThemeRegistryDescription(preset.name),
    categories: ["theme", "radix-colors"],
    meta: {
      editable: preset.editable,
    },
    css: createRegistryStyleCss(preset.selection),
    cssVars: createRegistryThemeCssVars(preset.selection, fonts),
  };
}

export function createThemeRegistryIndex(
  presets: ReadonlyArray<ThemePresetSummary>,
  homepage: string,
): ThemeRegistryIndex {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "radixcn-themes",
    homepage,
    items: presets.map((preset) => ({
      name: preset.slug,
      type: "registry:style",
      title: preset.name,
      description: getThemeRegistryDescription(preset.name),
      categories: ["theme", "radix-colors"],
      meta: {
        url: new URL(`/r/themes/${preset.slug}.json`, homepage).toString(),
        editable: preset.editable,
        updatedAt: preset.updatedAt.toISOString(),
      },
    })),
  };
}

function getRegistryItemName(preset: SharedThemePreset) {
  return preset.slug;
}

function getThemeRegistryDescription(name: string) {
  return `${name} theme tokens for shadcn/ui.`;
}
