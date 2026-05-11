import { DEFAULT_THEME_SELECTION } from "@/lib/theme-generator/generator";
import type { ThemeSelection } from "@/lib/theme-generator/types";

export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  selection: ThemeSelection;
}

export type ThemeTemplateGroup = {
  name: string;
  templates: Array<ThemeTemplate>;
};

type TemplateInput = Partial<ThemeSelection> & {
  name: string;
  swatches: [string, string, string, string, string];
  chartColors?: [string, string, string, string, string];
};

type TemplateFinish = Partial<
  Pick<
    ThemeSelection,
    | "additionalStatesEnabled"
    | "successScale"
    | "customSuccessEnabled"
    | "customSuccessColor"
    | "warningScale"
    | "customWarningEnabled"
    | "customWarningColor"
    | "infoScale"
    | "customInfoEnabled"
    | "customInfoColor"
    | "radiusScale"
    | "shadowScale"
    | "customShadowEnabled"
    | "customShadowColor"
    | "shadowOpacity"
    | "shadowBlur"
    | "shadowSpread"
    | "shadowOffsetX"
    | "shadowOffsetY"
    | "trackingNormal"
    | "spacing"
    | "headingFont"
    | "sansFont"
    | "monoFont"
    | "chartStrategy"
  >
>;

const SOFT_PRODUCT_FINISH = {
  additionalStatesEnabled: true,
  successScale: "green",
  warningScale: "amber",
  infoScale: "sky",
  radiusScale: "large",
  shadowOpacity: 0.12,
  shadowBlur: 14,
  shadowSpread: -4,
  shadowOffsetY: 8,
  headingFont: "manrope",
  sansFont: "inter",
  monoFont: "jetbrains-mono",
} satisfies TemplateFinish;

const SHARP_PRODUCT_FINISH = {
  additionalStatesEnabled: true,
  successScale: "jade",
  warningScale: "amber",
  infoScale: "blue",
  radiusScale: "small",
  shadowOpacity: 0.08,
  shadowBlur: 8,
  shadowSpread: -2,
  shadowOffsetY: 4,
  headingFont: "geist",
  sansFont: "geist",
  monoFont: "jetbrains-mono",
} satisfies TemplateFinish;

const EDITORIAL_FINISH = {
  additionalStatesEnabled: true,
  successScale: "green",
  warningScale: "amber",
  infoScale: "blue",
  radiusScale: "small",
  shadowOpacity: 0.07,
  shadowBlur: 10,
  shadowSpread: -3,
  shadowOffsetY: 5,
  headingFont: "source-serif-4",
  sansFont: "open-sans",
  monoFont: "source-code-pro",
} satisfies TemplateFinish;

const DATA_DENSE_FINISH = {
  additionalStatesEnabled: true,
  successScale: "teal",
  warningScale: "amber",
  infoScale: "cyan",
  radiusScale: "medium",
  shadowOpacity: 0.1,
  shadowBlur: 6,
  shadowSpread: -1,
  shadowOffsetY: 3,
  headingFont: "space-grotesk",
  sansFont: "inter",
  monoFont: "jetbrains-mono",
} satisfies TemplateFinish;

const CONTENT_FINISH = {
  additionalStatesEnabled: true,
  successScale: "green",
  warningScale: "yellow",
  infoScale: "indigo",
  radiusScale: "medium",
  shadowOpacity: 0.11,
  shadowBlur: 18,
  shadowSpread: -6,
  shadowOffsetY: 10,
  headingFont: "space-grotesk",
  sansFont: "manrope",
  monoFont: "roboto-mono",
} satisfies TemplateFinish;

const PLAYFUL_FINISH = {
  additionalStatesEnabled: true,
  successScale: "grass",
  warningScale: "amber",
  infoScale: "cyan",
  radiusScale: "large",
  shadowOpacity: 0.16,
  shadowBlur: 20,
  shadowSpread: -5,
  shadowOffsetY: 12,
  headingFont: "space-grotesk",
  sansFont: "manrope",
  monoFont: "jetbrains-mono",
} satisfies TemplateFinish;

const FORMAL_FINISH = {
  additionalStatesEnabled: true,
  successScale: "jade",
  warningScale: "amber",
  infoScale: "blue",
  radiusScale: "medium",
  shadowOpacity: 0.08,
  shadowBlur: 7,
  shadowSpread: -2,
  shadowOffsetY: 3,
  headingFont: "source-serif-4",
  sansFont: "inter",
  monoFont: "source-code-pro",
} satisfies TemplateFinish;

