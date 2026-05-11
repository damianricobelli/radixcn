import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { Progress } from "@workspace/ui/components/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Slider } from "@workspace/ui/components/slider";
import { Switch } from "@workspace/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Check,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  Code2,
  FileText,
  GitBranch,
  Inbox,
  Lock,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Receipt,
  ShieldCheck,
  Star,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  browserData,
  chartConfig,
  reliabilityData,
  trafficData,
} from "@/components/showcase/showcase-data";
import {
  ACTIVITY_EVENTS,
  DELIVERY_OPTIONS,
  DEPLOYMENT_STEPS,
  ENVIRONMENT_VARIABLES,
  FEEDBACK_STARS,
  ICON_ACTIONS,
  NAVIGATION_PREVIEWS,
  PLAN_FEATURES,
  PROJECT_ROWS,
  RELEASE_DATE,
  SETTINGS_OPTIONS,
  STATE_PREVIEWS,
  THEME_TOKENS,
  TOKEN_MAPPING_ROWS,
} from "@/components/showcase/showcase-card-data";

export function ThemeCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Theme tokens</CardTitle>
          <Badge variant="outline">12 vars</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Semantic values update instantly as the generator changes.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-3">
          {THEME_TOKENS.map(({ token, className }) => (
            <div key={token} className="min-w-0">
              <div className={`h-12 rounded-lg border ${className}`} />
              <div className="mt-2 truncate text-[10px] text-muted-foreground">
                {token}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TypographyCard() {
  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-medium text-muted-foreground uppercase">
          Inter variable
        </p>
        <CardTitle>Readable hierarchy for product screens.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          Dense dashboards need compact headings, strong tabular numbers, and
          body copy that remains calm beside charts and controls.
        </p>
        <div className="grid grid-cols-3 gap-2 rounded-lg border p-2 text-center">
          <Metric label="H1" value="32" />
          <Metric label="Body" value="14" />
          <Metric label="Small" value="12" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <FileText />
          Inspect type scale
        </Button>
      </CardFooter>
    </Card>
  );
}

export function StatesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>State system</CardTitle>
        <p className="text-sm text-muted-foreground">
          Loading, empty, warning, and complete states share the same rhythm.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {STATE_PREVIEWS.map(({ label, detail, colorClassName }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <span className={`size-2.5 rounded-full ${colorClassName}`} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{label}</div>
              <div className="truncate text-xs text-muted-foreground">
                {detail}
              </div>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function NavigationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation shell</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breadcrumbs, tabs, and section links for dense product screens.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Themes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Radix</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Slate production</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/30 p-1">
          {NAVIGATION_PREVIEWS.map(({ icon: Icon, label, active }) => (
            <Button
              key={label}
              variant={active ? "secondary" : "ghost"}
              className="justify-start"
            >
              <Icon />
              {label}
            </Button>
          ))}
        </div>
        <Accordion defaultValue={["tokens"]}>
          <AccordionItem value="tokens">
            <AccordionTrigger>Token groups</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Background, foreground, chart, sidebar, ring, and destructive
              tokens update together.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="exports">
            <AccordionTrigger>Export targets</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Copy CSS variables, Tailwind config, or a reusable preset.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function ActionGridCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Icon actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-7 gap-3">
        {ICON_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.label}
              variant="outline"
              size="icon"
              aria-label={action.label}
            >
              <Icon />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function ControlsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button>Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel>Two-factor authentication</FieldLabel>
            <FieldDescription>
              Require a second factor for admin actions.
            </FieldDescription>
            <Button size="sm" variant="secondary">
              Enable
            </Button>
          </Field>
        </FieldGroup>
        <Slider defaultValue={[52]} />
        <Input placeholder="Project name" />
        <Textarea placeholder="Release notes" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Badge>Stable</Badge>
            <Badge variant="secondary">Beta</Badge>
            <Badge variant="outline">Edge</Badge>
          </div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}

export function FormCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project form</CardTitle>
        <p className="text-sm text-muted-foreground">
          Labels, helper text, radios, checkboxes, and composed inputs.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="project-slug">Project slug</FieldLabel>
            <FieldDescription>
              Used for generated CSS file names and sharing URLs.
            </FieldDescription>
            <InputGroup>
              <InputGroupAddon>
                <Terminal />
              </InputGroupAddon>
              <InputGroupInput id="project-slug" defaultValue="radixcn-theme" />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="theme-notes">Notes</FieldLabel>
            <Textarea
              id="theme-notes"
              defaultValue="Tight SaaS palette, accessible charts, and compact tables."
            />
          </Field>
        </FieldGroup>
        <RadioGroup defaultValue="system" className="grid-cols-3">
          {["light", "dark", "system"].map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm capitalize"
            >
              <RadioGroupItem value={value} />
              {value}
            </label>
          ))}
        </RadioGroup>
        <div className="space-y-2 rounded-lg border p-3">
          {DELIVERY_OPTIONS.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <Checkbox id={option.id} defaultChecked={option.checked} />
              {option.label}
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CommandCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Command menu</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fast actions, search results, and shortcuts in one compact surface.
        </p>
      </CardHeader>
      <CardContent>
        <Command className="rounded-lg border">
          <CommandInput placeholder="Run command" />
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>
                <Sparkles />
                Generate palette
                <CommandShortcut>G</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Code2 />
                Copy CSS variables
                <CommandShortcut>C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <GitBranch />
                Compare presets
                <CommandShortcut>P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Resources">
              <CommandItem>
                <FileText />
                Documentation
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  );
}

export function AuthCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <InputGroup>
          <InputGroupAddon>
            <Inbox />
          </InputGroupAddon>
          <InputGroupInput placeholder="Email" type="email" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <Lock />
          </InputGroupAddon>
          <InputGroupInput placeholder="Password" type="password" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>SSO</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <Button className="w-full">Continue</Button>
      </CardContent>
    </Card>
  );
}

