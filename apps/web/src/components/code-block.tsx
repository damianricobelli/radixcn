import { Button } from "@workspace/ui/components/button";
import { Check, Clipboard } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("css", css);

type CodeBlockProps = {
  code: string;
  language: string;
  className?: string;
  codeViewportClassName?: string;
  headerAccessory?: ReactNode;
  wrapLongLines?: boolean;
};

export function CodeBlock({
  code,
  language,
  className,
  codeViewportClassName,
  headerAccessory,
  wrapLongLines = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef<number | null>(null);
  const lineCount = code.split("\n").length;
  const highlightedLanguage = normalizeLanguage(language);

  async function copyCode() {
    await navigator.clipboard.writeText(code);

    if (copyResetTimerRef.current !== null) {
      window.clearTimeout(copyResetTimerRef.current);
    }

    setCopied(true);
    copyResetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyResetTimerRef.current = null;
    }, 1400);
  }

  return (
    <div
      className={[
        syntaxThemeClassName,
        "overflow-hidden rounded-lg border border-border shadow-xs",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: syntaxColors.background,
        color: syntaxColors.foreground,
      }}
    >
      <div
        className="flex h-10 items-center justify-between gap-3 border-b border-border px-3"
        style={{ backgroundColor: syntaxColors.header }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 rounded-full bg-destructive/80" />
          <span className="size-2 rounded-full bg-warning/80" />
          <span className="size-2 rounded-full bg-success/80" />
          <span className="ml-1 truncate font-mono text-[0.7rem] font-medium text-muted-foreground uppercase">
            {language}
          </span>
          {headerAccessory}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden font-mono text-[0.7rem] text-muted-foreground sm:inline">
            {lineCount} lines
          </span>
          <Button
            aria-label={copied ? "Code copied" : "Copy code"}
            className="size-7"
            size="icon"
            variant="ghost"
            onClick={copyCode}
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Clipboard className="size-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={["max-w-full overflow-auto", codeViewportClassName]
          .filter(Boolean)
          .join(" ")}
      >
        <SyntaxHighlighter
          language={highlightedLanguage}
          style={syntaxTheme}
          customStyle={{
            margin: 0,
            background: "transparent",
            minWidth: wrapLongLines ? undefined : "max-content",
            padding: "1rem 1.125rem",
          }}
          codeTagProps={{
            className:
              "font-mono text-[0.78rem] leading-6 whitespace-pre [font-variant-ligatures:none]",
          }}
          lineNumberStyle={{
            minWidth: "2.5rem",
            paddingRight: "1rem",
            color: syntaxColors.lineNumber,
            textAlign: "right",
            userSelect: "none",
          }}
          PreTag="div"
          showLineNumbers
          wrapLongLines={wrapLongLines}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function normalizeLanguage(language: string) {
  const normalizedLanguage = language.toLowerCase();

  if (normalizedLanguage === "ts") {
    return "typescript";
  }

  if (normalizedLanguage === "js") {
    return "javascript";
  }

  return normalizedLanguage;
}

const syntaxColors = {
  background: "var(--syntax-bg)",
  header: "var(--syntax-header)",
  foreground: "var(--syntax-fg)",
  lineNumber: "var(--syntax-line-number)",
  comment: "var(--syntax-comment)",
  punctuation: "var(--syntax-punctuation)",
  property: "var(--syntax-property)",
  tag: "var(--syntax-tag)",
  constant: "var(--syntax-constant)",
  selector: "var(--syntax-selector)",
  attribute: "var(--syntax-attribute)",
  string: "var(--syntax-string)",
  operator: "var(--syntax-operator)",
  keyword: "var(--syntax-keyword)",
  function: "var(--syntax-function)",
  className: "var(--syntax-class)",
  regex: "var(--syntax-regex)",
  variable: "var(--syntax-variable)",
} as const;

const syntaxThemeClassName = [
  "[--syntax-bg:oklch(99%_0.002_286)]",
  "[--syntax-header:oklch(96.5%_0.004_286)]",
  "[--syntax-fg:oklch(25%_0.014_286)]",
  "[--syntax-line-number:oklch(65%_0.018_286)]",
  "[--syntax-comment:oklch(52%_0.03_255)]",
  "[--syntax-punctuation:oklch(42%_0.018_286)]",
  "[--syntax-property:oklch(48%_0.13_55)]",
  "[--syntax-tag:oklch(50%_0.16_25)]",
  "[--syntax-constant:oklch(48%_0.14_45)]",
  "[--syntax-selector:oklch(43%_0.13_150)]",
  "[--syntax-attribute:oklch(47%_0.13_230)]",
  "[--syntax-string:oklch(42%_0.13_145)]",
  "[--syntax-operator:oklch(48%_0.13_315)]",
  "[--syntax-keyword:oklch(48%_0.16_285)]",
  "[--syntax-function:oklch(45%_0.14_235)]",
  "[--syntax-class:oklch(46%_0.13_85)]",
  "[--syntax-regex:oklch(50%_0.15_20)]",
  "[--syntax-variable:oklch(45%_0.1_205)]",
  "dark:[--syntax-bg:oklch(18.5%_0.008_286)]",
  "dark:[--syntax-header:oklch(22%_0.01_286)]",
  "dark:[--syntax-fg:oklch(92%_0.006_286)]",
  "dark:[--syntax-line-number:oklch(62%_0.012_286)]",
  "dark:[--syntax-comment:oklch(64%_0.02_255)]",
  "dark:[--syntax-punctuation:oklch(78%_0.012_286)]",
  "dark:[--syntax-property:oklch(78%_0.11_75)]",
  "dark:[--syntax-tag:oklch(76%_0.13_24)]",
  "dark:[--syntax-constant:oklch(76%_0.12_45)]",
  "dark:[--syntax-selector:oklch(77%_0.12_150)]",
  "dark:[--syntax-attribute:oklch(78%_0.11_210)]",
  "dark:[--syntax-string:oklch(78%_0.13_145)]",
  "dark:[--syntax-operator:oklch(76%_0.1_315)]",
  "dark:[--syntax-keyword:oklch(74%_0.14_285)]",
  "dark:[--syntax-function:oklch(80%_0.12_230)]",
  "dark:[--syntax-class:oklch(84%_0.11_85)]",
  "dark:[--syntax-regex:oklch(76%_0.12_20)]",
  "dark:[--syntax-variable:oklch(84%_0.08_205)]",
].join(" ");

const syntaxTheme = {
  'code[class*="language-"]': {
    color: syntaxColors.foreground,
    background: "transparent",
    fontFamily: "var(--font-mono)",
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    tabSize: 2,
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: syntaxColors.foreground,
    background: "transparent",
    fontFamily: "var(--font-mono)",
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    tabSize: 2,
    hyphens: "none",
  },
  comment: {
    color: syntaxColors.comment,
    fontStyle: "italic",
  },
  prolog: {
    color: syntaxColors.comment,
  },
  doctype: {
    color: syntaxColors.comment,
  },
  cdata: {
    color: syntaxColors.comment,
  },
  punctuation: {
    color: syntaxColors.punctuation,
  },
  property: {
    color: syntaxColors.property,
  },
  tag: {
    color: syntaxColors.tag,
  },
  boolean: {
    color: syntaxColors.constant,
  },
  number: {
    color: syntaxColors.constant,
  },
  constant: {
    color: syntaxColors.constant,
  },
  symbol: {
    color: syntaxColors.constant,
  },
  deleted: {
    color: syntaxColors.tag,
  },
  selector: {
    color: syntaxColors.selector,
  },
  "attr-name": {
    color: syntaxColors.attribute,
  },
  string: {
    color: syntaxColors.string,
  },
  char: {
    color: syntaxColors.string,
  },
  builtin: {
    color: syntaxColors.selector,
  },
  inserted: {
    color: syntaxColors.string,
  },
  operator: {
    color: syntaxColors.operator,
  },
  entity: {
    color: syntaxColors.operator,
  },
  url: {
    color: syntaxColors.string,
  },
  atrule: {
    color: syntaxColors.keyword,
  },
  "attr-value": {
    color: syntaxColors.string,
  },
  keyword: {
    color: syntaxColors.keyword,
  },
  function: {
    color: syntaxColors.function,
  },
  "class-name": {
    color: syntaxColors.className,
  },
  regex: {
    color: syntaxColors.regex,
  },
  important: {
    color: syntaxColors.keyword,
    fontWeight: "600",
  },
  variable: {
    color: syntaxColors.variable,
  },
} as const;
