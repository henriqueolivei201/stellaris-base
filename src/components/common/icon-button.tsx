import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, "size"> {
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, variant = "ghost", ...props }, ref) {
    return (
      <Button
        ref={ref}
        size="icon"
        variant={variant}
        className={cn("size-9", className)}
        {...props}
      />
    );
  },
);