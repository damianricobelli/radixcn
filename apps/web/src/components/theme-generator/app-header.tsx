import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import {
  Check,
  Clipboard,
  Code2,
  GitBranch,
  Palette,
  Sparkles,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export function AppHeader({ copied, css, onCopy }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex shrink-0 flex-col gap-3 border-b border-border bg-background/92 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-5 lg:min-h-16 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle theme controls"
          className="shrink-0"
        />

        <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary shadow-xs">
          <Palette className="size-4" />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-sm font-semibold tracking-tight md:text-base">
              RadixCN
            </h1>
            <span className="hidden items-center gap-1 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[0.7rem] font-medium text-secondary-foreground sm:inline-flex">
              <Sparkles className="size-3" />
              Theme studio
            </span>
          </div>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            Generate semantic shadcn themes from Radix Color scales.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <CssDialog copied={copied} css={css} onCopy={onCopy} />

        <Button variant="outline" onClick={onCopy}>
          {copied ? <Check /> : <Clipboard />}
          {copied ? "Copied" : "Copy CSS"}
        </Button>

        <Button
          aria-label="Open GitHub repository"
          variant="outline"
          onClick={() =>
            window.open("https://github.com/damianricobelli/radixcn", "_blank")
          }
        >
          <GitBranch />
          GitHub
        </Button>
      </div>
    </header>
  );
}

type AppHeaderProps = {
  copied: boolean;
  css: string;
  onCopy: () => void;
};

function CssDialog({ copied, css, onCopy }: CssDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="default" />}>
        <Code2 />
        View CSS
      </DialogTrigger>
      <DialogContent className="max-h-[min(760px,calc(100svh-2rem))] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border p-4">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="space-y-2">
              <DialogTitle>Generated theme CSS</DialogTitle>
              <DialogDescription>
                Copy these variables into your global stylesheet.
              </DialogDescription>
            </div>
            <Button size="sm" variant="outline" onClick={onCopy}>
              {copied ? <Check /> : <Clipboard />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </DialogHeader>
        <div className="max-h-[calc(100svh-12rem)] overflow-auto bg-muted/40">
          <CodeBlock code={css} language="css" className="min-w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type CssDialogProps = {
  copied: boolean;
  css: string;
  onCopy: () => void;
};
