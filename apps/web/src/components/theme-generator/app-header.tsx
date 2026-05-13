import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { toast } from "@workspace/ui/components/sonner";
import {
  Check,
  Clipboard,
  Code2,
  Copy,
  GitBranch,
  Loader2,
  Share2,
  Upload,
} from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { CodeBlock } from "@/components/code-block";
import type { ThemeSelection } from "@/lib/theme-generator/types";
import { type SharedThemePreset, saveThemePreset } from "@/lib/theme-presets";

export function AppHeader({
  copied,
  css,
  preset,
  selection,
  onCopy,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex shrink-0 flex-col gap-3 border-b border-border bg-background/92 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-5 lg:min-h-16 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle theme controls"
          className="shrink-0"
        />

        <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary shadow-xs">
          <img
            alt=""
            className="size-6 rounded-sm object-cover"
            src="/web-app-manifest-192x192.png"
          />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-sm font-semibold tracking-tight md:text-base">
              Radixcn
            </h1>
          </div>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            Generate semantic shadcn themes from Radix Color scales.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <CssDialog copied={copied} css={css} onCopy={onCopy} />

        <ShareThemeDialog preset={preset} selection={selection} />

        {preset?.editable ? (
          <UpdatePresetDialog preset={preset} selection={selection} />
        ) : null}

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
  preset?: SharedThemePreset | null;
  selection: ThemeSelection;
  onCopy: () => void;
};

function ShareThemeDialog({ preset, selection }: ShareThemeDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editable, setEditable] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputId = useId();
  const editableId = useId();
  const shareUrlId = useId();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setName(selection.name === "Custom" ? "" : selection.name);
      setEditable(preset?.editable ?? false);
      setShareUrl("");
      setError("");
      setCopied(false);
    }
  }

  async function shareTheme(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setIsSharing(true);

    try {
      const preset = await saveThemePreset({
        data: {
          name,
          editable,
          selection,
        },
      });
      const nextUrl = new URL(window.location.href);

      nextUrl.searchParams.set("preset", preset.hash);
      await navigate({
        replace: true,
        search: { preset: preset.hash },
        to: "/create",
      });
      await navigator.clipboard.writeText(nextUrl.toString());
      setShareUrl(nextUrl.toString());
      setCopied(true);
    } catch (shareError) {
      setError(getShareErrorMessage(shareError));
    } finally {
      setIsSharing(false);
    }
  }

  async function copyShareUrl() {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Share2 />
        Share
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share theme</DialogTitle>
          <DialogDescription>
            Name this theme before saving it as a reusable preset.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={shareTheme}>
          <div className="space-y-2">
            <Label htmlFor={inputId}>Preset name</Label>
            <Input
              autoComplete="off"
              autoFocus
              disabled={isSharing}
              id={inputId}
              maxLength={48}
              placeholder="My Radix theme"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <label
            className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
            htmlFor={editableId}
          >
            <Checkbox
              checked={editable}
              className="mt-0.5"
              disabled={isSharing}
              id={editableId}
              onCheckedChange={setEditable}
            />
            <span className="grid gap-1 text-sm">
              <span className="font-medium">Editable</span>
              <span className="text-muted-foreground">
                Anyone with this link can update this same preset.
              </span>
            </span>
          </label>

          {shareUrl ? (
            <div className="space-y-2">
              <Label htmlFor={shareUrlId}>Share URL</Label>
              <div className="flex gap-2">
                <Input
                  className="font-mono text-xs"
                  id={shareUrlId}
                  readOnly
                  value={shareUrl}
                />
                <Button
                  aria-label="Copy share URL"
                  size="icon"
                  type="button"
                  variant="outline"
                  onClick={copyShareUrl}
                >
                  {copied ? <Check /> : <Copy />}
                </Button>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter className="mt-0">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Close
            </DialogClose>
            <Button disabled={isSharing} type="submit">
              {isSharing ? <Loader2 className="animate-spin" /> : <Share2 />}
              {shareUrl ? "Save again" : "Save and copy link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ShareThemeDialogProps = {
  preset?: SharedThemePreset | null;
  selection: ThemeSelection;
};

function UpdatePresetDialog({ preset, selection }: UpdatePresetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function updatePreset() {
    setIsUpdating(true);

    try {
      await saveThemePreset({
        data: {
          hash: preset.hash,
          name: preset.name,
          editable: true,
          selection,
        },
      });
      toast.success("Preset updated.");
      setOpen(false);
    } catch (error) {
      toast.error(getShareErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        <Upload />
        Update preset
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update this preset?</AlertDialogTitle>
          <AlertDialogDescription>
            This will replace the saved theme for everyone using this editable
            link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isUpdating} onClick={updatePreset}>
            {isUpdating ? <Loader2 className="animate-spin" /> : <Upload />}
            Update preset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type UpdatePresetDialogProps = {
  preset: SharedThemePreset;
  selection: ThemeSelection;
};

function getShareErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Could not save this preset.";
}

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
          <CodeBlock
            code={css}
            language="css"
            className="min-w-full"
            wrapLongLines={false}
          />
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
