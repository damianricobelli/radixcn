import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import {
  SIDEBAR_DROPDOWN_ITEM_CLASSNAME,
  SIDEBAR_DROPDOWN_SCROLL_CONTENT_CLASSNAME,
  SidebarDropdown,
} from "@/components/theme-generator/theme-customizer-section";
import {
  getOtherScales,
  getScaleSwatch,
  labelize,
} from "@/components/theme-generator/theme-customizer-utils";
import type { RadixScaleName } from "@/lib/theme-generator/types";

export function ColorScaleDropdown({
  ariaLabel,
  label,
  value,
  displayValue = labelize(value),
  swatch = getScaleSwatch(value),
  recommended,
  recommendedLabel = "Recommended",
  onChange,
}: ColorScaleDropdownProps) {
  return (
    <SidebarDropdown
      ariaLabel={ariaLabel}
      label={label}
      value={displayValue}
      swatch={swatch}
      contentClassName={SIDEBAR_DROPDOWN_SCROLL_CONTENT_CLASSNAME}
    >
      <ColorScaleRadioGroup
        value={value}
        recommended={recommended}
        recommendedLabel={recommendedLabel}
        onChange={onChange}
      />
    </SidebarDropdown>
  );
}

type ColorScaleDropdownProps = {
  ariaLabel: string;
  label: string;
  value: RadixScaleName;
  displayValue?: string;
  swatch?: string;
  recommended: ReadonlyArray<RadixScaleName>;
  recommendedLabel?: string;
  onChange: (value: RadixScaleName) => void;
};

function ColorScaleRadioGroup({
  value,
  recommended,
  recommendedLabel,
  onChange,
}: ColorScaleRadioGroupProps) {
  const otherScales = getOtherScales(recommended);

  return (
    <DropdownMenuRadioGroup
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as RadixScaleName)}
    >
      <div>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{recommendedLabel}</DropdownMenuLabel>
          {recommended.map((scale) => (
            <ColorScaleMenuItem key={scale} scale={scale} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Others</DropdownMenuLabel>
          {otherScales.map((scale) => (
            <ColorScaleMenuItem key={scale} scale={scale} />
          ))}
        </DropdownMenuGroup>
      </div>
    </DropdownMenuRadioGroup>
  );
}

type ColorScaleRadioGroupProps = {
  value: RadixScaleName;
  recommended: ReadonlyArray<RadixScaleName>;
  recommendedLabel: string;
  onChange: (value: RadixScaleName) => void;
};

function ColorScaleMenuItem({ scale }: ColorScaleMenuItemProps) {
  return (
    <DropdownMenuRadioItem
      className={SIDEBAR_DROPDOWN_ITEM_CLASSNAME}
      value={scale}
    >
      <span
        className="size-3 rounded-full border border-sidebar-border"
        style={{ background: getScaleSwatch(scale) }}
      />
      {labelize(scale)}
    </DropdownMenuRadioItem>
  );
}

type ColorScaleMenuItemProps = {
  scale: RadixScaleName;
};
