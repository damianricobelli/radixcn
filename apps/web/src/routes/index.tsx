import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing-page";

const HOME_TITLE = "Shadcn Themes from Radix Colors - Radixcn";
const HOME_DESCRIPTION =
  "Choose a Radix Color palette, keep the shadcn API, and generate better theme tokens for your components.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: HOME_TITLE,
      },
      {
        name: "description",
        content: HOME_DESCRIPTION,
      },
      {
        property: "og:title",
        content: HOME_TITLE,
      },
      {
        property: "og:description",
        content: HOME_DESCRIPTION,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: HOME_TITLE,
      },
      {
        name: "twitter:description",
        content: HOME_DESCRIPTION,
      },
    ],
  }),
  component: IndexRoute,
});

function IndexRoute() {
  return <LandingPage />;
}
