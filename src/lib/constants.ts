export const APP_NAME = "Atlas";
export const APP_TAGLINE = "Personal Management System";

export const ROUTES = {
  dashboard: "/",
  tasks: "/tasks",
  calendar: "/calendar",
  statistics: "/statistics",
  score: "/score",
  hallOfFame: "/hall-of-fame",
  settings: "/settings",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const STORAGE_KEYS = {
  theme: "atlas.theme",
  sidebar: "atlas.sidebar",
} as const;

export const MOCK_LATENCY_MS = 350;