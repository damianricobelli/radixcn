import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Info, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { PanelSection } from "@/components/theme-generator/theme-customizer-section";
import {
  DEFAULT_TOKEN_BRIDGE_FONT_MAPPINGS,
  DEFAULT_TOKEN_BRIDGE_MAPPINGS,
} from "@/lib/theme-generator/generator";
import type {
  SemanticToken,
  ThemeSelection,
  TokenBridgeFontToken,
} from "@/lib/theme-generator/types";

export function TokenBridgeSettings({
  selection,
  onUpdate,
}: TokenBridgeSettingsProps) {
  return (
    <>
      <PanelSection
        title="Token Bridge"
        grouped={false}
        action={
          <TokenBridgeSwitch
            checked={selection.tokenBridgeEnabled}
            onCheckedChange={(enabled) =>
              onUpdate({ tokenBridgeEnabled: enabled })
            }
          />
        }
      >
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/20 p-3 text-xs leading-5 text-sidebar-foreground/65">
          Bridge aliases the shadcn token contract to your design system tokens.
          Components keep using shadcn variables, while color and typography
          values resolve to your existing CSS variables. Empty mappings keep
          using generated Radixcn values.
        </div>
      </PanelSection>

      {selection.tokenBridgeEnabled ? (
        <PanelSection
          title="Mappings"
          info={
            <TokenBridgeMappingsInfo
              additionalStatesEnabled={selection.additionalStatesEnabled}
            />
          }
          grouped={false}
          action={
            <Button
              aria-label="Reset token bridge mappings"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onUpdate({
                  tokenBridgeMappings: {},
                  tokenBridgeFontMappings: {},
                })
              }
            >
              <RotateCcw />
            </Button>
          }
        >
          {selection.chartStrategy === "multicolor" ? null : (
            <TokenBridgeChartNote chartStrategy={selection.chartStrategy} />
          )}
          <TokenBridgeMappingsAccordion
            selection={selection}
            onUpdate={onUpdate}
          />
        </PanelSection>
      ) : null}
    </>
  );
}

type TokenBridgeSettingsProps = {
  selection: ThemeSelection;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};

