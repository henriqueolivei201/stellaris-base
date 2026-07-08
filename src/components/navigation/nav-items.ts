import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { ROUTES, type RoutePath } from "@/lib/constants";

export interface NavItem {
  label: string;
  to: RoutePath;
  icon: LucideIcon;
  description?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", to: ROUTES.dashboard, icon: LayoutDashboard, description: "Overview" },
  { label: "Tasks", to: ROUTES.tasks, icon: ListChecks, description: "Register & manage" },
  { label: "Calendar", to: ROUTES.calendar, icon: CalendarDays, description: "Timeline" },
  { label: "Statistics", to: ROUTES.statistics, icon: BarChart3, description: "Insights" },
  { label: "Score", to: ROUTES.score, icon: Sparkles, description: "Progress" },
  { label: "Hall of Fame", to: ROUTES.hallOfFame, icon: Trophy, description: "Rankings" },
] as const;