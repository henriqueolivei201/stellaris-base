import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActionButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(
    { children, leadingIcon, trailingIcon, className, ...props },
    ref,
  ) {
    return (
      <Button ref={ref} className={cn("gap-2", className)} {...props}>
        {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
        <span className="truncate">{children}</span>
        {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
      </Button>
    );
  },
);