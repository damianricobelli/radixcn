import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing-page";
import { pageSeo } from "@/lib/seo";

const HOME_TITLE = "Themes with Radix colors for shadcn/ui - Radixcn";
const HOME_DESCRIPTION =
  "Choose a Radix Color palette, keep the shadcn API, and generate better theme tokens for your components.";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageSeo({
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: "/",
      imageAlt: "Radixcn theme generator preview",
    }),
  }),
  component: IndexRoute,
});

function IndexRoute() {
  return <LandingPage />;
}
