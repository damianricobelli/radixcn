import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { toast } from "@workspace/ui/components/sonner";
import { Textarea } from "@workspace/ui/components/textarea";
import { ClipboardPaste, Import, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type CssToken,
  importCssTokens,
} from "@/lib/theme-generator/css-token-import";
import type { ThemeSelection } from "@/lib/theme-generator/types";

export function CssTokenImportDialog({ onUpdate }: CssTokenImportDialogProps) {
  const [css, setCss] = useState("");
  const [open, setOpen] = useState(false);
  const result = useMemo(() => importCssTokens(css), [css]);
  const hasCss = css.trim().length > 0;
  const hasDetectedTokens = result.tokens.length > 0;
  const hasImportableValues = Object.keys(result.selection).some(
    (key) => key !== "name",
  );

  function applyImportedTokens() {
    if (!hasImportableValues) {
      return;
    }

    onUpdate(result.selection);
    setOpen(false);
    toast.success("Imported CSS tokens", {
      description: `${result.tokens.length} token${
        result.tokens.length === 1 ? "" : "s"
      } detected and applied where supported.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Import />
        Import
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(760px,calc(100svh-2rem))] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <div className="space-y-2 pr-8">
            <DialogTitle>Import CSS tokens</DialogTitle>
            <DialogDescription>
              Paste CSS custom properties and Radixcn will map usable color
              values into custom Radix color palettes.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 space-y-3 overflow-hidden">
          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-xs font-medium text-foreground"
              htmlFor="css-token-import"
            >
              <ClipboardPaste className="size-3.5 text-muted-foreground" />
              Paste CSS variables
            </label>
            <Textarea
              id="css-token-import"
              className="max-h-64 min-h-44 resize-y font-mono text-xs leading-5"
              placeholder={`:root {
  --brand-primary: #635bff;
  --surface-neutral: #71717a;
  --danger: #e5484d;
}`}
              spellCheck={false}
              value={css}
              onChange={(event) => setCss(event.target.value)}
            />
            <div className="text-xs text-muted-foreground" role="status">
              {hasCss
                ? `${result.tokens.length} supported token${
                    result.tokens.length === 1 ? "" : "s"
                  } detected, including ${result.colorTokens.length} color token${
                    result.colorTokens.length === 1 ? "" : "s"
                  }`
                : "Detects custom properties with concrete CSS color values."}
            </div>
          </div>

          {hasCss ? (
            <div className="min-h-0">
              <div className="min-h-0 space-y-2">
                <div className="text-xs font-medium text-foreground">
                  Detected tokens
                </div>
                <div className="max-h-[min(220px,40svh)] overflow-y-auto rounded-lg border border-border">
                  {hasDetectedTokens ? (
                    <div className="divide-y divide-border/70" role="list">
                      {result.tokens.map((token) => (
                        <div
                          className="min-h-11 px-2.5 py-2"
                          key={token.name}
                          role="listitem"
                        >
                          <TokenValue token={token} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-xs leading-5 text-muted-foreground">
                      No supported tokens found. Use CSS custom properties with
                      concrete color values or supported Radixcn extras.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            disabled={!hasCss}
            type="button"
            variant="outline"
            onClick={() => setCss("")}
          >
            Clear
          </Button>
          <Button
            disabled={!hasImportableValues}
            type="button"
            onClick={applyImportedTokens}
          >
            <WandSparkles />
            Apply import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type CssTokenImportDialogProps = {
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};

function TokenValue({ token }: TokenValueProps) {
  const value = token.kind === "color" ? token.hex : token.value;

  return (
    <div className="flex min-w-0 items-center gap-2">
      {token.kind === "color" ? (
        <span
          aria-hidden="true"
          className="size-4 shrink-0 rounded-sm border border-border"
          style={{ backgroundColor: token.hex }}
        />
      ) : null}
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium text-foreground">
          {token.name}
        </span>
        <span className="block truncate font-mono text-[11px] text-muted-foreground">
          {value}
        </span>
      </span>
    </div>
  );
}

type TokenValueProps = {
  token: CssToken;
};
