import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ContentCard({
  title,
  description,
  actions,
  children,
  footer,
  className,
  interactive = false,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-0 overflow-hidden rounded-xl border-border bg-card shadow-sm",
        "transition-all duration-300 ease-in-out",
        interactive &&
          "cursor-pointer hover:scale-[1.005] hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {title || actions ? (
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
          <div className="min-w-0 space-y-1">
            {title ? (
              <CardTitle className="text-sm font-semibold tracking-tight">
                {title}
              </CardTitle>
            ) : null}
            {description ? (
              <CardDescription className="text-xs text-muted-foreground">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-1">{actions}</div>
          ) : null}
        </CardHeader>
      ) : null}
      {children ? <CardContent className="pt-0">{children}</CardContent> : null}
      {footer ? (
        <div className="mt-auto border-t border-border px-6 py-3 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </Card>
  );
}