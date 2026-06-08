import {
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@workspace/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useMemo, useRef, useState } from "react";
import {
  SIDEBAR_DROPDOWN_CONTENT_CLASSNAME,
  SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
  SidebarDropdown,
  SidebarDropdownEmpty,
  SidebarDropdownSearch,
} from "@/components/theme-generator/theme-customizer-section";
import {
  FONT_CATEGORY_ORDER,
  getFontCssValue,
  getFontLabel,
  getMonoFontOptions,
  getFontPreviewCss,
} from "@/lib/theme-generator/fonts";
import type {
  FontCategory,
  FontSourceFont,
  FontSourceFontName,
} from "@/lib/theme-generator/types";

type FontDropdownProps = {
  fonts: ReadonlyArray<FontSourceFont>;
  headingFont: FontSourceFontName;
  sansFont: FontSourceFontName;
  monoFont: FontSourceFontName;
  onHeadingFontChange: (value: FontSourceFontName) => void;
  onSansFontChange: (value: FontSourceFontName) => void;
  onMonoFontChange: (value: FontSourceFontName) => void;
};

export function FontDropdown({
  fonts,
  headingFont,
  sansFont,
  monoFont,
  onHeadingFontChange,
  onSansFontChange,
  onMonoFontChange,
}: FontDropdownProps) {
  const monoFontOptions = useMemo(() => getMonoFontOptions(fonts), [fonts]);

  return (
    <>
      <FontPickerDropdown
        label="Heading"
        placeholder="Search"
        value={headingFont}
        selectedLabel={getFontLabel(headingFont, fonts)}
        options={fonts}
        onChange={onHeadingFontChange}
      />
      <FontPickerDropdown
        label="Sans"
        placeholder="Search"
        value={sansFont}
        selectedLabel={getFontLabel(sansFont, fonts)}
        options={fonts}
        onChange={onSansFontChange}
      />
      <FontPickerDropdown
        label="Mono"
        placeholder="Search"
        value={monoFont}
        selectedLabel={getFontLabel(monoFont, fonts)}
        options={monoFontOptions}
        onChange={onMonoFontChange}
      />
    </>
  );
}

type FontPickerDropdownProps = {
  label: string;
  placeholder: string;
  value: FontSourceFontName;
  selectedLabel: string;
  options: ReadonlyArray<FontSourceFont>;
  onChange: (value: FontSourceFontName) => void;
};

export function FontPickerDropdown({
  label,
  placeholder,
  value,
  selectedLabel,
  options,
  onChange,
}: FontPickerDropdownProps) {
  return (
    <SidebarDropdown
      label={label}
      value={selectedLabel}
      contentClassName={`${SIDEBAR_DROPDOWN_CONTENT_CLASSNAME} w-80`}
    >
      <FontRadioGroup
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={onChange}
      />
    </SidebarDropdown>
  );
}

const FONT_CATEGORY_FILTER_LABELS = {
  "sans-serif": "Sans Serif Fonts",
  serif: "Serif Fonts",
  monospace: "Monospace Fonts",
  display: "Display Fonts",
  handwriting: "Handwriting Fonts",
  other: "Other Fonts",
} as const satisfies Record<FontCategory, string>;

type FontRadioGroupProps = {
  placeholder: string;
  value: FontSourceFontName;
  options: ReadonlyArray<FontSourceFont>;
  onChange: (value: FontSourceFontName) => void;
};

function FontRadioGroup({
  placeholder,
  value,
  options,
  onChange,
}: FontRadioGroupProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FontCategory>(() =>
    getInitialFontCategory(options),
  );
  const listRef = useRef<HTMLDivElement>(null);
  const categoryOptions = useMemo(
    () => getAvailableFontCategories(options),
    [options],
  );
  const activeCategory = categoryOptions.includes(category)
    ? category
    : getInitialFontCategory(options);

  function resetFontListScroll() {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const categoryMatches = options.filter(
      (font) => font.category === activeCategory,
    );
    const matches = normalizedQuery
      ? categoryMatches.filter(
          (font) =>
            font.family.toLowerCase().includes(normalizedQuery) ||
            font.id.toLowerCase().includes(normalizedQuery),
        )
      : categoryMatches;

    return matches;
  }, [activeCategory, options, query]);
  const previewCss = useMemo(
    () => getFontPreviewCss(filteredOptions),
    [filteredOptions],
  );

  return (
    <DropdownMenuGroup className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {previewCss ? <style>{previewCss}</style> : null}
      <SidebarDropdownSearch
        ariaLabel={placeholder}
        placeholder={placeholder}
        value={query}
        onChange={(nextQuery) => {
          setQuery(nextQuery);
          resetFontListScroll();
        }}
      >
        <Select
          value={activeCategory}
          onValueChange={(nextValue) => {
            setCategory(nextValue as FontCategory);
            resetFontListScroll();
          }}
        >
          <SelectTrigger
            className="mb-2 h-8 w-full"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <SelectValue>
              {FONT_CATEGORY_FILTER_LABELS[activeCategory]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" className="min-w-48">
            {categoryOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {FONT_CATEGORY_FILTER_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarDropdownSearch>
      <DropdownMenuRadioGroup
        className="flex min-h-0 flex-1 flex-col"
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as FontSourceFontName)}
      >
        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((font) => (
              <DropdownMenuRadioItem
                className={SIDEBAR_DROPDOWN_ITEM_CLASSNAME}
                key={font.id}
                value={font.id}
              >
                <span
                  className="min-w-0 flex-1 truncate text-base leading-5"
                  style={{ fontFamily: getFontCssValue(font.id, [font]) }}
                >
                  {font.family}
                </span>
              </DropdownMenuRadioItem>
            ))
          ) : (
            <SidebarDropdownEmpty>No fonts found</SidebarDropdownEmpty>
          )}
        </div>
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  );
}

function getInitialFontCategory(options: ReadonlyArray<FontSourceFont>) {
  return getAvailableFontCategories(options)[0] ?? "sans-serif";
}

function getAvailableFontCategories(options: ReadonlyArray<FontSourceFont>) {
  return FONT_CATEGORY_ORDER.filter((fontCategory) =>
    options.some((font) => font.category === fontCategory),
  );
}
