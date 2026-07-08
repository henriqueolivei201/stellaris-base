import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsLeft, ChevronsRight, Command } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_ITEMS } from "@/components/navigation/nav-items";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { UserMenu } from "@/components/navigation/user-menu";
import { useSidebarStore } from "@/contexts/sidebar-store";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SidebarProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function Sidebar({ variant = "desktop", onNavigate }: SidebarProps) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isDesktop = variant === "desktop";
  const isCollapsed = isDesktop && collapsed;

  return (
    <TooltipProvider delayDuration={80}>
      <aside
        aria-label="Primary"
        className={cn(
          "flex h-full flex-col bg-sidebar text-sidebar-foreground",
          "border-r border-sidebar-border",
          "transition-[width] duration-300 ease-in-out",
          isDesktop ? (isCollapsed ? "w-[68px]" : "w-[248px]") : "w-full",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center gap-2.5 px-3",
            isCollapsed && "justify-center px-0",
          )}
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Command className="size-4" />
          </div>
          {!isCollapsed ? (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold tracking-tight">
                {APP_NAME}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {APP_TAGLINE}
              </span>
            </div>
          ) : null}
        </div>

        <Separator className="bg-sidebar-border" />

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              const link = (
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium",
                    "transition-all duration-200 ease-in-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 h-5 w-[2px] rounded-r-full bg-primary transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                  <Icon className="size-4 shrink-0" />
                  {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
                </Link>
              );

              return (
                <li key={item.to}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <Separator className="bg-sidebar-border" />

        <div
          className={cn(
            "flex items-center gap-2 px-2 py-2.5",
            isCollapsed && "flex-col",
          )}
        >
          <ThemeToggle />
          <div className={cn("flex-1", isCollapsed && "hidden")} />
          <UserMenu />
          {isDesktop ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleCollapsed}
              className="size-8"
            >
              {isCollapsed ? (
                <ChevronsRight className="size-4" />
              ) : (
                <ChevronsLeft className="size-4" />
              )}
            </Button>
          ) : null}
        </div>
      </aside>
    </TooltipProvider>
  );
}