export function SettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings panel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Toggle-heavy application settings with clear status copy.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {SETTINGS_OPTIONS.map((setting) => (
          <div
            key={setting.title}
            className="flex items-center justify-between gap-4 rounded-lg border p-3"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium">{setting.title}</div>
              <div className="truncate text-xs text-muted-foreground">
                {setting.detail}
              </div>
            </div>
            <Switch defaultChecked={setting.enabled} />
          </div>
        ))}
        <div className="space-y-2 rounded-lg bg-muted/45 p-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Theme coverage</span>
            <span className="text-muted-foreground">86%</span>
          </div>
          <Progress value={86} />
        </div>
      </CardContent>
    </Card>
  );
}

export function EnvironmentCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Environment</CardTitle>
          <Badge variant="secondary">Production</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          8 variables · 2 secrets rotated
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {ENVIRONMENT_VARIABLES.map(({ key, value, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 font-mono text-xs"
          >
            <span className="truncate">{key}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="size-3" />
              {value}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Edit</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

export function DeploymentCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Deployment pipeline</CardTitle>
          <Badge variant="outline">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {DEPLOYMENT_STEPS.map((step) => (
          <div key={step.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{step.label}</span>
              <span className="text-xs text-muted-foreground">
                {step.detail}
              </span>
            </div>
            <Progress value={step.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TrafficCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic channels</CardTitle>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Monthly desktop, mobile, and API traffic.
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart accessibilityLayer data={trafficData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            <Bar dataKey="api" fill="var(--color-api)" radius={4} />
          </BarChart>
        </ChartContainer>
        <div className="grid grid-cols-3 gap-4 border-t pt-4 text-center text-sm">
          <Metric label="Desktop" value="1,224" />
          <Metric label="Mobile" value="860" />
          <Metric label="API" value="888" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View report</Button>
      </CardFooter>
    </Card>
  );
}

export function ReliabilityCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>Reliability</CardTitle>
          <p className="text-sm text-muted-foreground">
            Uptime and latency across edge regions.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <AreaChart accessibilityLayer data={reliabilityData}>
            <defs>
              <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-uptime)"
                  stopOpacity={0.34}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-uptime)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis hide domain={[99.85, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="uptime"
              type="monotone"
              fill="url(#uptimeFill)"
              stroke="var(--color-uptime)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function BrowserShareCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Browser share</CardTitle>
        <p className="text-sm text-muted-foreground">January - June 2026</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-56"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={browserData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={58}
              strokeWidth={5}
            >
              <LabelList
                dataKey="visitors"
                className="fill-background"
                stroke="none"
                fontSize={12}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <Progress value={72} />
      </CardContent>
    </Card>
  );
}

export function TeamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team access</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+8</AvatarGroupCount>
        </AvatarGroup>
        <div className="flex gap-2">
          <Button size="icon-sm" variant="outline" aria-label="Previous team">
            01
          </Button>
          <Button size="icon-sm" aria-label="Next team">
            02
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertCard() {
  return (
    <div className="space-y-3">
      <Alert>
        <ShieldCheck />
        <AlertTitle>Accessible contrast</AlertTitle>
        <AlertDescription>
          Solid foregrounds are computed per color.
        </AlertDescription>
      </Alert>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Theme copied</DialogTitle>
            <DialogDescription>
              Paste it into your shadcn globals file.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CalendarCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Release calendar</CardTitle>
          <Badge variant="outline" className="gap-1.5">
            <CalendarDays className="size-3" />
            May
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Date picker inside a card with adjacent release metadata.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Calendar
          mode="single"
          defaultMonth={RELEASE_DATE}
          selected={RELEASE_DATE}
          className="mx-auto"
        />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Freeze</div>
            <div className="font-medium">May 8</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Launch</div>
            <div className="font-medium">May 12</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlanCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Billing plan</CardTitle>
          <Badge>Pro</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          A pricing-style card to test emphasis, lists, and actions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-3xl font-semibold tabular-nums">$29</span>
          <span className="text-sm text-muted-foreground"> / seat</span>
        </div>
        <div className="space-y-2">
          {PLAN_FEATURES.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-chart-1" />
              {item}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">
          <Receipt />
          Invoice
        </Button>
        <Button>Upgrade</Button>
      </CardFooter>
    </Card>
  );
}

export function FeedbackCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback popover</CardTitle>
        <p className="text-sm text-muted-foreground">
          Hover cards, ratings, and compact support actions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <HoverCard>
          <HoverCardTrigger render={<Button variant="outline" />}>
            <MessageSquare />
            Preview feedback
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {FEEDBACK_STARS.map((star) => (
                  <Star
                    key={`feedback-star-${star}`}
                    className="size-4 fill-chart-4 text-chart-4"
                  />
                ))}
              </div>
              <p className="text-sm">
                The generated palette keeps cards readable without flattening
                the whole interface.
              </p>
              <p className="text-xs text-muted-foreground">
                Design Systems · 12 minutes ago
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
        <Alert>
          <CircleAlert />
          <AlertTitle>Review requested</AlertTitle>
          <AlertDescription>
            Two chart colors are close enough to compare in dark mode.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export function TableCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TOKEN_MAPPING_ROWS.map(({ token, source, status }) => (
              <TableRow key={token}>
                <TableCell>{token}</TableCell>
                <TableCell>{source}</TableCell>
                <TableCell>
                  <Badge variant="outline">{status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ProjectsTableCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Production projects</CardTitle>
          <p className="text-sm text-muted-foreground">
            Deployments by service.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="icon" />}
          >
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Table</DropdownMenuLabel>
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROJECT_ROWS.map(
              ({ project, branch, status, uptime, updated }) => (
                <TableRow key={project}>
                  <TableCell className="font-medium">{project}</TableCell>
                  <TableCell>{branch}</TableCell>
                  <TableCell>
                    <Badge
                      variant={status === "Ready" ? "secondary" : "outline"}
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>{uptime}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {updated}
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" text="Prev" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}

export function EmptyCard() {
  return (
    <Card>
      <CardContent>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No overrides</EmptyTitle>
            <EmptyDescription>
              The generated theme is fully semantic and ready to copy.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Actions
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuItem>Copy CSS</DropdownMenuItem>
                <DropdownMenuItem>Download preset</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Reset</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}

export function ActivityFeedCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACTIVITY_EVENTS.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{title}</div>
              <div className="truncate text-xs text-muted-foreground">
                {detail}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}
