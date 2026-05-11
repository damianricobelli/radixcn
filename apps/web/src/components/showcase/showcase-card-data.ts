import type { LucideIcon } from "lucide-react";
import {
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Copy,
  Inbox,
  KeyRound,
  LayoutDashboard,
  MoreHorizontal,
  Palette,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings,
  SlidersHorizontal,
  Terminal,
  Trash,
  Upload,
  Users,
  Wand2,
} from "lucide-react";

type ThemeTokenPreview = {
  token: string;
  className: string;
};

type StatePreview = {
  label: string;
  detail: string;
  colorClassName: string;
};

type NavigationPreview = {
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type IconAction = {
  label: string;
  icon: LucideIcon;
};

type CheckedOption = {
  id: string;
  label: string;
  checked: boolean;
};

type SettingsOption = {
  title: string;
  detail: string;
  enabled: boolean;
};

type EnvironmentVariable = {
  key: string;
  value: string;
  icon: LucideIcon;
};

type ProgressStep = {
  label: string;
  detail: string;
  value: number;
};

type TokenMappingRow = {
  token: string;
  source: string;
  status: string;
};

type ProjectRow = {
  project: string;
  branch: string;
  status: string;
  uptime: string;
  updated: string;
};

type ActivityEvent = {
  icon: LucideIcon;
  title: string;
  detail: string;
};

export const THEME_TOKENS: Array<ThemeTokenPreview> = [
  { token: "--background", className: "bg-background" },
  { token: "--foreground", className: "bg-foreground" },
  { token: "--primary", className: "bg-primary" },
  { token: "--secondary", className: "bg-secondary" },
  { token: "--muted", className: "bg-muted" },
  { token: "--accent", className: "bg-accent" },
  { token: "--border", className: "bg-border" },
  { token: "--chart-1", className: "bg-chart-1" },
  { token: "--chart-2", className: "bg-chart-2" },
  { token: "--chart-3", className: "bg-chart-3" },
  { token: "--chart-4", className: "bg-chart-4" },
  { token: "--chart-5", className: "bg-chart-5" },
];

export const STATE_PREVIEWS: Array<StatePreview> = [
  { label: "Queued", detail: "Waiting for runner", colorClassName: "bg-muted" },
  {
    label: "Building",
    detail: "2m 18s elapsed",
    colorClassName: "bg-chart-2",
  },
  {
    label: "Healthy",
    detail: "All checks passing",
    colorClassName: "bg-chart-1",
  },
];

export const NAVIGATION_PREVIEWS: Array<NavigationPreview> = [
  { icon: LayoutDashboard, label: "Preview", active: true },
  { icon: Palette, label: "Tokens", active: false },
  { icon: SlidersHorizontal, label: "Tuning", active: false },
];

export const ICON_ACTIONS: Array<IconAction> = [
  { label: "Copy", icon: Copy },
  { label: "Alert", icon: CircleAlert },
  { label: "Delete", icon: Trash },
  { label: "Upload", icon: Upload },
  { label: "Inbox", icon: Inbox },
  { label: "More", icon: MoreHorizontal },
  { label: "Refresh", icon: RefreshCw },
  { label: "Add", icon: Plus },
  { label: "Generate", icon: Wand2 },
  { label: "Confirm", icon: Check },
  { label: "Expand", icon: ChevronDown },
  { label: "Search", icon: Search },
  { label: "Settings", icon: Settings },
  { label: "Terminal", icon: Terminal },
];

export const DELIVERY_OPTIONS: Array<CheckedOption> = [
  { id: "sync", label: "Sync chart colors", checked: true },
  { id: "contrast", label: "Enforce AA contrast", checked: true },
  { id: "motion", label: "Reduce motion", checked: false },
];

export const SETTINGS_OPTIONS: Array<SettingsOption> = [
  {
    title: "Automatic deploys",
    detail: "Ship every green main build.",
    enabled: true,
  },
  {
    title: "Preview URLs",
    detail: "Create per-branch review links.",
    enabled: true,
  },
  {
    title: "Usage alerts",
    detail: "Notify admins at 80% quota.",
    enabled: false,
  },
];

export const ENVIRONMENT_VARIABLES: Array<EnvironmentVariable> = [
  { key: "DATABASE_URL", value: "Encrypted", icon: KeyRound },
  { key: "NEXT_PUBLIC_API", value: "api.acme.com", icon: Server },
  { key: "STRIPE_SECRET", value: "Encrypted", icon: KeyRound },
];

export const DEPLOYMENT_STEPS: Array<ProgressStep> = [
  { label: "Queued", detail: "main · 1b9f2c", value: 100 },
  { label: "Build", detail: "pnpm build", value: 100 },
  { label: "Checks", detail: "12 passed", value: 82 },
  { label: "Promote", detail: "iad1 + gru1", value: 34 },
];

export const PLAN_FEATURES = [
  "Unlimited theme exports",
  "Shared team presets",
  "Priority contrast checks",
];

export const TOKEN_MAPPING_ROWS: Array<TokenMappingRow> = [
  { token: "primary", source: "primary-9", status: "AA" },
  { token: "ring", source: "primary-8", status: "Focus" },
  { token: "muted", source: "base-3", status: "UI" },
];

export const PROJECT_ROWS: Array<ProjectRow> = [
  {
    project: "radixcn-web",
    branch: "main",
    status: "Ready",
    uptime: "99.97%",
    updated: "2m ago",
  },
  {
    project: "docs",
    branch: "release",
    status: "Building",
    uptime: "99.91%",
    updated: "8m ago",
  },
  {
    project: "api-edge",
    branch: "hotfix",
    status: "Review",
    uptime: "99.88%",
    updated: "19m ago",
  },
  {
    project: "billing",
    branch: "main",
    status: "Ready",
    uptime: "99.99%",
    updated: "41m ago",
  },
];

export const ACTIVITY_EVENTS: Array<ActivityEvent> = [
  {
    icon: Check,
    title: "Deployment promoted",
    detail: "gru1 received build 1b9f2c",
  },
  {
    icon: Clock3,
    title: "Cron delayed",
    detail: "Billing sync retried after 41s",
  },
  {
    icon: Users,
    title: "Member invited",
    detail: "Lucia joined Design Systems",
  },
];

export const RELEASE_DATE = new Date(2026, 4, 8);
export const FEEDBACK_STARS = Array.from({ length: 5 }, (_, index) => index + 1);
