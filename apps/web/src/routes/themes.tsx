import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ThemeGallery } from "@/components/theme-gallery";
import { pageSeo } from "@/lib/seo";
import { getThemeGalleryItems } from "@/lib/theme-presets";

const THEMES_TITLE = "Shared Themes - Radixcn";
const THEMES_DESCRIPTION =
  "Browse shared Radixcn presets and copy shadcn registry commands for generated themes.";
const themeSearchSchema = z.object({
  q: z.string().optional(),
  filter: z.enum(["all", "editable", "locked"]).optional(),
});

export const Route = createFileRoute("/themes")({
  validateSearch: themeSearchSchema,
  head: () => ({
    ...pageSeo({
      title: THEMES_TITLE,
      description: THEMES_DESCRIPTION,
      path: "/themes",
      imageAlt: "Radixcn shared theme gallery",
    }),
  }),
  loader: async () => {
    const themes = await getThemeGalleryItems();

    return { themes };
  },
  component: ThemesRoute,
});

function ThemesRoute() {
  const { themes } = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <ThemeGallery
      filter={search.filter ?? "all"}
      query={search.q ?? ""}
      themes={themes}
    />
  );
}
