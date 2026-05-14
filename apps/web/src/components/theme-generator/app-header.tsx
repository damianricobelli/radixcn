import { useNavigate } from "@tanstack/react-router";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { toast } from "@workspace/ui/components/sonner";
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  GitBranch,
  Loader2,
  Share2,
  Upload,
} from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  colorToHex,
  colorToHsl,
  colorToOklch,
  colorToRgb,
  isValidCssColor,
} from "@/lib/theme-generator/color";
import type { ThemeSelection } from "@/lib/theme-generator/types";
import { type SharedThemePreset, saveThemePreset } from "@/lib/theme-presets";

export function AppHeader({ css, preset, selection }: AppHeaderProps) {
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
        <CssDialog css={css} />

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
  preset?: SharedThemePreset | null;
  selection: ThemeSelection;
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

function CssDialog({ css }: CssDialogProps) {
  const [colorFormat, setColorFormat] = useState<CssColorFormat>("oklch");
  const formattedCss = formatCssColorValues(css, colorFormat);

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="default" />}>
        <Code2 />
        View CSS
      </DialogTrigger>
      <DialogContent className="max-h-[min(760px,calc(100svh-2rem))] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <div className="space-y-2 pr-8">
            <DialogTitle>Generated theme CSS</DialogTitle>
            <DialogDescription>
              Copy these variables into your global stylesheet.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="min-h-0 max-w-full overflow-hidden">
          <CodeBlock
            code={formattedCss}
            language="css"
            className="max-w-full"
            codeViewportClassName="max-h-[calc(100svh-14rem)]"
            headerAccessory={
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      className="h-6 gap-1 rounded-md px-1.5 font-mono text-[0.7rem] uppercase"
                      size="xs"
                      variant="ghost"
                    />
                  }
                >
                  {colorFormat.toUpperCase()}
                  <ChevronDown className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32">
                  <DropdownMenuRadioGroup
                    value={colorFormat}
                    onValueChange={(value) =>
                      setColorFormat(value as CssColorFormat)
                    }
                  >
                    {CSS_COLOR_FORMATS.map((format) => (
                      <DropdownMenuRadioItem key={format} value={format}>
                        {format.toUpperCase()}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            }
            wrapLongLines={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type CssDialogProps = {
  css: string;
};

const CSS_COLOR_FORMATS = ["hex", "rgb", "hsl", "oklch"] as const;

type CssColorFormat = (typeof CSS_COLOR_FORMATS)[number];

function formatCssColorValues(css: string, format: CssColorFormat) {
  return css.replace(
    /^(\s*--[\w-]+:\s*)([^;]+)(;.*)$/gm,
    (line, prefix: string, value: string, suffix: string) => {
      const trimmedValue = value.trim();

      if (!isValidCssColor(trimmedValue)) {
        return line;
      }

      return `${prefix}${formatCssColor(trimmedValue, format)}${suffix}`;
    },
  );
}

function formatCssColor(value: string, format: CssColorFormat) {
  if (format === "hex") {
    return colorToHex(value);
  }

  if (format === "rgb") {
    return colorToRgb(value);
  }

  if (format === "hsl") {
    return colorToHsl(value);
  }

  return colorToOklch(value);
}