const INDUSTRIAL_FINISH = {
  additionalStatesEnabled: true,
  successScale: "green",
  warningScale: "yellow",
  infoScale: "sky",
  radiusScale: "small",
  shadowOpacity: 0.13,
  shadowBlur: 5,
  shadowSpread: 0,
  shadowOffsetY: 2,
  headingFont: "roboto",
  sansFont: "roboto",
  monoFont: "roboto-mono",
} satisfies TemplateFinish;

const TEMPLATE_FINISHES: Record<string, TemplateFinish> = {
  Twitter: SOFT_PRODUCT_FINISH,
  Facebook: SOFT_PRODUCT_FINISH,
  Instagram: PLAYFUL_FINISH,
  LinkedIn: SHARP_PRODUCT_FINISH,
  Discord: PLAYFUL_FINISH,
  WhatsApp: SOFT_PRODUCT_FINISH,
  Tesla: SHARP_PRODUCT_FINISH,
  Spotify: CONTENT_FINISH,
  Netflix: CONTENT_FINISH,
  Airbnb: SOFT_PRODUCT_FINISH,
  Vercel: SHARP_PRODUCT_FINISH,
  GitHub: SHARP_PRODUCT_FINISH,
  Slack: SOFT_PRODUCT_FINISH,
  "Model Lab": DATA_DENSE_FINISH,
  "Vector Search": DATA_DENSE_FINISH,
  "Analytics Studio": DATA_DENSE_FINISH,
  Observability: DATA_DENSE_FINISH,
  Calendar: SOFT_PRODUCT_FINISH,
  "Task Board": SOFT_PRODUCT_FINISH,
  "Docs Suite": EDITORIAL_FINISH,
  "Workflow Ops": SHARP_PRODUCT_FINISH,
  Investment: FORMAL_FINISH,
  Banking: FORMAL_FINISH,
  Crypto: DATA_DENSE_FINISH,
  Insurance: FORMAL_FINISH,
  Marketplace: SOFT_PRODUCT_FINISH,
  "Luxury Retail": EDITORIAL_FINISH,
  Grocery: PLAYFUL_FINISH,
  Payments: SHARP_PRODUCT_FINISH,
  Classroom: PLAYFUL_FINISH,
  University: FORMAL_FINISH,
  "Language App": PLAYFUL_FINISH,
  Library: EDITORIAL_FINISH,
  Restaurant: EDITORIAL_FINISH,
  Coffee: EDITORIAL_FINISH,
  Hotel: FORMAL_FINISH,
  Bakery: PLAYFUL_FINISH,
  Airline: SHARP_PRODUCT_FINISH,
  "City Guide": DATA_DENSE_FINISH,
  Resort: SOFT_PRODUCT_FINISH,
  Transit: SHARP_PRODUCT_FINISH,
  Streaming: CONTENT_FINISH,
  Music: CONTENT_FINISH,
  Podcast: CONTENT_FINISH,
  Newsroom: EDITORIAL_FINISH,
  Arcade: PLAYFUL_FINISH,
  Esports: SHARP_PRODUCT_FINISH,
  Fantasy: EDITORIAL_FINISH,
  "Sci-Fi": DATA_DENSE_FINISH,
  Civic: FORMAL_FINISH,
  Nonprofit: SOFT_PRODUCT_FINISH,
  Emergency: SHARP_PRODUCT_FINISH,
  Museum: EDITORIAL_FINISH,
  Logistics: INDUSTRIAL_FINISH,
  Manufacturing: INDUSTRIAL_FINISH,
  Energy: INDUSTRIAL_FINISH,
  Construction: INDUSTRIAL_FINISH,
  Forest: EDITORIAL_FINISH,
  Ocean: SOFT_PRODUCT_FINISH,
  Sunset: PLAYFUL_FINISH,
  "Northern Lights": PLAYFUL_FINISH,
  Editorial: EDITORIAL_FINISH,
  Fintech: DATA_DENSE_FINISH,
  Healthcare: SOFT_PRODUCT_FINISH,
  Minimal: SHARP_PRODUCT_FINISH,
};

function template({
  name,
  swatches,
  baseScale = "slate",
  customBaseEnabled = false,
  customBaseColor = "",
  primaryScale = "indigo",
  customPrimaryEnabled = true,
  customPrimaryColor,
  destructiveScale = "red",
  customDestructiveEnabled = false,
  customDestructiveColor = "",
  accentStrategy = "primary",
  customAccentEnabled = false,
  customAccentColor = "",
  chartStrategy = "multicolor",
  chartScales = DEFAULT_THEME_SELECTION.chartScales,
  customChartColorEnabled = [true, true, true, true, true],
  chartColors = swatches,
  customChartColors = chartColors,
  ...selectionOverrides
}: TemplateInput): ThemeSelection {
  const finish = TEMPLATE_FINISHES[name] ?? SOFT_PRODUCT_FINISH;

  return {
    ...DEFAULT_THEME_SELECTION,
    ...finish,
    ...selectionOverrides,
    name,
    baseScale,
    customBaseEnabled,
    customBaseColor,
    primaryScale,
    customPrimaryEnabled,
    customPrimaryColor: customPrimaryColor ?? swatches[0],
    destructiveScale,
    customDestructiveEnabled,
    customDestructiveColor,
    accentStrategy,
    customAccentEnabled,
    customAccentColor,
    chartStrategy,
    chartScales,
    customChartColorEnabled,
    customChartColors,
  };
}

