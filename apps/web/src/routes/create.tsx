import { createFileRoute } from "@tanstack/react-router";
import { ThemeGeneratorApp } from "@/components/theme-generator/theme-generator-app";
import { fetchFontCatalog } from "@/lib/theme-generator/fonts";

const FONT_CATALOG_ROUTE_CACHE_TIME_MS = 24 * 60 * 60 * 1000;
const CREATE_TITLE = "Create Theme - radixcn";
const CREATE_DESCRIPTION =
  "Generate semantic shadcn theme CSS from Radix Color scales, custom palettes, fonts, radius, spacing, and shadows.";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      {
        title: CREATE_TITLE,
      },
      {
        name: "description",
        content: CREATE_DESCRIPTION,
      },
      {
        property: "og:title",
        content: CREATE_TITLE,
      },
      {
        property: "og:description",
        content: CREATE_DESCRIPTION,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: CREATE_TITLE,
      },
      {
        name: "twitter:description",
        content: CREATE_DESCRIPTION,
      },
    ],
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
