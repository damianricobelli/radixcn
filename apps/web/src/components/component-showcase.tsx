import {
  Tabs,
  TabsContent,
} from "@workspace/ui/components/tabs";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { memo, useEffect, useState } from "react";
import { DashboardDemo } from "@/components/showcase/dashboard-demo";
import {
  ShowcaseCanvas,
  ShowcaseColumn,
} from "@/components/showcase/showcase-layout";
import { COMPONENT_SECTIONS } from "@/components/showcase/showcase-sections";
import { ShowcaseTabHeader } from "@/components/showcase/showcase-tab-header";
import { StatesTab } from "@/components/showcase/states-tab";
import { useRadixCnTheme } from "@/components/theme-generator/radixcn-theme-context";

export const ComponentShowcase = memo(function ComponentShowcase() {
  const { selection } = useRadixCnTheme();
  const statesEnabled = selection.additionalStatesEnabled;
  const [activeTab, setActiveTab] = useState("components");

  useEffect(() => {
    if (!statesEnabled && activeTab === "states") {
      setActiveTab("components");
    }
  }, [activeTab, statesEnabled]);

  return (
    <TooltipProvider>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full min-h-0 flex-col gap-3"
      >
        <ShowcaseTabHeader statesEnabled={statesEnabled} />

        <TabsContent
          value="dashboard"
          className="min-h-0 flex-1 overflow-hidden"
        >
          <DashboardDemo />
        </TabsContent>

        <TabsContent value="states" className="min-h-0 flex-1 overflow-hidden">
          <StatesTab />
        </TabsContent>

        <TabsContent
          value="components"
          className="min-h-0 flex-1 overflow-hidden"
        >
          <ShowcaseCanvas>
            {COMPONENT_SECTIONS.map((section) => (
              <ShowcaseColumn key={section.title} {...section} />
            ))}
          </ShowcaseCanvas>
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
});
