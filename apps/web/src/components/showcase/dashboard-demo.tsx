import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { Progress } from "@workspace/ui/components/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import {
  Activity,
  Bell,
  CircleAlert,
  CreditCard,
  Database,
  Gauge,
  Home,
  Layers,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  ActivityFeedCard,
  BrowserShareCard,
  DeploymentCard,
  EnvironmentCard,
  ProjectsTableCard,
  ReliabilityCard,
  TeamCard,
} from "@/components/showcase/showcase-cards";

type DashboardMenuItem = {
  icon: typeof Home;
  label: string;
  badge?: string;
};

const DASHBOARD_MENU_ITEMS: Array<DashboardMenuItem> = [
  { icon: Home, label: "Overview", badge: "12" },
  { icon: Layers, label: "Projects", badge: "8" },
  { icon: Database, label: "Datasets", badge: "24" },
  { icon: Activity, label: "Observability", badge: "3" },
  { icon: CreditCard, label: "Billing" },
  { icon: Settings, label: "Settings" },
];

export function DashboardDemo() {
  return (
    <SidebarProvider className="h-full min-h-0 overflow-hidden rounded-xl border bg-secondary/50 dark:bg-background">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-primary px-2 py-2 text-sidebar-primary-foreground">
            <div className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary-foreground/15">
              <Layers className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">Acme Cloud</div>
              <div className="truncate text-xs opacity-80">Production org</div>
            </div>
          </div>
          <SidebarInput placeholder="Search workspace" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {DASHBOARD_MENU_ITEMS.map(
                  ({ icon: Icon, label, badge }, index) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton isActive={index === 0}>
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                      {badge ? (
                        <SidebarMenuBadge>{badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Usage</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3 px-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-sidebar-foreground/70">Requests</span>
                  <span>68%</span>
                </div>
                <Progress value={68} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-sidebar-foreground/70">Storage</span>
                  <span>41%</span>
                </div>
                <Progress value={41} />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="outline" className="w-full">
            <Bell />
            Notifications
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 overflow-hidden bg-transparent">
        <div className="min-h-0 flex-1 overflow-auto p-4 md:p-5">
          <div className="space-y-5">
            <DashboardHero />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    icon={<Gauge />}
                    label="Revenue"
                    value="$128.4k"
                    delta="+18.2%"
                    detail="vs. last month"
                  />
                  <MetricCard
                    icon={<Users />}
                    label="Active users"
                    value="24,892"
                    delta="+9.7%"
                    detail="3,421 online"
                  />
                  <MetricCard
                    icon={<ShieldCheck />}
                    label="Uptime"
                    value="99.97%"
                    delta="+0.04%"
                    detail="7 day average"
                  />
                  <MetricCard
                    icon={<CircleAlert />}
                    label="Incidents"
                    value="3"
                    delta="-42%"
                    detail="1 needs review"
                  />
                </div>
                <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
                  <ReliabilityCard />
                  <BrowserShareCard />
                </div>
                <ProjectsTableCard />
              </div>
              <div className="space-y-4">
                <DeploymentCard />
                <EnvironmentCard />
                <TeamCard />
                <ActivityFeedCard />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function DashboardHero() {
  return (
    <section className="overflow-hidden rounded-xl bg-background ring-1 ring-border">
      <div className="flex flex-col gap-4 p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-3">
            <SidebarTrigger className="mt-0.5 shrink-0" />
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Acme Cloud</span>
                <span className="text-border">/</span>
                <span>Operations</span>
                <Badge variant="secondary" className="gap-1.5">
                  <span className="size-1.5 rounded-full bg-chart-1" />
                  Healthy
                </Badge>
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Production overview
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Monitor revenue, reliability, deployments, and team activity
                  from one operational surface.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
            <InputGroup className="bg-muted/40 sm:w-64">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                aria-label="Search dashboard"
                placeholder="Search services"
              />
            </InputGroup>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload />
                Export
              </Button>
              <Button>
                <Plus />
                Create
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-t pt-4 md:grid-cols-4">
          {[
            ["Region", "iad1 + gru1"],
            ["Window", "Last 7 days"],
            ["Release", "main · 1b9f2c"],
            ["SLA", "99.95% target"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-muted/45 px-3 py-2">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">
                {label}
              </div>
              <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon, label, value, delta, detail }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <CardTitle className="mt-1 text-2xl tabular-nums">{value}</CardTitle>
        </div>
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Badge variant="secondary">{delta}</Badge>
        <span className="text-xs text-muted-foreground">{detail}</span>
      </CardContent>
    </Card>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  delta: string;
  detail: string;
};