export const THEME_TEMPLATE_GROUPS: Array<ThemeTemplateGroup> = [
  {
    name: "Defaults",
    templates: [
      {
        id: "shadcn-default",
        name: "Default",
        description: "Black and white baseline matching shadcn/ui defaults.",
        category: "Defaults",
        selection: {
          ...DEFAULT_THEME_SELECTION,
          name: "Default",
        },
      },
    ],
  },
  {
    name: "Social Media",
    templates: [
      {
        id: "twitter",
        name: "Twitter",
        description: "Clear blue primary with energetic social charts.",
        category: "Social Media",
        selection: template({
          name: "Twitter",
          swatches: ["#1d9bf0", "#00ba7c", "#ffd400", "#f91880", "#7856ff"],
          baseScale: "slate",
          customPrimaryColor: "#1d9bf0",
        }),
      },
      {
        id: "facebook",
        name: "Facebook",
        description: "Classic blue with trustworthy product accents.",
        category: "Social Media",
        selection: template({
          name: "Facebook",
          swatches: ["#1877f2", "#42b72a", "#f7b928", "#f02849", "#8a3ffc"],
          baseScale: "gray",
          customPrimaryColor: "#1877f2",
        }),
      },
      {
        id: "instagram",
        name: "Instagram",
        description: "Warm magenta core with gradient-inspired accents.",
        category: "Social Media",
        selection: template({
          name: "Instagram",
          swatches: ["#e4405f", "#f77737", "#ffdc80", "#833ab4", "#405de6"],
          baseScale: "mauve",
          primaryScale: "pink",
          customPrimaryColor: "#e4405f",
        }),
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        description: "Professional blue with calm business accents.",
        category: "Social Media",
        selection: template({
          name: "LinkedIn",
          swatches: ["#0a66c2", "#057642", "#915907", "#c37d16", "#5e5ce6"],
          baseScale: "slate",
          customPrimaryColor: "#0a66c2",
        }),
      },
      {
        id: "discord",
        name: "Discord",
        description: "Vivid blurple with expressive community colors.",
        category: "Social Media",
        selection: template({
          name: "Discord",
          swatches: ["#5865f2", "#57f287", "#fee75c", "#eb459e", "#ed4245"],
          baseScale: "mauve",
          customPrimaryColor: "#5865f2",
        }),
      },
      {
        id: "whatsapp",
        name: "WhatsApp",
        description: "Fresh messaging green balanced with utility colors.",
        category: "Social Media",
        selection: template({
          name: "WhatsApp",
          swatches: ["#25d366", "#128c7e", "#34b7f1", "#f7c948", "#ea4335"],
          baseScale: "sage",
          primaryScale: "green",
          customPrimaryColor: "#25d366",
        }),
      },
    ],
  },
  {
    name: "Companies",
    templates: [
      {
        id: "tesla",
        name: "Tesla",
        description: "Sharp red primary on a graphite product surface.",
        category: "Companies",
        selection: template({
          name: "Tesla",
          swatches: ["#e82127", "#171a20", "#5c5e62", "#3e6ae1", "#f2c94c"],
          baseScale: "slate",
          primaryScale: "red",
          customPrimaryColor: "#e82127",
        }),
      },
      {
        id: "spotify",
        name: "Spotify",
        description: "Music green with strong dark-mode contrast.",
        category: "Companies",
        selection: template({
          name: "Spotify",
          swatches: ["#1db954", "#191414", "#1ed760", "#ffffff", "#b3b3b3"],
          chartColors: ["#1db954", "#1ed760", "#10b981", "#0ea5e9", "#a3a3a3"],
          baseScale: "sage",
          primaryScale: "green",
          customPrimaryColor: "#1db954",
        }),
      },
      {
        id: "netflix",
        name: "Netflix",
        description: "Cinematic red with restrained slate neutrals.",
        category: "Companies",
        selection: template({
          name: "Netflix",
          swatches: ["#e50914", "#221f1f", "#b81d24", "#f5f5f1", "#564d4d"],
          chartColors: ["#e50914", "#b81d24", "#831010", "#f59e0b", "#564d4d"],
          baseScale: "mauve",
          primaryScale: "red",
          customPrimaryColor: "#e50914",
        }),
      },
      {
        id: "airbnb",
        name: "Airbnb",
        description: "Coral hospitality palette with soft contrast.",
        category: "Companies",
        selection: template({
          name: "Airbnb",
          swatches: ["#ff385c", "#00a699", "#fc642d", "#ffb400", "#767676"],
          baseScale: "sand",
          primaryScale: "ruby",
          customPrimaryColor: "#ff385c",
        }),
      },
      {
        id: "vercel",
        name: "Vercel",
        description:
          "Minimal black-and-white product system with vivid deploy accents.",
        category: "Companies",
        selection: template({
          name: "Vercel",
          swatches: ["#000000", "#ffffff", "#0070f3", "#7928ca", "#ff0080"],
          chartColors: ["#000000", "#0070f3", "#7928ca", "#ff0080", "#ff4d4f"],
          baseScale: "gray",
          primaryScale: "gray",
          customPrimaryColor: "#000000",
          chartScales: ["gray", "blue", "purple", "pink", "red"],
        }),
      },
      {
        id: "github",
        name: "GitHub",
        description: "Developer neutral base with blue and green accents.",
        category: "Companies",
        selection: template({
          name: "GitHub",
          swatches: ["#24292f", "#0969da", "#1a7f37", "#bf8700", "#cf222e"],
          baseScale: "gray",
          primaryScale: "slate",
          customPrimaryColor: "#24292f",
        }),
      },
      {
        id: "slack",
        name: "Slack",
        description: "Workplace purple supported by Slack-like accents.",
        category: "Companies",
        selection: template({
          name: "Slack",
          swatches: ["#611f69", "#36c5f0", "#2eb67d", "#ecb22e", "#e01e5a"],
          baseScale: "mauve",
          primaryScale: "purple",
          customPrimaryColor: "#611f69",
        }),
      },
    ],
  },
  {
    name: "AI & Data",
    templates: [
      {
        id: "model-lab",
        name: "Model Lab",
        description: "Clean research UI with signal blue and compute green.",
        category: "AI & Data",
        selection: template({
          name: "Model Lab",
          swatches: ["#0f172a", "#2563eb", "#10b981", "#f59e0b", "#e11d48"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#2563eb",
        }),
      },
      {
        id: "vector-search",
        name: "Vector Search",
        description: "Technical teal palette with crisp query highlights.",
        category: "AI & Data",
        selection: template({
          name: "Vector Search",
          swatches: ["#0f766e", "#155e75", "#7c3aed", "#ca8a04", "#334155"],
          baseScale: "sage",
          primaryScale: "teal",
          customPrimaryColor: "#0f766e",
        }),
      },
      {
        id: "analytics-studio",
        name: "Analytics Studio",
        description: "Executive analytics colors for dense dashboards.",
        category: "AI & Data",
        selection: template({
          name: "Analytics Studio",
          swatches: ["#1d4ed8", "#059669", "#d97706", "#7c3aed", "#dc2626"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#1d4ed8",
        }),
      },
      {
        id: "observability",
        name: "Observability",
        description: "Incident-ready contrast with latency and health cues.",
        category: "AI & Data",
        selection: template({
          name: "Observability",
          swatches: ["#111827", "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444"],
          baseScale: "gray",
          primaryScale: "sky",
          customPrimaryColor: "#0ea5e9",
        }),
      },
    ],
  },
  {
    name: "Productivity",
    templates: [
      {
        id: "calendar",
        name: "Calendar",
        description: "Schedule-first blue with warm event categories.",
        category: "Productivity",
        selection: template({
          name: "Calendar",
          swatches: ["#2563eb", "#14b8a6", "#f97316", "#a855f7", "#ef4444"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#2563eb",
        }),
      },
      {
        id: "task-board",
        name: "Task Board",
        description: "Practical work palette for planning and delivery.",
        category: "Productivity",
        selection: template({
          name: "Task Board",
          swatches: ["#4f46e5", "#0891b2", "#16a34a", "#f59e0b", "#be123c"],
          baseScale: "mauve",
          primaryScale: "indigo",
          customPrimaryColor: "#4f46e5",
        }),
      },
      {
        id: "docs-suite",
        name: "Docs Suite",
        description: "Readable document neutrals with collaborative accents.",
        category: "Productivity",
        selection: template({
          name: "Docs Suite",
          swatches: ["#334155", "#2563eb", "#16a34a", "#d97706", "#7c3aed"],
          baseScale: "slate",
          primaryScale: "slate",
          customPrimaryColor: "#334155",
        }),
      },
      {
        id: "workflow-ops",
        name: "Workflow Ops",
        description: "Operational palette for queues, approvals, and states.",
        category: "Productivity",
        selection: template({
          name: "Workflow Ops",
          swatches: ["#0f766e", "#475569", "#65a30d", "#ca8a04", "#dc2626"],
          baseScale: "sage",
          primaryScale: "teal",
          customPrimaryColor: "#0f766e",
        }),
      },
    ],
  },
  {
    name: "Finance",
    templates: [
      {
        id: "investment",
        name: "Investment",
        description: "Trustworthy navy with gain, risk, and signal colors.",
        category: "Finance",
        selection: template({
          name: "Investment",
          swatches: ["#1e3a8a", "#047857", "#b45309", "#7c3aed", "#b91c1c"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#1e3a8a",
        }),
      },
      {
        id: "banking",
        name: "Banking",
        description: "Formal blue-green palette for account surfaces.",
        category: "Finance",
        selection: template({
          name: "Banking",
          swatches: ["#075985", "#0f766e", "#64748b", "#ca8a04", "#dc2626"],
          baseScale: "sage",
          primaryScale: "sky",
          customPrimaryColor: "#075985",
        }),
      },
      {
        id: "crypto",
        name: "Crypto",
        description: "High-contrast market UI with electric asset accents.",
        category: "Finance",
        selection: template({
          name: "Crypto",
          swatches: ["#18181b", "#f59e0b", "#22c55e", "#06b6d4", "#8b5cf6"],
          baseScale: "mauve",
          primaryScale: "amber",
          customPrimaryColor: "#f59e0b",
        }),
      },
      {
        id: "insurance",
        name: "Insurance",
        description: "Stable service colors with calm policy indicators.",
        category: "Finance",
        selection: template({
          name: "Insurance",
          swatches: ["#1d4ed8", "#0891b2", "#16a34a", "#9333ea", "#dc2626"],
          baseScale: "sage",
          primaryScale: "blue",
          customPrimaryColor: "#1d4ed8",
        }),
      },
    ],
  },
  {
    name: "Commerce",
    templates: [
      {
        id: "marketplace",
        name: "Marketplace",
        description: "Retail palette for listings, deals, and trust signals.",
        category: "Commerce",
        selection: template({
          name: "Marketplace",
          swatches: ["#ea580c", "#0d9488", "#2563eb", "#eab308", "#db2777"],
          baseScale: "sand",
          primaryScale: "orange",
          customPrimaryColor: "#ea580c",
        }),
      },
      {
        id: "luxury-retail",
        name: "Luxury Retail",
        description: "Deep ink, gold, and berry tones for premium catalogs.",
        category: "Commerce",
        selection: template({
          name: "Luxury Retail",
          swatches: ["#111827", "#b45309", "#7c2d12", "#be123c", "#57534e"],
          baseScale: "sand",
          primaryScale: "amber",
          customPrimaryColor: "#b45309",
          accentStrategy: "base",
        }),
      },
      {
        id: "grocery",
        name: "Grocery",
        description: "Fresh category colors for everyday shopping flows.",
        category: "Commerce",
        selection: template({
          name: "Grocery",
          swatches: ["#16a34a", "#65a30d", "#f97316", "#0ea5e9", "#dc2626"],
          baseScale: "sage",
          primaryScale: "green",
          customPrimaryColor: "#16a34a",
        }),
      },
      {
        id: "payments",
        name: "Payments",
        description: "Fast checkout palette with secure blue emphasis.",
        category: "Commerce",
        selection: template({
          name: "Payments",
          swatches: ["#2563eb", "#0f766e", "#16a34a", "#ca8a04", "#dc2626"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#2563eb",
        }),
      },
    ],
  },
  {
    name: "Education",
    templates: [
      {
        id: "classroom",
        name: "Classroom",
        description: "Friendly learning colors with clear progress states.",
        category: "Education",
        selection: template({
          name: "Classroom",
          swatches: ["#2563eb", "#16a34a", "#f59e0b", "#db2777", "#7c3aed"],
          baseScale: "sand",
          primaryScale: "blue",
          customPrimaryColor: "#2563eb",
        }),
      },
      {
        id: "university",
        name: "University",
        description: "Academic navy with institutional secondary colors.",
        category: "Education",
        selection: template({
          name: "University",
          swatches: ["#1e3a8a", "#7f1d1d", "#b45309", "#334155", "#047857"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#1e3a8a",
        }),
      },
      {
        id: "language-app",
        name: "Language App",
        description: "Bright lesson palette for streaks and practice modes.",
        category: "Education",
        selection: template({
          name: "Language App",
          swatches: ["#22c55e", "#3b82f6", "#f97316", "#ec4899", "#8b5cf6"],
          baseScale: "sage",
          primaryScale: "green",
          customPrimaryColor: "#22c55e",
        }),
      },
      {
        id: "library",
        name: "Library",
        description: "Quiet reading palette with catalog-friendly contrast.",
        category: "Education",
        selection: template({
          name: "Library",
          swatches: ["#365314", "#854d0e", "#334155", "#0f766e", "#be123c"],
          baseScale: "olive",
          primaryScale: "lime",
          customPrimaryColor: "#365314",
        }),
      },
    ],
  },
  {
    name: "Food & Hospitality",
    templates: [
      {
        id: "restaurant",
        name: "Restaurant",
        description: "Appetizing tomato and herb palette for menus.",
        category: "Food & Hospitality",
        selection: template({
          name: "Restaurant",
          swatches: ["#dc2626", "#16a34a", "#f97316", "#ca8a04", "#7c2d12"],
          baseScale: "sand",
          primaryScale: "red",
          customPrimaryColor: "#dc2626",
        }),
      },
      {
        id: "coffee",
        name: "Coffee",
        description: "Roasted neutrals with warm service accents.",
        category: "Food & Hospitality",
        selection: template({
          name: "Coffee",
          swatches: ["#7c2d12", "#a16207", "#57534e", "#15803d", "#be123c"],
          baseScale: "sand",
          primaryScale: "brown",
          customPrimaryColor: "#7c2d12",
        }),
      },
      {
        id: "hotel",
        name: "Hotel",
        description: "Polished concierge colors for booking and service.",
        category: "Food & Hospitality",
        selection: template({
          name: "Hotel",
          swatches: ["#0f172a", "#b45309", "#0891b2", "#4f46e5", "#be123c"],
          baseScale: "slate",
          primaryScale: "amber",
          customPrimaryColor: "#b45309",
        }),
      },
      {
        id: "bakery",
        name: "Bakery",
        description: "Warm pastry tones with fruit and mint accents.",
        category: "Food & Hospitality",
        selection: template({
          name: "Bakery",
          swatches: ["#d97706", "#db2777", "#65a30d", "#0d9488", "#92400e"],
          baseScale: "sand",
          primaryScale: "amber",
          customPrimaryColor: "#d97706",
        }),
      },
    ],
  },
  {
    name: "Travel & Places",
    templates: [
      {
        id: "airline",
        name: "Airline",
        description: "Aviation blue with clear status and loyalty colors.",
        category: "Travel & Places",
        selection: template({
          name: "Airline",
          swatches: ["#0369a1", "#0284c7", "#0f766e", "#f59e0b", "#dc2626"],
          baseScale: "slate",
          primaryScale: "sky",
          customPrimaryColor: "#0369a1",
        }),
      },
      {
        id: "city-guide",
        name: "City Guide",
        description: "Urban wayfinding palette for maps and venues.",
        category: "Travel & Places",
        selection: template({
          name: "City Guide",
          swatches: ["#334155", "#2563eb", "#ea580c", "#16a34a", "#db2777"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#2563eb",
        }),
      },
      {
        id: "resort",
        name: "Resort",
        description: "Coastal booking colors with sunlit service accents.",
        category: "Travel & Places",
        selection: template({
          name: "Resort",
          swatches: ["#0e7490", "#14b8a6", "#f59e0b", "#84cc16", "#f43f5e"],
          baseScale: "sage",
          primaryScale: "cyan",
          customPrimaryColor: "#0e7490",
        }),
      },
      {
        id: "transit",
        name: "Transit",
        description: "System colors for routes, alerts, and schedules.",
        category: "Travel & Places",
        selection: template({
          name: "Transit",
          swatches: ["#1d4ed8", "#16a34a", "#f97316", "#9333ea", "#dc2626"],
          baseScale: "gray",
          primaryScale: "blue",
          customPrimaryColor: "#1d4ed8",
        }),
      },
    ],
  },
  {
    name: "Media & Entertainment",
    templates: [
      {
        id: "streaming",
        name: "Streaming",
        description: "Cinematic dark palette with vivid content rails.",
        category: "Media & Entertainment",
        selection: template({
          name: "Streaming",
          swatches: ["#18181b", "#e11d48", "#7c3aed", "#2563eb", "#f59e0b"],
          baseScale: "mauve",
          primaryScale: "ruby",
          customPrimaryColor: "#e11d48",
        }),
      },
      {
        id: "music",
        name: "Music",
        description: "Stage-ready accents for playlists and discovery.",
        category: "Media & Entertainment",
        selection: template({
          name: "Music",
          swatches: ["#7c3aed", "#db2777", "#06b6d4", "#22c55e", "#f97316"],
          baseScale: "mauve",
          primaryScale: "violet",
          customPrimaryColor: "#7c3aed",
        }),
      },
      {
        id: "podcast",
        name: "Podcast",
        description: "Voice-first purple with editorial support colors.",
        category: "Media & Entertainment",
        selection: template({
          name: "Podcast",
          swatches: ["#6d28d9", "#0891b2", "#f59e0b", "#16a34a", "#dc2626"],
          baseScale: "mauve",
          primaryScale: "violet",
          customPrimaryColor: "#6d28d9",
        }),
      },
      {
        id: "newsroom",
        name: "Newsroom",
        description: "Editorial red, ink, and section colors for publishing.",
        category: "Media & Entertainment",
        selection: template({
          name: "Newsroom",
          swatches: ["#b91c1c", "#111827", "#2563eb", "#ca8a04", "#0f766e"],
          baseScale: "gray",
          primaryScale: "red",
          customPrimaryColor: "#b91c1c",
        }),
      },
    ],
  },
  {
    name: "Gaming",
    templates: [
      {
        id: "arcade",
        name: "Arcade",
        description: "Bright action colors for playful interactive screens.",
        category: "Gaming",
        selection: template({
          name: "Arcade",
          swatches: ["#db2777", "#7c3aed", "#06b6d4", "#f59e0b", "#22c55e"],
          baseScale: "mauve",
          primaryScale: "pink",
          customPrimaryColor: "#db2777",
        }),
      },
      {
        id: "esports",
        name: "Esports",
        description: "Competitive slate with team and status colors.",
        category: "Gaming",
        selection: template({
          name: "Esports",
          swatches: ["#111827", "#dc2626", "#2563eb", "#f59e0b", "#16a34a"],
          baseScale: "slate",
          primaryScale: "red",
          customPrimaryColor: "#dc2626",
        }),
      },
      {
        id: "fantasy",
        name: "Fantasy",
        description: "Story-rich jewel tones for inventory and quests.",
        category: "Gaming",
        selection: template({
          name: "Fantasy",
          swatches: ["#4c1d95", "#047857", "#b45309", "#be123c", "#1d4ed8"],
          baseScale: "mauve",
          primaryScale: "purple",
          customPrimaryColor: "#4c1d95",
        }),
      },
      {
        id: "sci-fi",
        name: "Sci-Fi",
        description: "Cool interface colors for systems and missions.",
        category: "Gaming",
        selection: template({
          name: "Sci-Fi",
          swatches: ["#0f172a", "#06b6d4", "#22d3ee", "#a3e635", "#8b5cf6"],
          baseScale: "slate",
          primaryScale: "cyan",
          customPrimaryColor: "#06b6d4",
        }),
      },
    ],
  },
  {
    name: "Public Sector",
    templates: [
      {
        id: "civic",
        name: "Civic",
        description: "Accessible government colors for services and forms.",
        category: "Public Sector",
        selection: template({
          name: "Civic",
          swatches: ["#1d4ed8", "#334155", "#047857", "#ca8a04", "#b91c1c"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#1d4ed8",
        }),
      },
      {
        id: "nonprofit",
        name: "Nonprofit",
        description: "Human-centered green and blue for mission dashboards.",
        category: "Public Sector",
        selection: template({
          name: "Nonprofit",
          swatches: ["#15803d", "#2563eb", "#f59e0b", "#db2777", "#64748b"],
          baseScale: "sage",
          primaryScale: "green",
          customPrimaryColor: "#15803d",
        }),
      },
      {
        id: "emergency",
        name: "Emergency",
        description: "High-clarity palette for alerts and response states.",
        category: "Public Sector",
        selection: template({
          name: "Emergency",
          swatches: ["#dc2626", "#f97316", "#2563eb", "#16a34a", "#111827"],
          baseScale: "gray",
          primaryScale: "red",
          customPrimaryColor: "#dc2626",
        }),
      },
      {
        id: "museum",
        name: "Museum",
        description: "Curatorial palette with archival neutrals and accents.",
        category: "Public Sector",
        selection: template({
          name: "Museum",
          swatches: ["#44403c", "#b45309", "#2563eb", "#be123c", "#047857"],
          baseScale: "sand",
          primaryScale: "bronze",
          customPrimaryColor: "#44403c",
        }),
      },
    ],
  },
  {
    name: "Industrial",
    templates: [
      {
        id: "logistics",
        name: "Logistics",
        description: "Route and warehouse colors for operational scanning.",
        category: "Industrial",
        selection: template({
          name: "Logistics",
          swatches: ["#334155", "#2563eb", "#f97316", "#16a34a", "#dc2626"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#2563eb",
        }),
      },
      {
        id: "manufacturing",
        name: "Manufacturing",
        description: "Shop-floor palette for machines, lots, and warnings.",
        category: "Industrial",
        selection: template({
          name: "Manufacturing",
          swatches: ["#475569", "#0f766e", "#ca8a04", "#ea580c", "#b91c1c"],
          baseScale: "slate",
          primaryScale: "teal",
          customPrimaryColor: "#0f766e",
        }),
      },
      {
        id: "energy",
        name: "Energy",
        description: "Grid monitoring colors for load and reliability.",
        category: "Industrial",
        selection: template({
          name: "Energy",
          swatches: ["#065f46", "#0284c7", "#eab308", "#f97316", "#dc2626"],
          baseScale: "sage",
          primaryScale: "green",
          customPrimaryColor: "#065f46",
        }),
      },
      {
        id: "construction",
        name: "Construction",
        description: "Field-ready colors for plans, crews, and risk.",
        category: "Industrial",
        selection: template({
          name: "Construction",
          swatches: ["#ca8a04", "#334155", "#ea580c", "#2563eb", "#b91c1c"],
          baseScale: "sand",
          primaryScale: "yellow",
          customPrimaryColor: "#ca8a04",
        }),
      },
    ],
  },
  {
    name: "Nature",
    templates: [
      {
        id: "forest",
        name: "Forest",
        description: "Deep green surfaces with moss and amber chart tones.",
        category: "Nature",
        selection: template({
          name: "Forest",
          swatches: ["#2f6f4e", "#7a9f35", "#b7a14a", "#8f5f3c", "#497d74"],
          baseScale: "olive",
          primaryScale: "green",
          customPrimaryColor: "#2f6f4e",
        }),
      },
      {
        id: "ocean",
        name: "Ocean",
        description: "Blue-green system for calm data-heavy layouts.",
        category: "Nature",
        selection: template({
          name: "Ocean",
          swatches: ["#0077b6", "#00b4d8", "#48cae4", "#90be6d", "#f9c74f"],
          baseScale: "sage",
          primaryScale: "blue",
          customPrimaryColor: "#0077b6",
        }),
      },
      {
        id: "sunset",
        name: "Sunset",
        description: "Warm orange primary with dusk chart colors.",
        category: "Nature",
        selection: template({
          name: "Sunset",
          swatches: ["#f97316", "#ef4444", "#eab308", "#8b5cf6", "#0ea5e9"],
          baseScale: "sand",
          primaryScale: "orange",
          customPrimaryColor: "#f97316",
        }),
      },
      {
        id: "northern-lights",
        name: "Northern Lights",
        description: "Cool aurora palette with teal, violet, and lime.",
        category: "Nature",
        selection: template({
          name: "Northern Lights",
          swatches: ["#14b8a6", "#22c55e", "#84cc16", "#8b5cf6", "#06b6d4"],
          baseScale: "sage",
          primaryScale: "teal",
          customPrimaryColor: "#14b8a6",
        }),
      },
    ],
  },
  {
    name: "Styles",
    templates: [
      {
        id: "editorial",
        name: "Editorial",
        description: "Ink-first neutral theme with measured accent color.",
        category: "Styles",
        selection: template({
          name: "Editorial",
          swatches: ["#111827", "#4b5563", "#9ca3af", "#b45309", "#be123c"],
          baseScale: "gray",
          primaryScale: "slate",
          customPrimaryColor: "#111827",
          accentStrategy: "base",
        }),
      },
      {
        id: "fintech",
        name: "Fintech",
        description: "Confident blue-green palette for dashboards.",
        category: "Styles",
        selection: template({
          name: "Fintech",
          swatches: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#6366f1"],
          baseScale: "slate",
          primaryScale: "blue",
          customPrimaryColor: "#2563eb",
        }),
      },
      {
        id: "healthcare",
        name: "Healthcare",
        description: "Clean clinical palette with green trust cues.",
        category: "Styles",
        selection: template({
          name: "Healthcare",
          swatches: ["#0891b2", "#16a34a", "#7c3aed", "#f59e0b", "#dc2626"],
          baseScale: "sage",
          primaryScale: "cyan",
          customPrimaryColor: "#0891b2",
        }),
      },
      {
        id: "minimal",
        name: "Minimal",
        description: "Quiet monochrome UI with subtle data colors.",
        category: "Styles",
        selection: template({
          name: "Minimal",
          swatches: ["#3f3f46", "#71717a", "#a1a1aa", "#0ea5e9", "#e11d48"],
          baseScale: "gray",
          primaryScale: "gray",
          customPrimaryColor: "#3f3f46",
          accentStrategy: "base",
        }),
      },
    ],
  },
];
