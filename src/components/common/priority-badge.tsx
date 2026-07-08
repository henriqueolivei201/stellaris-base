import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-muted text-muted-foreground ring-border",
  medium: "bg-info/10 text-info ring-info/20",
  high: "bg-warning/15 text-warning-foreground ring-warning/30 dark:text-warning",
  urgent: "bg-destructive/10 text-destructive ring-destructive/30",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md border-0 px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        PRIORITY_STYLES[priority],
      )}
    >
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}