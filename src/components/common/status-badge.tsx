import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  archived: "Archived",
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  in_progress: "bg-info/15 text-info",
  completed: "bg-success/15 text-success",
  archived: "bg-secondary text-secondary-foreground",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1.5 rounded-full border-0 px-2 py-0.5 text-[11px] font-medium",
        STATUS_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {STATUS_LABELS[status]}
    </Badge>
  );
}