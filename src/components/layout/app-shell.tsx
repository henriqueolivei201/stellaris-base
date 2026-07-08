import type { ReactNode } from "react";

import { Header } from "@/components/navigation/header";
import { Sidebar } from "@/components/navigation/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebarStore } from "@/contexts/sidebar-store";

export function AppShell({ children }: { children: ReactNode }) {
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  return (
    <div className="flex min-h-svh w-full bg-background text-foreground">
      <div className="sticky top-0 hidden h-svh shrink-0 lg:block">
        <Sidebar variant="desktop" />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[260px] border-r border-sidebar-border bg-sidebar p-0"
        >
          <Sidebar variant="mobile" onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main" className="flex-1 focus:outline-none" tabIndex={-1} role="main">
          {children}
        </main>
      </div>
    </div>
  );
}