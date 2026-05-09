import { createFileRoute } from "@tanstack/react-router";
import { ThemeGeneratorApp } from "@/components/theme-generator/theme-generator-app";
import { fetchFontCatalog } from "@/lib/theme-generator/fonts";

export const Route = createFileRoute("/")({
  loader: () => fetchFontCatalog(),
  component: IndexRoute,
});

function IndexRoute() {
  const fonts = Route.useLoaderData();

  return <ThemeGeneratorApp fonts={fonts} />;
}