const BASE_TOKEN_BRIDGE_SECTIONS = [
  {
    title: "Surface",
    tokens: ["background", "foreground"],
  },
  {
    title: "Containers",
    tokens: ["card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    title: "Muted",
    tokens: ["muted", "muted-foreground"],
  },
  {
    title: "Interactive / Primary",
    tokens: ["primary", "primary-foreground"],
  },
  {
    title: "Interactive / Secondary",
    tokens: ["secondary", "secondary-foreground"],
  },
  {
    title: "Interactive / Accent",
    tokens: ["accent", "accent-foreground"],
  },
  {
    title: "Status / Destructive",
    tokens: ["destructive", "destructive-foreground"],
  },
  {
    title: "Structure / Focus",
    tokens: ["border", "input", "ring"],
  },
] as const satisfies ReadonlyArray<TokenBridgeSection>;

const TOKEN_BRIDGE_FONT_ROWS = [
  { token: "font-sans", label: "body font" },
  { token: "font-heading", label: "heading font" },
  { token: "font-mono", label: "code font" },
] as const satisfies ReadonlyArray<{
  token: TokenBridgeFontToken;
  label: string;
}>;

const CHART_TOKEN_BRIDGE_SECTION = {
  title: "Charts",
  tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
} as const satisfies TokenBridgeSection;

const STATE_TOKEN_BRIDGE_SECTIONS = [
  {
    title: "States / Destructive",
    tokens: [
      "destructive-muted",
      "destructive-muted-foreground",
      "destructive-border",
    ],
  },
  {
    title: "States / Success",
    tokens: [
      "success",
      "success-foreground",
      "success-muted",
      "success-muted-foreground",
      "success-border",
    ],
  },
  {
    title: "States / Warning",
    tokens: [
      "warning",
      "warning-foreground",
      "warning-muted",
      "warning-muted-foreground",
      "warning-border",
    ],
  },
  {
    title: "States / Info",
    tokens: [
      "info",
      "info-foreground",
      "info-muted",
      "info-muted-foreground",
      "info-border",
    ],
  },
] as const satisfies ReadonlyArray<TokenBridgeSection>;

type TokenBridgeSection = {
  title: string;
  tokens: ReadonlyArray<SemanticToken>;
};

function getTokenBridgeSections(selection: ThemeSelection) {
  return [
    ...BASE_TOKEN_BRIDGE_SECTIONS,
    ...(selection.chartStrategy === "multicolor"
      ? [CHART_TOKEN_BRIDGE_SECTION]
      : []),
    ...(selection.additionalStatesEnabled ? STATE_TOKEN_BRIDGE_SECTIONS : []),
  ];
}

function TokenBridgeMappingsInfo({
  additionalStatesEnabled,
}: TokenBridgeMappingsInfoProps) {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            aria-label="Learn how token bridge mappings are grouped"
            className="inline-flex rounded-full text-sidebar-foreground/65 transition-colors hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            type="button"
          />
        }
      >
        <Info aria-hidden="true" className="size-4" />
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-80 space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Mapped token coverage</div>
          <p className="text-xs leading-5 text-muted-foreground">
            Sidebar tokens are derived from surface, content, interactive,
            border, and focus mappings, so they are not listed as separate
            inputs.
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Chart mappings appear only when chart colors are set to multicolor.
            Monochrome charts use primary; neutral charts use base.
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            Typography mappings alias shadcn font tokens to your existing
            design-system font variables.
          </p>
          <p className="text-xs leading-5 text-muted-foreground">
            {additionalStatesEnabled
              ? "Additional state mappings include destructive subtle tokens plus success, warning, and info variants."
              : "Additional state mappings appear when States is enabled in the Colors tab."}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

type TokenBridgeMappingsInfoProps = {
  additionalStatesEnabled: boolean;
};

function TokenBridgeChartNote({ chartStrategy }: TokenBridgeChartNoteProps) {
  const source = chartStrategy === "neutral" ? "base" : "primary";

  return (
    <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/20 p-3 text-xs leading-5 text-sidebar-foreground/65">
      Chart mappings are hidden because charts are using the {source} palette.
      Switch Charts to multicolor to map each chart token directly.
    </div>
  );
}

type TokenBridgeChartNoteProps = {
  chartStrategy: ThemeSelection["chartStrategy"];
};

function TokenBridgeSwitch({
  checked,
  onCheckedChange,
}: TokenBridgeSwitchProps) {
  return (
    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs font-medium text-sidebar-foreground/65">
      <span>Enabled</span>
      <Switch
        aria-label="Enable token bridge mappings"
        checked={checked}
        size="sm"
        onCheckedChange={onCheckedChange}
      />
    </label>
  );
}

type TokenBridgeSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function TokenBridgeMappingsAccordion({
  selection,
  onUpdate,
}: TokenBridgeMappingsAccordionProps) {
  return (
    <Accordion
      className="overflow-hidden rounded-lg border border-sidebar-border bg-transparent"
      defaultValue={["Surface"]}
    >
      {getTokenBridgeSections(selection).map((section) => {
        const mappedCount = section.tokens.filter((token) =>
          selection.tokenBridgeMappings[token]?.trim(),
        ).length;

        return (
          <TokenBridgeAccordionItem
            key={section.title}
            mappedCount={mappedCount}
            title={section.title}
            totalCount={section.tokens.length}
            value={section.title}
          >
            {section.tokens.map((token) => (
              <TokenBridgeMappingRow
                key={token}
                token={token}
                value={selection.tokenBridgeMappings[token] ?? ""}
                onChange={(value) =>
                  onUpdate({
                    tokenBridgeMappings: {
                      ...selection.tokenBridgeMappings,
                      [token]: value,
                    },
                  })
                }
              />
            ))}
          </TokenBridgeAccordionItem>
        );
      })}
      <TokenBridgeAccordionItem
        mappedCount={
          TOKEN_BRIDGE_FONT_ROWS.filter(({ token }) =>
            selection.tokenBridgeFontMappings[token]?.trim(),
          ).length
        }
        title="Typography"
        totalCount={TOKEN_BRIDGE_FONT_ROWS.length}
        value="Typography"
      >
        {TOKEN_BRIDGE_FONT_ROWS.map(({ token, label }) => (
          <TokenBridgeFontMappingRow
            key={token}
            label={label}
            token={token}
            value={selection.tokenBridgeFontMappings[token] ?? ""}
            onChange={(value) =>
              onUpdate({
                tokenBridgeFontMappings: {
                  ...selection.tokenBridgeFontMappings,
                  [token]: value,
                },
              })
            }
          />
        ))}
      </TokenBridgeAccordionItem>
    </Accordion>
  );
}

type TokenBridgeMappingsAccordionProps = {
  selection: ThemeSelection;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};

function TokenBridgeAccordionItem({
  title,
  mappedCount,
  totalCount,
  value,
  children,
}: TokenBridgeAccordionItemProps) {
  return (
    <AccordionItem
      className="border-sidebar-border last:border-b-0"
      value={value}
    >
      <AccordionTrigger className="rounded-none px-2.5 py-2 hover:no-underline focus-visible:ring-sidebar-ring">
        <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
          <span className="truncate text-[11px] font-semibold tracking-wide text-sidebar-foreground/65 uppercase">
            {title}
          </span>
          <span className="shrink-0 rounded-full border border-sidebar-border bg-sidebar-accent/35 px-2 py-0.5 text-[10px] font-medium text-sidebar-foreground/55">
            {mappedCount}/{totalCount}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="divide-y divide-sidebar-border/70 border-sidebar-border border-t p-0 pb-0">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

type TokenBridgeAccordionItemProps = {
  title: string;
  mappedCount: number;
  totalCount: number;
  value: string;
  children: ReactNode;
};

function TokenBridgeMappingRow({
  token,
  value,
  onChange,
}: TokenBridgeMappingRowProps) {
  return (
    <div className="grid min-h-12 grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] items-center gap-2 px-2.5 py-2">
      <label
        className="truncate text-xs font-medium text-sidebar-foreground"
        htmlFor={`token-bridge-${token}`}
      >
        {token}
      </label>
      <Input
        id={`token-bridge-${token}`}
        className="h-8 bg-sidebar text-xs"
        placeholder={getTokenBridgePlaceholder(token)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

type TokenBridgeMappingRowProps = {
  token: SemanticToken;
  value: string;
  onChange: (value: string) => void;
};

function getTokenBridgePlaceholder(token: SemanticToken) {
  const mappings: Partial<Record<SemanticToken, string>> =
    DEFAULT_TOKEN_BRIDGE_MAPPINGS;

  return mappings[token] ?? "system.token";
}

function TokenBridgeFontMappingRow({
  label,
  token,
  value,
  onChange,
}: TokenBridgeFontMappingRowProps) {
  return (
    <div className="grid min-h-12 grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] items-center gap-2 px-2.5 py-2">
      <label
        className="truncate text-xs font-medium text-sidebar-foreground"
        htmlFor={`token-bridge-${token}`}
      >
        {label}
      </label>
      <Input
        id={`token-bridge-${token}`}
        className="h-8 bg-sidebar text-xs"
        placeholder={DEFAULT_TOKEN_BRIDGE_FONT_MAPPINGS[token]}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

type TokenBridgeFontMappingRowProps = {
  label: string;
  token: TokenBridgeFontToken;
  value: string;
  onChange: (value: string) => void;
};
