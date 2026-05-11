import { Button } from "@workspace/ui/components/button";
import { Check, Clipboard } from "lucide-react";
import { useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("css", css);

type CodeBlockProps = {
  code: string;
  language: string;
  className?: string;
};

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef<number | null>(null);
  const lineCount = code.split("\n").length;

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
        "overflow-hidden rounded-lg border border-border bg-[var(--syntax-bg)] text-[var(--syntax-fg)] shadow-xs",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-10 items-center justify-between gap-3 border-b border-border bg-[var(--syntax-header)] px-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 rounded-full bg-destructive/80" />
          <span className="size-2 rounded-full bg-warning/80" />
          <span className="size-2 rounded-full bg-success/80" />
          <span className="ml-1 truncate font-mono text-[0.7rem] font-medium text-muted-foreground uppercase">
            {language}
          </span>
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

      <div className="overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "1rem 1.125rem",
          }}
          codeTagProps={{
            className:
              "font-mono text-[0.78rem] leading-6 [font-variant-ligatures:none]",
          }}
          lineNumberStyle={{
            minWidth: "2.5rem",
            paddingRight: "1rem",
            color: "var(--syntax-line-number)",
            textAlign: "right",
            userSelect: "none",
          }}
          PreTag="div"
          showLineNumbers
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

const syntaxTheme = {
  'code[class*="language-"]': {
    color: "var(--syntax-fg)",
    background: "transparent",
    fontFamily: "var(--font-mono-family)",
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
    color: "var(--syntax-fg)",
    background: "transparent",
    fontFamily: "var(--font-mono-family)",
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
    color: "var(--syntax-comment)",
    fontStyle: "italic",
  },
  prolog: {
    color: "var(--syntax-comment)",
  },
  doctype: {
    color: "var(--syntax-comment)",
  },
  cdata: {
    color: "var(--syntax-comment)",
  },
  punctuation: {
    color: "var(--syntax-punctuation)",
  },
  property: {
    color: "var(--syntax-property)",
  },
  tag: {
    color: "var(--syntax-tag)",
  },
  boolean: {
    color: "var(--syntax-constant)",
  },
  number: {
    color: "var(--syntax-constant)",
  },
  constant: {
    color: "var(--syntax-constant)",
  },
  symbol: {
    color: "var(--syntax-constant)",
  },
  deleted: {
    color: "var(--syntax-tag)",
  },
  selector: {
    color: "var(--syntax-selector)",
  },
  "attr-name": {
    color: "var(--syntax-attribute)",
  },
  string: {
    color: "var(--syntax-string)",
  },
  char: {
    color: "var(--syntax-string)",
  },
  builtin: {
    color: "var(--syntax-selector)",
  },
  inserted: {
    color: "var(--syntax-string)",
  },
  operator: {
    color: "var(--syntax-operator)",
  },
  entity: {
    color: "var(--syntax-operator)",
  },
  url: {
    color: "var(--syntax-string)",
  },
  atrule: {
    color: "var(--syntax-keyword)",
  },
  "attr-value": {
    color: "var(--syntax-string)",
  },
  keyword: {
    color: "var(--syntax-keyword)",
  },
  function: {
    color: "var(--syntax-function)",
  },
  "class-name": {
    color: "var(--syntax-class)",
  },
  regex: {
    color: "var(--syntax-regex)",
  },
  important: {
    color: "var(--syntax-keyword)",
    fontWeight: "600",
  },
  variable: {
    color: "var(--syntax-variable)",
  },
} as const;
