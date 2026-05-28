import { Link, useNavigate } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  GalleryVerticalEnd,
  Lock,
  Palette,
  Pencil,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getRadixHexScale } from "@/lib/theme-generator/radix";
import type {
  RadixScaleName,
  ThemeSelection,
} from "@/lib/theme-generator/types";
import type { ThemeGalleryItem } from "@/lib/theme-presets";

type ThemeGalleryProps = {
  filter: ThemeFilter;
  query: string;
  themes: Array<ThemeGalleryItem>;
};

type ThemeFilter = "all" | "editable" | "locked";
type ThemeSearchUpdate = Partial<{ filter: ThemeFilter; q: string }>;

const themeFilters = [
  { label: "All", value: "all" },
  { label: "Editable", value: "editable" },
  { label: "Locked", value: "locked" },
] satisfies Array<{ label: string; value: ThemeFilter }>;

export function ThemeGallery({ filter, query, themes }: ThemeGalleryProps) {
  const navigate = useNavigate({ from: "/themes" });
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const filteredThemes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return themes.filter(
      (theme) =>
        matchesThemeFilter(theme, filter) &&
        matchesThemeQuery(theme, normalizedQuery),
    );
  }, [filter, query, themes]);

  function updateSearch(nextSearch: ThemeSearchUpdate) {
    void navigate({
      search: (current) => ({
        filter:
          nextSearch.filter === "all"
            ? undefined
            : (nextSearch.filter ?? current.filter),
        q:
          nextSearch.q !== undefined
            ? nextSearch.q.trim() || undefined
            : current.q,
      }),
    });
  }

  async function copyRegistryCommand(slug: string) {
    try {
      await navigator.clipboard.writeText(buildRegistryCommand(slug));
      setCopiedSlug(slug);
      toast.success("Registry command copied.");
    } catch {
      toast.error("Could not copy the registry command.");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/94 backdrop-blur supports-backdrop-filter:bg-background/82">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link
            aria-label="Radixcn home"
            className="group flex w-fit min-w-0 items-center gap-3 rounded-md outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            to="/"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary shadow-xs">
              <img
                alt=""
                className="size-7 rounded-md object-cover"
                src="/web-app-manifest-192x192.png"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold">
                Radixcn
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Shared theme gallery
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              className={buttonVariants({ variant: "outline" })}
              search={{ preset: undefined }}
              to="/create"
            >
              <Palette />
              Create theme
            </Link>
            <a
              className={buttonVariants({ variant: "outline" })}
              href="/r/themes/registry.json"
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink />
              Registry
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <GalleryVerticalEnd className="size-4" />
              Public themes
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
              Browse shared Radixcn themes.
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Open a preset in the studio or copy its shadcn registry command
              directly into your project.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <SlidersHorizontal className="size-3.5" />
              Filters
            </div>
            <div className="grid gap-3">
              <div className="relative">
                <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
                <Input
                  aria-label="Search themes"
                  className="pl-8"
                  placeholder="Search name, slug, or palette"
                  type="search"
                  value={query}
                  onChange={(event) => updateSearch({ q: event.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-1 rounded-lg border bg-muted/35 p-1">
                {themeFilters.map((themeFilter) => (
                  <Button
                    aria-pressed={filter === themeFilter.value}
                    key={themeFilter.value}
                    size="sm"
                    type="button"
                    variant={
                      filter === themeFilter.value ? "secondary" : "ghost"
                    }
                    onClick={() => updateSearch({ filter: themeFilter.value })}
                  >
                    {themeFilter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-y py-3 text-sm text-muted-foreground">
          <span>
            {filteredThemes.length} of {themes.length} themes
          </span>
          <span>Sorted by latest update</span>
        </div>

        {themes.length === 0 ? (
          <EmptyGallery />
        ) : filteredThemes.length === 0 ? (
          <NoResults onClear={() => updateSearch({ filter: "all", q: "" })} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredThemes.map((theme) => (
              <ThemeGalleryCard
                copied={copiedSlug === theme.slug}
                key={theme.slug}
                theme={theme}
                onCopyRegistryCommand={copyRegistryCommand}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ThemeGalleryCard({
  copied,
  theme,
  onCopyRegistryCommand,
}: ThemeGalleryCardProps) {
  const palette = getThemePalette(theme.selection);

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="truncate">{theme.name}</CardTitle>
        <CardDescription className="truncate">/{theme.slug}</CardDescription>
        <CardAction>
          <Badge variant={theme.editable ? "info" : "outline"}>
            {theme.editable ? (
              <>
                <Pencil />
                Editable
              </>
            ) : (
              <>
                <Lock />
                Locked
              </>
            )}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid grid-cols-4 overflow-hidden rounded-md border">
          {palette.map((color) => (
            <span
              aria-label={color.label}
              className="h-14"
              key={color.label}
              role="img"
              style={{ backgroundColor: color.value }}
              title={`${color.label}: ${color.value}`}
            />
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <ThemeMeta label="Base" value={theme.selection.baseScale} />
          <ThemeMeta label="Primary" value={theme.selection.primaryScale} />
          <ThemeMeta label="Radius" value={theme.selection.radiusScale} />
          <ThemeMeta label="Updated" value={formatThemeDate(theme.updatedAt)} />
        </dl>
      </CardContent>

      <CardFooter className="flex-col gap-2 sm:flex-row">
        <Link
          className={cn(buttonVariants(), "w-full min-w-0 sm:flex-1")}
          search={{ preset: theme.slug }}
          to="/create"
        >
          Open
          <ArrowRight />
        </Link>
        <Button
          aria-label={`Copy registry command for ${theme.name}`}
          className="w-full sm:w-auto"
          type="button"
          variant="outline"
          onClick={() => onCopyRegistryCommand(theme.slug)}
        >
          {copied ? <Check /> : <Copy />}
          Shadcn command
        </Button>
      </CardFooter>
    </Card>
  );
}

type ThemeGalleryCardProps = {
  copied: boolean;
  theme: ThemeGalleryItem;
  onCopyRegistryCommand: (slug: string) => void;
};

function matchesThemeFilter(theme: ThemeGalleryItem, filter: ThemeFilter) {
  if (filter === "editable") {
    return theme.editable;
  }

  if (filter === "locked") {
    return !theme.editable;
  }

  return true;
}

function matchesThemeQuery(theme: ThemeGalleryItem, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    theme.name,
    theme.slug,
    theme.selection.baseScale,
    theme.selection.primaryScale,
  ];

  return searchableValues.some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

function buildRegistryCommand(slug: string) {
  const registryUrl = new URL(
    `/r/themes/${slug}.json`,
    window.location.origin,
  ).toString();

  return `pnpm dlx shadcn@latest add ${registryUrl}`;
}

function ThemeMeta({ label, value }: ThemeMetaProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="truncate capitalize">{value}</dd>
    </div>
  );
}

type ThemeMetaProps = {
  label: string;
  value: string;
};

function EmptyGallery() {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
      <div className="max-w-sm">
        <GalleryVerticalEnd className="mx-auto size-9 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">No shared themes yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Save a theme from the studio and it will appear here when database
          sharing is configured.
        </p>
        <Link
          className={cn(buttonVariants(), "mt-5")}
          search={{ preset: undefined }}
          to="/create"
        >
          Create theme
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}

function NoResults({ onClear }: NoResultsProps) {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
      <div className="max-w-sm">
        <Search className="mx-auto size-9 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">No themes match</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Try a different name, slug, or palette.
        </p>
        <Button
          className="mt-5"
          type="button"
          variant="outline"
          onClick={onClear}
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}

type NoResultsProps = {
  onClear: () => void;
};

function getThemePalette(selection: ThemeSelection) {
  return [
    {
      label: "Base",
      value: getScaleColor(
        selection.baseScale,
        selection.customBaseEnabled,
        selection.customBaseColor,
      ),
    },
    {
      label: "Primary",
      value: getScaleColor(
        selection.primaryScale,
        selection.customPrimaryEnabled,
        selection.customPrimaryColor,
      ),
    },
    {
      label: "Accent",
      value: selection.customAccentEnabled
        ? selection.customAccentColor
        : getRadixHexScale(selection.primaryScale).light[5],
    },
    {
      label: "Destructive",
      value: getScaleColor(
        selection.destructiveScale,
        selection.customDestructiveEnabled,
        selection.customDestructiveColor,
      ),
    },
  ];
}

function getScaleColor(
  scale: RadixScaleName,
  customEnabled: boolean,
  customColor: string,
) {
  return customEnabled && customColor
    ? customColor
    : getRadixHexScale(scale).light[9];
}

function formatThemeDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
