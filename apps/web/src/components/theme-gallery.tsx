import { Link, useNavigate } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { RetroGrid } from "@workspace/ui/components/retro-grid";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpDown,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  GalleryVerticalEnd,
  Lock,
  Pencil,
  Search,
  Square,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getRadixHexScale } from "@/lib/theme-generator/radix";
import type {
  RadiusScale,
  RadixScaleName,
  ThemeSelection,
} from "@/lib/theme-generator/types";
import type { ThemeGalleryItem } from "@/lib/theme-presets";

type ThemeGalleryProps = {
  color: ColorFilter;
  filter: ThemeFilter;
  query: string;
  radius: RadiusFilter;
  sort: ThemeSort;
  themes: Array<ThemeGalleryItem>;
};

type ThemeFilter = "all" | "editable" | "locked";
type ThemeSort = "latest" | "oldest" | "name";
type RadiusFilter = "all" | RadiusScale;
type ColorFamilyKey =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "neutral";
type ColorFilter = "all" | ColorFamilyKey;
type ThemeSearchUpdate = Partial<{
  color: ColorFilter;
  filter: ThemeFilter;
  q: string;
  radius: RadiusFilter;
  sort: ThemeSort;
}>;
type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

const themeFilters = [
  { label: "All", value: "all" },
  { label: "Editable", value: "editable" },
  { label: "Locked", value: "locked" },
] satisfies Array<FilterOption<ThemeFilter>>;

const themeSorts = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name (A-Z)", value: "name" },
] satisfies Array<FilterOption<ThemeSort>>;

const radiusOptions = [
  { label: "Any", value: "all" },
  { label: "None", value: "none" },
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Default", value: "default" },
  { label: "Large", value: "large" },
  { label: "Extra large", value: "extra-large" },
] satisfies Array<FilterOption<RadiusFilter>>;

const colorFamilies = [
  { key: "red", label: "Red", swatch: "red" },
  { key: "orange", label: "Orange", swatch: "orange" },
  { key: "yellow", label: "Yellow", swatch: "yellow" },
  { key: "green", label: "Green", swatch: "green" },
  { key: "blue", label: "Blue", swatch: "blue" },
  { key: "purple", label: "Purple", swatch: "purple" },
  { key: "pink", label: "Pink", swatch: "pink" },
  { key: "neutral", label: "Neutral", swatch: "slate" },
] satisfies Array<{
  key: ColorFamilyKey;
  label: string;
  swatch: RadixScaleName;
}>;

const scaleFamilyMap: Record<RadixScaleName, ColorFamilyKey> = {
  tomato: "red",
  red: "red",
  ruby: "red",
  crimson: "red",
  orange: "orange",
  brown: "orange",
  bronze: "orange",
  amber: "yellow",
  yellow: "yellow",
  gold: "yellow",
  grass: "green",
  green: "green",
  jade: "green",
  teal: "green",
  mint: "green",
  lime: "green",
  blue: "blue",
  indigo: "blue",
  sky: "blue",
  cyan: "blue",
  purple: "purple",
  violet: "purple",
  iris: "purple",
  pink: "pink",
  plum: "pink",
  gray: "neutral",
  mauve: "neutral",
  slate: "neutral",
  sage: "neutral",
  olive: "neutral",
  sand: "neutral",
};

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const defaultSearch = {
  color: "all",
  filter: "all",
  radius: "all",
  sort: "latest",
} satisfies Required<Omit<ThemeSearchUpdate, "q">>;

