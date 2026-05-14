import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

type StateExample = {
  token: "destructive" | "success" | "warning" | "info";
  variant: "destructive" | "success" | "warning" | "info";
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const STATE_ACCENT_CLASS_NAMES: Record<StateExample["token"], string> = {
  destructive: "bg-destructive",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

const STATE_EXAMPLES: Array<StateExample> = [
  {
    token: "destructive",
    variant: "destructive",
    label: "Error",
    title: "Publish failed",
    description: "The theme export could not be saved. Review the request.",
    icon: OctagonX,
  },
  {
    token: "success",
    variant: "success",
    label: "Success",
    title: "Changes published",
    description: "The theme tokens were copied and are ready to ship.",
    icon: CircleCheck,
  },
  {
    token: "warning",
    variant: "warning",
    label: "Warning",
    title: "Contrast needs review",
    description: "This palette is close to the AA threshold on small text.",
    icon: TriangleAlert,
  },
  {
    token: "info",
    variant: "info",
    label: "Info",
    title: "Preset updated",
    description: "State colors follow the selected Radix scale.",
    icon: Info,
  },
];

const ALERT_VARIANTS_CODE = `variant: {
  default: "bg-card text-card-foreground",
  destructive:
    "border-destructive-border bg-destructive-muted text-destructive-muted-foreground *:[svg]:text-destructive-muted-foreground",
  success:
    "border-success-border bg-success-muted text-success-muted-foreground *:[svg]:text-success-muted-foreground",
  warning:
    "border-warning-border bg-warning-muted text-warning-muted-foreground *:[svg]:text-warning-muted-foreground",
  info: "border-info-border bg-info-muted text-info-muted-foreground *:[svg]:text-info-muted-foreground",
},`;

const BADGE_VARIANTS_CODE = `variant: {
  default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
  secondary:
    "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
  destructive:
    "border-destructive-border bg-destructive-muted text-destructive-muted-foreground focus-visible:ring-destructive/20 [a]:hover:bg-destructive-border/40 [&>svg]:text-destructive-muted-foreground",
  success:
    "border-success-border bg-success-muted text-success-muted-foreground focus-visible:ring-success/20 [a]:hover:bg-success-border/40 [&>svg]:text-success-muted-foreground",
  warning:
    "border-warning-border bg-warning-muted text-warning-muted-foreground focus-visible:ring-warning/20 [a]:hover:bg-warning-border/40 [&>svg]:text-warning-muted-foreground",
  info: "border-info-border bg-info-muted text-info-muted-foreground focus-visible:ring-info/20 [a]:hover:bg-info-border/40 [&>svg]:text-info-muted-foreground",
  outline:
    "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
},`;

export function StatesTab() {
  return (
    <div className="h-full overflow-auto rounded-lg border border-border bg-background shadow-xs">
      <div className="sticky top-0 z-10 rounded-t-lg border-b bg-background/95 px-3 py-2 backdrop-blur md:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Error, success, warning, and info
            </p>
            <h3 className="text-sm font-semibold tracking-tight">
              Component state recipes
            </h3>
          </div>
          <Badge variant="outline">Alert · Badge</Badge>
        </div>
      </div>

      <div className="space-y-4 p-3 md:p-4">
        <section className="rounded-lg border bg-muted/20 p-3">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">
                Preview states
              </h4>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                Alerts and badges share the same state tokens.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATE_EXAMPLES.map(({ variant, label, icon: Icon }) => (
                <Badge key={variant} variant={variant} className="gap-1.5">
                  <Icon className="size-3" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {STATE_EXAMPLES.map((example) => (
              <StateRecipeCard key={example.variant} {...example} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <CodeCard
            title="alert.tsx variants"
            description="Add these keys inside alertVariants."
            code={ALERT_VARIANTS_CODE}
            language="tsx"
          />
          <CodeCard
            title="badge.tsx variants"
            description="Add these keys inside badgeVariants."
            code={BADGE_VARIANTS_CODE}
            language="tsx"
          />
        </section>
      </div>
    </div>
  );
}

function StateRecipeCard({
  token,
  variant,
  label,
  title,
  description,
  icon: Icon,
}: StateExample) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={[
                "size-2.5 shrink-0 rounded-full",
                STATE_ACCENT_CLASS_NAMES[token],
              ].join(" ")}
            />
            <CardTitle className="truncate">{label}</CardTitle>
          </div>
          <Badge variant={variant} className="gap-1.5">
            <Icon className="size-3" />
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Alert variant={variant}>
          <Icon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

type CodeCardProps = {
  title: string;
  description: string;
  code: string;
  language: string;
};

function CodeCard({ title, description, code, language }: CodeCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock
          code={code}
          language={language}
          className="rounded-lg border bg-muted/40 [&>div:last-child]:max-h-64 [&>div:last-child]:overflow-auto"
        />
      </CardContent>
    </Card>
  );
}
