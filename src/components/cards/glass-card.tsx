import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden rounded-2xl p-5",
        "transition-all duration-300 ease-in-out hover:scale-[1.01]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-1/2 h-full opacity-60 blur-3xl"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}