export function ThemeGallery({
  color,
  filter,
  query,
  radius,
  sort,
  themes,
}: ThemeGalleryProps) {
  const navigate = useNavigate({ from: "/themes" });
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // The search input is driven by local state and debounced into the URL so
  // typing never blocks on navigation or shifts the scroll position.
  const [searchValue, setSearchValue] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Themes narrowed by everything except the color family - used both to
  // power the color counts and as the base for the active color filter.
  const baseThemes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return themes.filter(
      (theme) =>
        matchesThemeFilter(theme, filter) &&
        matchesRadius(theme, radius) &&
        matchesThemeQuery(theme, normalizedQuery),
    );
  }, [filter, query, radius, themes]);

  const colorCounts = useMemo(() => {
    const counts = new Map<ColorFamilyKey, number>();

    for (const theme of baseThemes) {
      const family = getColorFamily(theme.selection.primaryScale);
      counts.set(family, (counts.get(family) ?? 0) + 1);
    }

    return counts;
  }, [baseThemes]);

  const filteredThemes = useMemo(() => {
    const result = baseThemes.filter((theme) =>
      matchesColorFamily(theme, color),
    );

    return sortThemes(result, sort);
  }, [baseThemes, color, sort]);

  // With no single color selected the grid is grouped into color categories so
  // the gallery reads like a curated collection rather than a flat list.
  const sections = useMemo(() => {
    if (color !== "all") {
      return [];
    }

    return colorFamilies
      .map((family) => ({
        family,
        themes: filteredThemes.filter(
          (theme) =>
            getColorFamily(theme.selection.primaryScale) === family.key,
        ),
      }))
      .filter((section) => section.themes.length > 0);
  }, [color, filteredThemes]);

  function updateSearch(nextSearch: ThemeSearchUpdate) {
    void navigate({
      // Keep the reader where they are while filtering.
      replace: true,
      resetScroll: false,
      search: (current) => ({
        color: getNextSearchValue(
          nextSearch.color,
          current.color,
          defaultSearch.color,
        ),
        filter: getNextSearchValue(
          nextSearch.filter,
          current.filter,
          defaultSearch.filter,
        ),
        radius: getNextSearchValue(
          nextSearch.radius,
          current.radius,
          defaultSearch.radius,
        ),
        q:
          nextSearch.q !== undefined
            ? nextSearch.q.trim() || undefined
            : current.q,
        sort: getNextSearchValue(
          nextSearch.sort,
          current.sort,
          defaultSearch.sort,
        ),
      }),
    });
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateSearch({ q: value });
    }, 200);
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

  function clearFilters() {
    setSearchValue("");
    updateSearch({ ...defaultSearch, q: "" });
  }

  const activeFilters = getActiveFilters({
    color,
    filter,
    query,
    radius,
    sort,
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate overflow-hidden">
        <ThemesHeader />
        <RetroGrid
          aria-hidden="true"
          angle={12}
          cellSize={128}
          className="absolute inset-0 -z-10"
          darkLineColor="var(--border)"
          lightLineColor="var(--border)"
          opacity={0.8}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_25%,color-mix(in_oklab,var(--background)_70%,transparent)_0,transparent_45%),linear-gradient(to_bottom,transparent_45%,var(--background)_96%)]"
        />
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-24">
          <motion.div
            animate="visible"
            className="mx-auto flex max-w-4xl flex-col items-center text-center"
            initial="hidden"
            transition={{ staggerChildren: 0.08 }}
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline">
                <GalleryVerticalEnd aria-hidden="true" />
                Community theme gallery
              </Badge>
            </motion.div>
            <motion.h1
              className="mt-6 text-4xl font-semibold tracking-normal text-balance sm:text-5xl lg:text-6xl"
              variants={fadeIn}
            >
              Browse, preview, and share community themes.
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
              variants={fadeIn}
            >
              Discover production-ready themes from the community, preview each
              palette in a real interface, then open one in the studio, or
              create and share your own.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
              variants={fadeIn}
            >
              <Link
                className={cn(buttonVariants({ size: "lg" }), "w-fit")}
                search={{ preset: undefined }}
                to="/create"
              >
                Create a theme
                <ArrowRight aria-hidden="true" />
              </Link>
              <a
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-fit bg-background/80 backdrop-blur",
                )}
                href="#gallery"
              >
                Browse the gallery
                <ArrowDown aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="scroll-mt-4 border-t bg-muted/20" id="gallery">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:px-8">
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-lg border bg-card p-4 shadow-xs lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
              <SidebarFilters
                color={color}
                colorCounts={colorCounts}
                filter={filter}
                radius={radius}
                searchValue={searchValue}
                sort={sort}
                totalCount={baseThemes.length}
                onSearchChange={handleSearchChange}
                onUpdate={updateSearch}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {filteredThemes.length}
                </span>{" "}
                of {themes.length} themes
              </span>

              {activeFilters.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeFilters.map((active) => (
                    <button
                      className="inline-flex items-center gap-1 rounded-full border bg-card py-1 pr-1.5 pl-2.5 text-xs font-medium transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                      key={active.key}
                      type="button"
                      onClick={() => updateSearch(active.clear)}
                    >
                      {active.label}
                      <X className="size-3 text-muted-foreground" />
                    </button>
                  ))}
                  <Button
                    className="h-auto px-1.5 py-1 text-xs"
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={clearFilters}
                  >
                    Clear all
                  </Button>
                </div>
              ) : null}
            </div>

            {themes.length === 0 ? (
              <EmptyGallery />
            ) : filteredThemes.length === 0 ? (
              <NoResults onClear={clearFilters} />
            ) : color === "all" ? (
              <div className="grid gap-16">
                {sections.map((section) => (
                  <section
                    aria-label={`${section.family.label} themes`}
                    key={section.family.key}
                  >
                    <div className="mb-5 flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="size-2.5 rounded-full ring-1 ring-black/10"
                        style={{
                          backgroundColor: getRadixHexScale(
                            section.family.swatch,
                          ).light[9],
                        }}
                      />
                      <h3 className="text-base font-semibold tracking-tight">
                        {section.family.label}
                      </h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                        {section.themes.length}
                      </span>
                    </div>
                    <ThemeGrid
                      copiedSlug={copiedSlug}
                      themes={section.themes}
                      onCopyRegistryCommand={copyRegistryCommand}
                    />
                  </section>
                ))}
              </div>
            ) : (
              <ThemeGrid
                copiedSlug={copiedSlug}
                themes={filteredThemes}
                onCopyRegistryCommand={copyRegistryCommand}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function ThemesHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center rounded-lg border border-border/80 bg-background/82 p-2 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/70">
        <Link
          aria-label="Radixcn home"
          className="group inline-flex min-w-0 items-center gap-3 rounded-md px-1 outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          to="/"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary shadow-xs">
            <img
              alt=""
              className="size-8 rounded-md object-cover"
              src="/web-app-manifest-192x192.png"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-normal text-foreground sm:text-lg">
              Radixcn
            </span>
            <span className="hidden truncate text-xs text-muted-foreground sm:block">
              Community theme gallery
            </span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <a
            className={buttonVariants({ variant: "ghost" })}
            href="/r/themes/registry.json"
            rel="noreferrer"
            target="_blank"
          >
            Registry
            <ExternalLink aria-hidden="true" />
          </a>
          <Link
            className={buttonVariants({ variant: "default" })}
            search={{ preset: undefined }}
            to="/create"
          >
            Create
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SidebarFilters({
  color,
  colorCounts,
  filter,
  radius,
  searchValue,
  sort,
  totalCount,
  onSearchChange,
  onUpdate,
}: SidebarFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
        <Input
          aria-label="Search themes"
          className="bg-background pl-8"
          placeholder="Search themes..."
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Color
        </span>
        <div className="grid gap-0.5">
          <ColorRow
            active={color === "all"}
            count={totalCount}
            label="All colors"
            onClick={() => onUpdate({ color: "all" })}
          />
          {colorFamilies.map((family) => (
            <ColorRow
              active={color === family.key}
              count={colorCounts.get(family.key) ?? 0}
              key={family.key}
              label={family.label}
              swatch={getRadixHexScale(family.swatch).light[9]}
              onClick={() => onUpdate({ color: family.key })}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2.5">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Filters
        </span>
        <FilterDropdown
          icon={ArrowUpDown}
          label="Sort"
          options={themeSorts}
          value={sort}
          onChange={(value) => onUpdate({ sort: value })}
        />
        <FilterDropdown
          icon={Lock}
          label="Type"
          options={themeFilters}
          value={filter}
          onChange={(value) => onUpdate({ filter: value })}
        />
        <FilterDropdown
          icon={Square}
          label="Radius"
          options={radiusOptions}
          value={radius}
          onChange={(value) => onUpdate({ radius: value })}
        />
      </div>
    </div>
  );
}

function ColorRow({ active, count, label, swatch, onClick }: ColorRowProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
      type="button"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-2">
        {swatch ? (
          <span
            aria-hidden
            className="size-3 shrink-0 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: swatch }}
          />
        ) : (
          <span
            aria-hidden
            className="grid size-3 shrink-0 grid-cols-2 overflow-hidden rounded-full ring-1 ring-black/10"
          >
            <span className="bg-red-400" />
            <span className="bg-amber-400" />
            <span className="bg-green-400" />
            <span className="bg-blue-500" />
          </span>
        )}
        <span className="truncate">{label}</span>
      </span>
      <span className="text-xs tabular-nums text-muted-foreground">
        {count}
      </span>
    </button>
  );
}

type ColorRowProps = {
  active: boolean;
  count: number;
  label: string;
  swatch?: string;
  onClick: () => void;
};

type SidebarFiltersProps = {
  color: ColorFilter;
  colorCounts: Map<ColorFamilyKey, number>;
  filter: ThemeFilter;
  radius: RadiusFilter;
  searchValue: string;
  sort: ThemeSort;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onUpdate: (next: ThemeSearchUpdate) => void;
};

function FilterDropdown<TValue extends string>({
  icon: Icon,
  label,
  options,
  value,
  onChange,
}: FilterDropdownProps<TValue>) {
  const current = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label}: ${current?.label ?? "All"}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "w-full justify-between",
        )}
      >
        <span className="flex shrink-0 items-center gap-1.5">
          <Icon className="text-muted-foreground" />
          <span className="text-muted-foreground">{label}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-medium">
            {current?.label ?? "All"}
          </span>
          <ChevronDown className="size-3.5 shrink-0 opacity-60" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            const nextOption = options.find((option) => option.value === next);

            if (nextOption) {
              onChange(nextOption.value);
            }
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type FilterDropdownProps<TValue extends string> = {
  icon: LucideIcon;
  label: string;
  options: ReadonlyArray<FilterOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
};

function ThemeGrid({
  copiedSlug,
  themes,
  onCopyRegistryCommand,
}: ThemeGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {themes.map((theme) => (
        <ThemeGalleryCard
          copied={copiedSlug === theme.slug}
          key={theme.slug}
          theme={theme}
          onCopyRegistryCommand={onCopyRegistryCommand}
        />
      ))}
    </div>
  );
}

