import { createFileRoute } from "@tanstack/react-router";
import { getFontCatalog } from "@/lib/theme-generator/font-catalog";
import {
  getThemePresetBySlug,
  getThemePresetSummaries,
} from "@/lib/theme-presets";
import {
  createThemeRegistryIndex,
  createThemeRegistryItem,
} from "@/lib/theme-registry";

const REGISTRY_CONTENT_TYPE = "application/vnd.shadcn.v1+json";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const Route = createFileRoute("/r/themes/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const slug = normalizeSlug(params.slug);

        if (!slug) {
          return Response.json(
            { error: "Invalid theme registry id." },
            { status: 400 },
          );
        }

        if (slug === "registry") {
          const presets = await getThemePresetSummaries();

          if (presets.length === 0) {
            return Response.json(
              { error: "Theme registry index is empty." },
              { status: 404 },
            );
          }

          return Response.json(
            createThemeRegistryIndex(presets, getRegistryHomepage(request)),
            {
              headers: {
                "Cache-Control": "public, max-age=60, s-maxage=300",
                "Content-Type": `${REGISTRY_CONTENT_TYPE}; charset=utf-8`,
                Vary: "Accept, User-Agent",
              },
            },
          );
        }

        const preset = await getThemePresetBySlug(slug);

        if (!preset) {
          return Response.json(
            { error: "Theme registry item not found." },
            { status: 404 },
          );
        }

        const fonts = await getFontCatalog();

        return Response.json(createThemeRegistryItem(preset, fonts), {
          headers: {
            "Cache-Control": "public, max-age=60, s-maxage=300",
            "Content-Type": `${REGISTRY_CONTENT_TYPE}; charset=utf-8`,
            Vary: "Accept, User-Agent",
          },
        });
      },
    },
  },
});

function normalizeSlug(value: string | undefined) {
  if (!value) {
    return null;
  }

  const slug = value.trim().toLowerCase().replace(/\.json$/, "");

  return SLUG_PATTERN.test(slug) ? slug : null;
}

function getRegistryHomepage(request: Request) {
  const url = new URL(request.url);

  return url.origin;
}
