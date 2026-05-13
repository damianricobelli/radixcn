import { createFileRoute } from "@tanstack/react-router";
import { toast } from "@workspace/ui/components/sonner";
import { useEffect } from "react";
import { z } from "zod";
import { ThemeGeneratorApp } from "@/components/theme-generator/theme-generator-app";
import { pageSeo } from "@/lib/seo";
import { getThemePreset } from "@/lib/theme-presets";
import { fetchFontCatalog } from "@/lib/theme-generator/fonts";

const FONT_CATALOG_ROUTE_CACHE_TIME_MS = 24 * 60 * 60 * 1000;
const CREATE_TITLE = "Create Theme - Radixcn";
const CREATE_DESCRIPTION =
  "Generate semantic shadcn theme CSS from Radix Color scales, custom palettes, fonts, radius, spacing, and shadows.";
const createSearchSchema = z.object({
  preset: z.string().optional(),
});

export const Route = createFileRoute("/create")({
  validateSearch: createSearchSchema,
  head: () => ({
    ...pageSeo({
      title: CREATE_TITLE,
      description: CREATE_DESCRIPTION,
      path: "/create",
      imageAlt: "Radixcn theme generator workspace preview",
    }),
  }),
  loaderDeps: ({ search }) => ({ preset: search.preset }),
  loader: async ({ abortController, deps }) => {
    const [fonts, preset] = await Promise.all([
      fetchFontCatalog({ signal: abortController.signal }),
      deps.preset ? getThemePreset({ data: deps.preset }) : null,
    ]);

    return {
      fonts,
      preset,
      requestedPreset: deps.preset ?? null,
    };
  },
  staleTime: FONT_CATALOG_ROUTE_CACHE_TIME_MS,
  gcTime: FONT_CATALOG_ROUTE_CACHE_TIME_MS,
  component: CreateRoute,
});

function CreateRoute() {
  const { fonts, preset, requestedPreset } = Route.useLoaderData();

  useEffect(() => {
    if (requestedPreset && !preset) {
      toast.error("The selected preset does not exist.");
    }
  }, [preset, requestedPreset]);

  return <ThemeGeneratorApp fonts={fonts} initialPreset={preset} />;
}
