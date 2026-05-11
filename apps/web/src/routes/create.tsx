import { createFileRoute } from "@tanstack/react-router";
import { ThemeGeneratorApp } from "@/components/theme-generator/theme-generator-app";
import { pageSeo } from "@/lib/seo";
import { fetchFontCatalog } from "@/lib/theme-generator/fonts";

const FONT_CATALOG_ROUTE_CACHE_TIME_MS = 24 * 60 * 60 * 1000;
const CREATE_TITLE = "Create Theme - Radixcn";
const CREATE_DESCRIPTION =
  "Generate semantic shadcn theme CSS from Radix Color scales, custom palettes, fonts, radius, spacing, and shadows.";

export const Route = createFileRoute("/create")({
  head: () => ({
    ...pageSeo({
      title: CREATE_TITLE,
      description: CREATE_DESCRIPTION,
      path: "/create",
      imageAlt: "Radixcn theme generator workspace preview",
    }),
  }),
  loader: ({ abortController }) =>
    fetchFontCatalog({ signal: abortController.signal }),
  staleTime: FONT_CATALOG_ROUTE_CACHE_TIME_MS,
  gcTime: FONT_CATALOG_ROUTE_CACHE_TIME_MS,
  component: CreateRoute,
});

function CreateRoute() {
  const fonts = Route.useLoaderData();

  return <ThemeGeneratorApp fonts={fonts} />;
}
