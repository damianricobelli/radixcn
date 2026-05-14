import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ChevronDown, Code2 } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  colorToHex,
  colorToHsl,
  colorToOklch,
  colorToRgb,
  isValidCssColor,
} from "@/lib/theme-generator/color";

export function ThemeCodeDialog({
  css,
  fullWidth = false,
}: ThemeCodeDialogProps) {
  const [colorFormat, setColorFormat] = useState<CssColorFormat>("oklch");
  const formattedCss = formatCssColorValues(css, colorFormat);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={fullWidth ? "w-full" : undefined}
            variant="default"
          />
        }
      >
        <Code2 />
        Code
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

type ThemeCodeDialogProps = {
  css: string;
  fullWidth?: boolean;
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
