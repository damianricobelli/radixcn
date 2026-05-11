import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Component, LayoutDashboard, Sparkles, Waypoints } from "lucide-react";

type ShowcaseTabHeaderProps = {
  statesEnabled: boolean;
};

export function ShowcaseTabHeader({ statesEnabled }: ShowcaseTabHeaderProps) {
  return (
    <div className="relative shrink-0 rounded-lg border border-border bg-background px-3 py-3 shadow-xs md:px-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-md border bg-muted/45 px-2 py-1">
              <Sparkles className="size-3.5" />
              Component lab
            </span>
          </div>
          <h2 className="mt-2 max-w-2xl text-balance text-lg font-semibold tracking-tight md:text-xl">
            A sharper preview for the radixcn component system.
          </h2>
        </div>

        <div className="flex min-w-0 justify-start md:justify-end">
          <TabsList variant="default">
            <TabsTrigger value="components">
              <Component className="size-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="size-4" />
              Dashboard
            </TabsTrigger>
            <StatesTabTrigger statesEnabled={statesEnabled} />
          </TabsList>
        </div>
      </div>
    </div>
  );
}

function StatesTabTrigger({ statesEnabled }: ShowcaseTabHeaderProps) {
  if (statesEnabled) {
    return (
      <TabsTrigger value="states">
        <Waypoints className="size-4" />
        States
      </TabsTrigger>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        render={<span className="inline-flex h-full flex-1 rounded-md" />}
      >
        <TabsTrigger value="states" disabled>
          <Waypoints className="size-4" />
          States
        </TabsTrigger>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="end" className="w-72 space-y-1.5">
        <div className="text-sm font-medium">Enable custom states</div>
        <p className="text-xs leading-5 text-muted-foreground">
          Turn on Add states in Colors to preview the success, warning, and info
          state tokens here.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
