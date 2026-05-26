import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { Palette } from "lucide-react";
import { useState } from "react";
import { useRadixCnTheme } from "@/components/theme-generator/radixcn-theme-context";
import {
  SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
  SidebarDropdown,
  SidebarDropdownEmpty,
  SidebarDropdownSearch,
} from "@/components/theme-generator/theme-customizer-section";
import { getScaleHex } from "@/components/theme-generator/theme-customizer-utils";
import type {
  ThemeTemplate,
  ThemeTemplateGroup,
} from "@/components/theme-generator/theme-templates";
import { THEME_TEMPLATE_GROUPS } from "@/components/theme-generator/theme-templates";
import type { ThemeSelection } from "@/lib/theme-generator/types";

export function ThemeTemplateDropdown() {
  const [query, setQuery] = useState("");
  const { applyTemplate, selection } = useRadixCnTheme();
  const activeName = selection.name;
  const mainSwatches = getMainSwatches(selection);
  const filteredGroups = filterTemplateGroups(query);
  const applyContrastCheckedTemplate = async (
    templateSelection: ThemeSelection,
  ) => {
    const { ensureTemplateContrast } =
      await import(
        "@/components/theme-generator/contrast-checker/theme-template-contrast"
      );

    applyTemplate(ensureTemplateContrast(templateSelection));
  };

  return (
    <SidebarDropdown
      ariaLabel={`Open preset menu. Current preset: ${activeName}.`}
      label="Preset"
      value={activeName}
      swatches={mainSwatches}
      alignOffset={6}
      contentClassName="flex max-h-[min(34rem,var(--available-height))] w-80 flex-col overflow-hidden border border-border p-0 ring-0"
    >
      <SidebarDropdownSearch
        ariaLabel="Search presets"
        placeholder="Search presets..."
        value={query}
        onChange={setQuery}
      />

      <div className="min-h-0 overflow-y-auto p-1">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, groupIndex) => (
            <DropdownMenuGroup key={group.name}>
              {groupIndex > 0 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuLabel>{group.name}</DropdownMenuLabel>
              {group.templates.map((template) => (
                <ThemeTemplateItem
                  key={template.id}
                  template={template}
                  onApply={() =>
                    void applyContrastCheckedTemplate(template.selection)
                  }
                />
              ))}
            </DropdownMenuGroup>
          ))
        ) : (
          <SidebarDropdownEmpty>No presets found</SidebarDropdownEmpty>
        )}
      </div>
    </SidebarDropdown>
  );
}

function ThemeTemplateItem({ template, onApply }: ThemeTemplateItemProps) {
  return (
    <DropdownMenuItem
      className={`${SIDEBAR_DROPDOWN_ITEM_CLASSNAME} items-start gap-3`}
      onClick={onApply}
    >
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-accent">
        <Palette className="size-3.5 text-sidebar-foreground/70" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-medium">{template.name}</span>
          <span className="flex shrink-0 -space-x-1">
            {getMainSwatches(template.selection).map((color, index) => (
              <span
                key={`${template.id}-${color}-${index}`}
                className="size-3.5 rounded-full border border-sidebar ring-1 ring-sidebar-border"
                style={{ background: color }}
              />
            ))}
          </span>
        </div>
        <div className="mt-0.5 line-clamp-2 text-xs leading-4 text-sidebar-foreground/60">
          {template.description}
        </div>
      </div>
    </DropdownMenuItem>
  );
}

type ThemeTemplateItemProps = {
  template: ThemeTemplate;
  onApply: () => void;
};

function getMainSwatches(selection: ThemeSelection): [string, string] {
  const base =
    selection.customBaseEnabled && selection.customBaseColor
      ? selection.customBaseColor
      : getScaleHex(selection.baseScale);
  const primary =
    selection.customPrimaryEnabled && selection.customPrimaryColor
      ? selection.customPrimaryColor
      : getScaleHex(selection.primaryScale);

  return [base, primary];
}

function filterTemplateGroups(query: string): Array<ThemeTemplateGroup> {
  const normalizedQuery = query.trim().toLowerCase();

  return THEME_TEMPLATE_GROUPS.map((group) => ({
    ...group,
    templates: group.templates.filter((template) => {
      const searchable = [
        template.name,
        template.category,
        template.description,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    }),
  })).filter((group) => group.templates.length > 0);
}
