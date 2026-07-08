import { Bell, Menu, Search } from "lucide-react";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { UserMenu } from "@/components/navigation/user-menu";
import { IconButton } from "@/components/common/icon-button";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/contexts/sidebar-store";

export function Header() {
  const openMobile = useSidebarStore((s) => s.setMobileOpen);

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-background/70 px-3 backdrop-blur-xl sm:px-4"
      role="banner"
    >
      <IconButton
        variant="ghost"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={() => openMobile(true)}
      >
        <Menu className="size-4" />
      </IconButton>

      <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
        <Breadcrumbs />
      </div>

      <div className="relative ml-auto hidden w-full max-w-sm items-center md:flex">
        <Search
          className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search…"
          aria-label="Search"
          className="h-9 pl-9 pr-14 text-sm"
        />
        <kbd className="pointer-events-none absolute right-2 hidden select-none items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>

      <IconButton variant="ghost" aria-label="Notifications">
        <Bell className="size-4" />
      </IconButton>
      <div className="lg:hidden">
        <UserMenu />
      </div>
    </header>
  );
}