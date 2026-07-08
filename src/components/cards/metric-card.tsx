import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Caption, Numeric } from "@/components/common/typography";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  delta?: number;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  hint,
  delta,
  icon,
  className,
}: MetricCardProps) {
  const trend =
    delta === undefined
      ? null
      : delta > 0
        ? { Icon: ArrowUpRight, className: "text-success" }
        : delta < 0
          ? { Icon: ArrowDownRight, className: "text-destructive" }
          : { Icon: Minus, className: "text-muted-foreground" };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm",
        "transition-all duration-300 ease-in-out hover:scale-[1.005] hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Caption>{label}</Caption>
        {icon ? (
          <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
            {icon}
          </div>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-3">
        <Numeric>{value}</Numeric>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
              trend.className,
            )}
          >
            <trend.Icon className="size-3.5" aria-hidden />
            {delta! > 0 ? "+" : ""}
            {delta}%
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}