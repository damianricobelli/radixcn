import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { ChevronRight, ExternalLink, Info, Search } from "lucide-react";
import { type ReactNode, useState } from "react";
import { labelize } from "@/components/theme-generator/theme-customizer-utils";

export function PanelSection({
  title,
  info,
  action,
  children,
  grouped = true,
}: PanelSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold tracking-wide text-sidebar-foreground/55 uppercase">
          <span>{title}</span>
          {info}
        </div>
        {action}
      </div>
      {grouped ? (
        <PanelSectionGroup>{children}</PanelSectionGroup>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </section>
  );
}

type PanelSectionProps = {
  title: string;
  info?: ReactNode;
  action?: ReactNode;
  grouped?: boolean;
  children: ReactNode;
};

export function PanelSectionGroup({ children }: PanelSectionGroupProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-sidebar-border bg-transparent [&>*+*]:border-t [&>*+*]:border-sidebar-border">
      {children}
    </div>
  );
}

type PanelSectionGroupProps = {
  children: ReactNode;
};

export function SectionCustomSwitch({
  checked,
  disabled = false,
  onCheckedChange,
}: SectionCustomSwitchProps) {
  return (
    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs font-medium text-sidebar-foreground/65">
      <span>Custom palette</span>
      <Switch
        aria-label="Use custom colors for this group"
        checked={checked}
        disabled={disabled}
        size="sm"
        onCheckedChange={onCheckedChange}
      />
    </label>
  );
}

type SectionCustomSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function CustomPaletteHoverCard() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            aria-label="Learn how custom palettes are generated"
            className="inline-flex rounded-full text-sidebar-foreground/65 transition-colors hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            type="button"
          />
        }
      >
        <Info aria-hidden="true" className="size-4" />
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-80 space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Custom palettes</div>
          <p className="text-xs leading-5 text-muted-foreground">
            Choose a single accent color and use it as the solid step in the
            scale. radixcn then derives the full light and dark palettes with
            Radix Colors semantics, keeping the generated steps suitable for
            backgrounds, borders, interactive states, solid fills, and readable
            foregrounds.
          </p>
        </div>
        <a
          className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground underline-offset-4 hover:underline"
          href="https://www.radix-ui.com/colors/custom"
          rel="noreferrer"
          target="_blank"
        >
          Radix custom colors
          <ExternalLink className="size-3" />
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}

