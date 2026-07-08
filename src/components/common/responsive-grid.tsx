import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Preset breakpoints keep grids consistent across the app without
 * dynamic Tailwind class strings (which Tailwind cannot statically
 * detect and would purge).
 */
type Cols = 1 | 2 | 3 | 4 | 6;

const BASE: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
};
const SM: Record<Cols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  6: "sm:grid-cols-6",
};
const LG: Record<Cols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
};
const XL: Record<Cols, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  6: "xl:grid-cols-6",
};

export function ResponsiveGrid({
  children,
  className,
  base = 1,
  sm,
  lg,
  xl,
  gap = "gap-4",
}: {
  children: ReactNode;
  className?: string;
  base?: Cols;
  sm?: Cols;
  lg?: Cols;
  xl?: Cols;
  gap?: string;
}) {
  return (
    <div
      className={cn(
        "grid",
        BASE[base],
        sm && SM[sm],
        lg && LG[lg],
        xl && XL[xl],
        gap,
        className,
      )}
    >
      {children}
    </div>
  );
}