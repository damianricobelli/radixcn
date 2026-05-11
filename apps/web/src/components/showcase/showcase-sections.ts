import type { ComponentType } from "react";
import {
  ActionGridCard,
  ActivityFeedCard,
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
  ProjectsTableCard,
  ReliabilityCard,
  SettingsCard,
  StatesCard,
  TableCard,
  TeamCard,
  ThemeCard,
  TrafficCard,
  TypographyCard,
} from "@/components/showcase/showcase-cards";

type ComponentShowcaseSection = {
  title: string;
  description: string;
  items: Array<ComponentType>;
};

export const COMPONENT_SECTIONS: Array<ComponentShowcaseSection> = [
  {
    title: "System",
    description: "Tokens, type, navigation, states, and core controls.",
    items: [
      ThemeCard,
      TypographyCard,
      NavigationCard,
      StatesCard,
      ControlsCard,
      ActionGridCard,
    ],
  },
  {
    title: "Workflows",
    description: "Commands, forms, authentication, settings, and feedback.",
    items: [
      CommandCard,
      FormCard,
      AuthCard,
      SettingsCard,
      AlertCard,
      FeedbackCard,
    ],
  },
  {
    title: "Operations",
    description: "Reliability, deployments, traffic, config, and activity.",
    items: [
      ReliabilityCard,
      TrafficCard,
      DeploymentCard,
      EnvironmentCard,
      ActivityFeedCard,
      ProjectsTableCard,
    ],
  },
  {
    title: "Data surfaces",
    description: "Tables, teams, empty states, calendars, and plans.",
    items: [
      TeamCard,
      BrowserShareCard,
      TableCard,
      CalendarCard,
      PlanCard,
      EmptyCard,
    ],
  },
];

export const COMPONENT_COUNT = COMPONENT_SECTIONS.reduce(
  (count, section) => count + section.items.length,
  0,
);
