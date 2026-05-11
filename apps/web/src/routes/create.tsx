import { createFileRoute } from "@tanstack/react-router";
import { ThemeGeneratorApp } from "@/components/theme-generator/theme-generator-app";
import { fetchFontCatalog } from "@/lib/theme-generator/fonts";

const FONT_CATALOG_ROUTE_CACHE_TIME_MS = 24 * 60 * 60 * 1000;

export const Route = createFileRoute("/create")({
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