type ThemeGridProps = {
  copiedSlug: string | null;
  themes: Array<ThemeGalleryItem>;
  onCopyRegistryCommand: (slug: string) => void;
};

function ThemeGalleryCard({
  copied,
  theme,
  onCopyRegistryCommand,
}: ThemeGalleryCardProps) {
  const base = getRadixHexScale(theme.selection.baseScale).light;
  const surface = base[2];
  const foreground = base[12];
  const palette = getCardPalette(theme.selection);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg">
      <Link
        className="relative flex aspect-video flex-col justify-between overflow-hidden p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        search={{ preset: theme.slug }}
        style={{ backgroundColor: surface }}
        to="/create"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-2 py-0.5 text-[11px] font-medium text-neutral-700 shadow-xs backdrop-blur">
            {theme.editable ? (
              <>
                <Pencil className="size-3" />
                Editable
              </>
            ) : (
              <>
                <Lock className="size-3" />
                Locked
              </>
            )}
          </span>

          <div className="flex items-center gap-1">
            {palette.map((swatch) => (
              <span
                aria-label={`${swatch.name}: ${swatch.value}`}
                className="h-9 w-2 rounded-full ring-1 ring-black/10"
                key={swatch.name}
                role="img"
                style={{ backgroundColor: swatch.value }}
                title={`${swatch.name}: ${swatch.value}`}
              />
            ))}
          </div>
        </div>

        <h3
          className="truncate text-2xl font-semibold tracking-tight"
          style={{ color: foreground }}
        >
          {theme.name}
        </h3>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t px-4 py-2.5">
        <p className="truncate font-mono text-xs text-muted-foreground">
          /{theme.slug}
        </p>
        <Button
          aria-label={`Copy registry command for ${theme.name}`}
          className="-mr-1.5 size-8 shrink-0 text-muted-foreground hover:text-foreground"
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => onCopyRegistryCommand(theme.slug)}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
    </div>
  );
}

