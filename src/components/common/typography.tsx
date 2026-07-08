import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={cn("text-2xl font-semibold tracking-tight sm:text-3xl", className)}>
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-base font-semibold tracking-tight", className)}>{children}</h2>;
}

export function Muted({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Numeric({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-2xl font-semibold tabular-nums tracking-tight",
        className,
      )}
    >
      {children}
    </span>
  );
}