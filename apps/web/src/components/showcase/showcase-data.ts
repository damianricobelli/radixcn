import type { ChartConfig } from "@workspace/ui/components/chart";

export const trafficData = [
  { month: "Jan", desktop: 84, mobile: 42, api: 120 },
  { month: "Feb", desktop: 148, mobile: 92, api: 188 },
  { month: "Mar", desktop: 118, mobile: 68, api: 164 },
  { month: "Apr", desktop: 35, mobile: 88, api: 96 },
  { month: "May", desktop: 96, mobile: 70, api: 148 },
  { month: "Jun", desktop: 108, mobile: 74, api: 172 },
];

export const browserData = [
  { browser: "Chrome", visitors: 430, fill: "var(--chart-1)" },
  { browser: "Edge", visitors: 280, fill: "var(--chart-2)" },
  { browser: "Firefox", visitors: 160, fill: "var(--chart-3)" },
  { browser: "Safari", visitors: 65, fill: "var(--chart-4)" },
];

export const reliabilityData = [
  { day: "Mon", uptime: 99.93, latency: 142 },
  { day: "Tue", uptime: 99.96, latency: 136 },
  { day: "Wed", uptime: 99.91, latency: 151 },
  { day: "Thu", uptime: 99.98, latency: 128 },
  { day: "Fri", uptime: 99.95, latency: 132 },
  { day: "Sat", uptime: 99.99, latency: 118 },
  { day: "Sun", uptime: 99.97, latency: 124 },
];

export const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  api: { label: "API", color: "var(--chart-3)" },
  uptime: { label: "Uptime", color: "var(--chart-1)" },
  latency: { label: "Latency", color: "var(--chart-2)" },
  visitors: { label: "Visitors" },
  Chrome: { label: "Chrome", color: "var(--chart-1)" },
  Edge: { label: "Edge", color: "var(--chart-2)" },
  Firefox: { label: "Firefox", color: "var(--chart-3)" },
  Safari: { label: "Safari", color: "var(--chart-4)" },
} satisfies ChartConfig;
