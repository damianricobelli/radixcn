import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { Component, LayoutDashboard } from "lucide-react"
import { memo, type ComponentType } from "react"
import { DashboardDemo } from "@/components/showcase/dashboard-demo"
import {
  ActionGridCard,
  AlertCard,
  AuthCard,
  BrowserShareCard,
  CalendarCard,
  CommandCard,
  ControlsCard,
  DeploymentCard,
  EmptyCard,
  EnvironmentCard,
  FeedbackCard,
  FormCard,
  NavigationCard,
  PlanCard,
  StatesCard,
  SettingsCard,
  TableCard,
  TeamCard,
  ThemeCard,
  TrafficCard,
  TypographyCard,
} from "@/components/showcase/showcase-cards"
import {
  ShowcaseCanvas,
  ShowcaseColumn,
} from "@/components/showcase/showcase-layout"

type ComponentShowcaseSection = {
  title: string
  description: string
  items: Array<ComponentType>
}

const COMPONENT_SECTIONS: Array<ComponentShowcaseSection> = [
  {
    title: "Foundations",
    description: "Tokens, type, color, navigation",
    items: [ThemeCard, TypographyCard, NavigationCard],
  },
  {
    title: "States",
    description: "Semantic states, alerts, feedback",
    items: [StatesCard, AlertCard, FeedbackCard],
  },
  {
    title: "Actions",
    description: "Inputs, commands, forms, auth",
    items: [
      ActionGridCard,
      ControlsCard,
      CommandCard,
      FormCard,
      AuthCard,
    ],
  },
  {
    title: "Operations",
    description: "Deployments, status, settings, config",
    items: [
      EnvironmentCard,
      DeploymentCard,
      TrafficCard,
      SettingsCard,
    ],
  },
  {
    title: "Data & overlays",
    description: "Tables, teams, empty states, popovers",
    items: [
      TeamCard,
      BrowserShareCard,
      TableCard,
      CalendarCard,
      PlanCard,
      EmptyCard,
    ],
  },
]

export const ComponentShowcase = memo(function ComponentShowcase() {
  return (
    <TooltipProvider>
      <Tabs defaultValue="dashboard" className="flex h-full min-h-0 flex-col gap-3">
        <div className="flex shrink-0 flex-col gap-3 rounded-lg border border-border bg-background px-3 py-3 shadow-xs md:flex-row md:items-center md:justify-between md:px-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              Live preview
            </p>
            <h2 className="truncate text-sm font-semibold tracking-tight md:text-base">
              Component system preview
            </h2>
          </div>

          <TabsList className="w-full justify-start md:w-fit">
            <TabsTrigger value="dashboard" className="min-w-0 px-2.5">
              <LayoutDashboard className="size-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="components" className="min-w-0 px-2.5">
              <Component className="size-4" />
              Components
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="min-h-0 flex-1 overflow-hidden">
          <DashboardDemo />
        </TabsContent>

        <TabsContent value="components" className="min-h-0 flex-1 overflow-hidden">
          <ShowcaseCanvas>
            {COMPONENT_SECTIONS.map((section) => (
              <ShowcaseColumn key={section.title} {...section} />
            ))}
          </ShowcaseCanvas>
        </TabsContent>

      </Tabs>
    </TooltipProvider>
  )
})
