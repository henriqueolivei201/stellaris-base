import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

import { NAV_ITEMS } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

function labelForPath(pathname: string): string {
  const match = NAV_ITEMS.find((i) => i.to === pathname);
  if (match) return match.label;
  if (pathname === "/") return "Dashboard";
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <Link
        to="/"
        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Home className="size-3.5" />
        <span className="sr-only sm:not-sr-only">Home</span>
      </Link>
      {!isHome ? (
        <>
          <ChevronRight className="size-3.5 shrink-0 opacity-50" />
          <span aria-current="page" className="truncate font-medium text-foreground">
            {labelForPath(pathname)}
          </span>
        </>
      ) : null}
    </nav>
  );
}