type ThemeGalleryCardProps = {
  copied: boolean;
  theme: ThemeGalleryItem;
  onCopyRegistryCommand: (slug: string) => void;
};

function getColorFamily(scale: RadixScaleName): ColorFamilyKey {
  return scaleFamilyMap[scale] ?? "neutral";
}

function matchesColorFamily(theme: ThemeGalleryItem, color: ColorFilter) {
  if (color === "all") {
    return true;
  }

  return getColorFamily(theme.selection.primaryScale) === color;
}

function matchesRadius(theme: ThemeGalleryItem, radius: RadiusFilter) {
  if (radius === "all") {
    return true;
  }

  return theme.selection.radiusScale === radius;
}

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

function sortThemes(themes: Array<ThemeGalleryItem>, sort: ThemeSort) {
  const sorted = [...themes];

  if (sort === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }

  const direction = sort === "latest" ? -1 : 1;

  sorted.sort(
    (a, b) =>
      direction *
      (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()),
  );

  return sorted;
}

const radiusLabels: Record<RadiusScale, string> = {
  default: "Default radius",
  none: "No radius",
  small: "Small radius",
  medium: "Medium radius",
  large: "Large radius",
  "extra-large": "XL radius",
};

function getActiveFilters({
  color,
  filter,
  query,
  radius,
  sort,
}: {
  color: ColorFilter;
  filter: ThemeFilter;
  query: string;
  radius: RadiusFilter;
  sort: ThemeSort;
}) {
  const active: Array<{
    key: string;
    label: string;
    clear: ThemeSearchUpdate;
  }> = [];

  if (query.trim()) {
    active.push({
      key: "query",
      label: `"${query.trim()}"`,
      clear: { q: "" },
    });
  }

  if (color !== "all") {
    const family = colorFamilies.find((item) => item.key === color);
    active.push({
      key: "color",
      label: family?.label ?? color,
      clear: { color: "all" },
    });
  }

  if (radius !== "all") {
    active.push({
      key: "radius",
      label: radiusLabels[radius],
      clear: { radius: "all" },
    });
  }

  if (filter !== "all") {
    active.push({
      key: "filter",
      label: filter === "editable" ? "Editable" : "Locked",
      clear: { filter: "all" },
    });
  }

  if (sort !== "latest") {
    active.push({
      key: "sort",
      label: sort === "oldest" ? "Oldest first" : "Name A-Z",
      clear: { sort: "latest" },
    });
  }

  return active;
}

