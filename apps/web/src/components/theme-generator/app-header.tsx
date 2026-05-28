import { Link, useNavigate } from "@tanstack/react-router";
import { Button, buttonVariants } from "@workspace/ui/components/button";
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
  Copy,
  GalleryVerticalEnd,
  GitBranch,
  Loader2,
  Share2,
  Upload,
} from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { ThemeCodeDialog } from "@/components/theme-code-dialog";
import { ContrastCheckerDialog } from "@/components/theme-generator/contrast-checker/contrast-checker-dialog";
import { CssTokenImportDialog } from "@/components/theme-generator/css-token-import-settings";
import {
  ThemeHistoryDialog,
  type ThemeHistorySnapshot,
} from "@/components/theme-generator/theme-history-dialog";
import type {
  ColorMode,
  ThemeModeTokens,
  ThemeSelection,
} from "@/lib/theme-generator/types";
import { type SharedThemePreset, saveThemePreset } from "@/lib/theme-presets";

export function AppHeader({
  css,
  mode,
  preset,
  selection,
  tokens,
  onModeChange,
  onUpdate,
}: AppHeaderProps) {
  function restoreSnapshot(snapshot: ThemeHistorySnapshot) {
    onModeChange(snapshot.mode);
    onUpdate(snapshot.selection);
  }

  return (
    <header className="sticky top-0 z-20 flex shrink-0 flex-col gap-3 border-b border-border bg-background/92 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-5 lg:min-h-16 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:py-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle theme controls"
          className="shrink-0"
        />

        <Link
          aria-label="Radixcn home"
          className="group flex min-w-0 items-center gap-3 rounded-md outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          to="/"
        >
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
        </Link>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Link className={buttonVariants({ variant: "outline" })} to="/themes">
          <GalleryVerticalEnd />
          Themes
        </Link>

        <ThemeCodeDialog css={css} />

        <ContrastCheckerDialog
          mode={mode}
          selection={selection}
          tokens={tokens}
          onUpdate={onUpdate}
        />

        <CssTokenImportDialog onUpdate={onUpdate} />

        <ThemeHistoryDialog
          mode={mode}
          selection={selection}
          onRestore={restoreSnapshot}
        />

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
  css: string;
  mode: ColorMode;
  preset?: SharedThemePreset | null;
  selection: ThemeSelection;
  tokens: ThemeModeTokens;
  onModeChange: (mode: ColorMode) => void;
  onUpdate: (selection: Partial<ThemeSelection>) => void;
};

function ShareThemeDialog({ preset, selection }: ShareThemeDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editable, setEditable] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [registryCommand, setRegistryCommand] = useState("");
  const [error, setError] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedRegistryCommand, setCopiedRegistryCommand] = useState(false);
  const inputId = useId();
  const editableId = useId();
  const shareUrlId = useId();
  const registryCommandId = useId();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setName(selection.name === "Custom" ? "" : selection.name);
      setEditable(preset?.editable ?? false);
      setShareUrl("");
      setRegistryCommand("");
      setError("");
      setCopied(false);
      setCopiedRegistryCommand(false);
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
      const nextRegistryUrl = getThemeRegistryUrl(preset.slug);
      const nextRegistryCommand = getThemeRegistryCommand(nextRegistryUrl);

      nextUrl.searchParams.set("preset", preset.slug);
      await navigate({
        replace: true,
        search: { preset: preset.slug },
        to: "/create",
      });
      await navigator.clipboard.writeText(nextRegistryCommand);
      setShareUrl(nextUrl.toString());
      setRegistryCommand(nextRegistryCommand);
      setCopied(false);
      setCopiedRegistryCommand(true);
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

  async function copyRegistryCommand() {
    if (!registryCommand) {
      return;
    }

    await navigator.clipboard.writeText(registryCommand);
    setCopiedRegistryCommand(true);
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

          {registryCommand ? (
            <div className="space-y-2">
              <Label htmlFor={registryCommandId}>Registry command</Label>
              <div className="flex gap-2">
                <Input
                  className="font-mono text-xs"
                  id={registryCommandId}
                  readOnly
                  value={registryCommand}
                />
                <Button
                  aria-label="Copy registry command"
                  size="icon"
                  type="button"
                  variant="outline"
                  onClick={copyRegistryCommand}
                >
                  {copiedRegistryCommand ? <Check /> : <Copy />}
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
              {registryCommand ? "Save again" : "Save and copy command"}
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

function getThemeRegistryUrl(slug: string) {
  return new URL(`/r/themes/${slug}.json`, window.location.origin).toString();
}

function getThemeRegistryCommand(registryUrl: string) {
  return `pnpm dlx shadcn@latest add ${registryUrl}`;
}

function getThemeShareUrl(slug: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const nextUrl = new URL(window.location.href);

  nextUrl.searchParams.set("preset", slug);

  return nextUrl.toString();
}

function UpdatePresetDialog({ preset, selection }: UpdatePresetDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [registryCommand, setRegistryCommand] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedRegistryCommand, setCopiedRegistryCommand] = useState(false);
  const shareUrlId = useId();
  const registryCommandId = useId();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setShareUrl(getThemeShareUrl(preset.slug));
      setRegistryCommand(
        getThemeRegistryCommand(getThemeRegistryUrl(preset.slug)),
      );
      setError("");
      setCopied(false);
      setCopiedRegistryCommand(false);
    }
  }

  async function updatePreset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setCopiedRegistryCommand(false);
    setIsUpdating(true);

    try {
      const updatedPreset = await saveThemePreset({
        data: {
          hash: preset.hash,
          name: preset.name,
          editable: true,
          selection,
        },
      });
      const nextRegistryUrl = getThemeRegistryUrl(updatedPreset.slug);
      const nextRegistryCommand = getThemeRegistryCommand(nextRegistryUrl);

      await navigate({
        replace: true,
        search: { preset: updatedPreset.slug },
        to: "/create",
      });
      setShareUrl(getThemeShareUrl(updatedPreset.slug));
      setRegistryCommand(nextRegistryCommand);
      toast.success("Preset updated.");
    } catch (updateError) {
      const message = getShareErrorMessage(updateError);

      setError(message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function copyShareUrl() {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  async function copyRegistryCommand() {
    if (!registryCommand) {
      return;
    }

    await navigator.clipboard.writeText(registryCommand);
    setCopiedRegistryCommand(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Upload />
        Update preset
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update this preset?</DialogTitle>
          <DialogDescription>
            This will replace the saved theme for everyone using this editable
            link.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={updatePreset}>
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

          <div className="space-y-2">
            <Label htmlFor={registryCommandId}>Registry command</Label>
            <div className="flex gap-2">
              <Input
                className="font-mono text-xs"
                id={registryCommandId}
                readOnly
                value={registryCommand}
              />
              <Button
                aria-label="Copy registry command"
                size="icon"
                type="button"
                variant="outline"
                onClick={copyRegistryCommand}
              >
                {copiedRegistryCommand ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter className="mt-0">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Close
            </DialogClose>
            <Button disabled={isUpdating} type="submit">
              {isUpdating ? <Loader2 className="animate-spin" /> : <Upload />}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