export function OptionDropdown<TValue extends string>({
  label,
  value,
  options,
  disabledOptions,
  onChange,
  getLabel = labelize,
}: OptionDropdownProps<TValue>) {
  return (
    <SidebarDropdown
      label={label}
      value={getLabel(value)}
      contentClassName="max-h-[min(34rem,var(--available-height))] w-56 overflow-y-auto border border-border p-1 ring-0"
    >
      <DropdownMenuRadioGroup
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as TValue)}
      >
        {options.map((option) => (
          <DropdownMenuRadioItem
            className={SIDEBAR_DROPDOWN_ITEM_CLASSNAME}
            disabled={disabledOptions?.includes(option)}
            key={option}
            value={option}
          >
            {getLabel(option)}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </SidebarDropdown>
  );
}

type OptionDropdownProps<TValue extends string> = {
  label: string;
  value: TValue;
  options: ReadonlyArray<TValue>;
  disabledOptions?: ReadonlyArray<TValue>;
  onChange: (value: TValue) => void;
  getLabel?: (value: TValue) => string;
};

export const SIDEBAR_DROPDOWN_CONTENT_CLASSNAME =
  "flex max-h-[min(34rem,var(--available-height))] w-64 flex-col overflow-hidden border border-border p-0 ring-0";

export const SIDEBAR_DROPDOWN_SCROLL_CONTENT_CLASSNAME =
  "max-h-[min(34rem,var(--available-height))] w-64 overflow-y-auto border border-border p-1 ring-0";

export const SIDEBAR_DROPDOWN_ITEM_CLASSNAME = "min-h-8 px-2.5 py-1.5";

export function SidebarDropdownSearch({
  ariaLabel,
  placeholder,
  value,
  onChange,
  children,
}: SidebarDropdownSearchProps) {
  return (
    <div className="border-b border-border bg-popover p-2">
      {children}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label={ariaLabel}
          className="h-8 pl-8"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        />
      </div>
    </div>
  );
}

type SidebarDropdownSearchProps = {
  ariaLabel: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  children?: ReactNode;
};

export function SidebarDropdownEmpty({ children }: SidebarDropdownEmptyProps) {
  return (
    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

type SidebarDropdownEmptyProps = {
  children: ReactNode;
};

export function SidebarDropdown({
  ariaLabel,
  label,
  value,
  swatch,
  swatches,
  embedded,
  contentClassName = "w-56 border border-border ring-0",
  alignOffset,
  sideOffset = 8,
  children,
}: SidebarDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-0">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <SidebarDropdownTrigger
          ariaLabel={ariaLabel}
          label={label}
          value={value}
          swatch={swatch}
          swatches={swatches}
          embedded={embedded}
        />
        {open ? (
          <DropdownMenuContent
            side="right"
            align="start"
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            className={contentClassName}
          >
            {children}
          </DropdownMenuContent>
        ) : null}
      </DropdownMenu>
    </div>
  );
}

type SidebarDropdownProps = MenuRowProps & {
  ariaLabel?: string;
  contentClassName?: string;
  alignOffset?: number;
  sideOffset?: number;
  children: ReactNode;
};

function SidebarDropdownTrigger({
  ariaLabel,
  label,
  value,
  swatch,
  swatches,
  embedded,
}: SidebarDropdownTriggerProps) {
  return (
    <DropdownMenuTrigger
      render={
        <button
          aria-label={ariaLabel}
          className="group/menu-trigger block w-full text-left focus-visible:outline-none"
          type="button"
        />
      }
    >
      <MenuRow
        label={label}
        value={value}
        swatch={swatch}
        swatches={swatches}
        embedded={embedded}
      />
    </DropdownMenuTrigger>
  );
}

type SidebarDropdownTriggerProps = MenuRowProps & {
  ariaLabel?: string;
};

export function MenuRow({
  label,
  value,
  swatch,
  swatches,
  embedded = false,
}: MenuRowProps) {
  return (
    <div
      className={[
        "flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-sidebar-foreground transition-colors",
        embedded ? "h-full bg-transparent" : "min-h-10 hover:bg-sidebar/50",
      ].join(" ")}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{label}</div>
      </div>
      <div className="flex min-w-0 max-w-[72%] items-center gap-2">
        {swatches ? <MenuRowSwatches swatches={swatches} /> : null}
        {swatch ? <MenuRowSwatch swatch={swatch} /> : null}
        <span className="truncate text-xs font-medium text-sidebar-foreground/65">
          {value}
        </span>
        <ChevronRight className="size-4 shrink-0 text-sidebar-foreground/55 transition-colors group-hover/menu-trigger:text-sidebar-foreground" />
      </div>
    </div>
  );
}

type MenuRowProps = {
  label: string;
  value: string;
  swatch?: string;
  swatches?: Array<string>;
  embedded?: boolean;
};

function MenuRowSwatches({ swatches }: MenuRowSwatchesProps) {
  return (
    <div className="flex shrink-0 -space-x-1">
      {swatches.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="size-3.5 rounded-full ring-1 ring-sidebar-border"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

type MenuRowSwatchesProps = {
  swatches: Array<string>;
};

function MenuRowSwatch({ swatch }: MenuRowSwatchProps) {
  return (
    <span
      className="size-3.5 shrink-0 rounded-full ring-1 ring-sidebar-border"
      style={{ background: swatch }}
    />
  );
}

type MenuRowSwatchProps = {
  swatch: string;
};