function getNextSearchValue<TValue extends string>(
  nextValue: TValue | undefined,
  currentValue: TValue | undefined,
  defaultValue: TValue,
) {
  if (nextValue === defaultValue) {
    return undefined;
  }

  return nextValue ?? currentValue;
}

function buildRegistryCommand(slug: string) {
  const registryUrl = new URL(
    `/r/themes/${slug}.json`,
    window.location.origin,
  ).toString();

  return `pnpm dlx shadcn@latest add ${registryUrl}`;
}

function EmptyGallery() {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
      <div className="max-w-sm">
        <GalleryVerticalEnd className="mx-auto size-9 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No shared themes yet</h3>
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
        <h3 className="mt-4 text-lg font-semibold">No themes match</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try a different color, name, slug, or palette.
        </p>
        <Button
          className="mt-5"
          type="button"
          variant="outline"
          onClick={onClear}
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
}

type NoResultsProps = {
  onClear: () => void;
};

function getCardPalette(selection: ThemeSelection) {
  const base = getRadixHexScale(selection.baseScale).light;
  const primaryScale = getRadixHexScale(selection.primaryScale).light;
  const primary =
    selection.customPrimaryEnabled && selection.customPrimaryColor
      ? selection.customPrimaryColor
      : primaryScale[9];
  const accent =
    selection.customAccentEnabled && selection.customAccentColor
      ? selection.customAccentColor
      : primaryScale[5];
  const destructive =
    selection.customDestructiveEnabled && selection.customDestructiveColor
      ? selection.customDestructiveColor
      : getRadixHexScale(selection.destructiveScale).light[9];

  return [
    { name: "Primary", value: primary },
    { name: "Accent", value: accent },
    { name: "Destructive", value: destructive },
    { name: "Foreground", value: base[12] },
    { name: "Border", value: base[6] },
    { name: "Background", value: base[2] },
  ];
}
