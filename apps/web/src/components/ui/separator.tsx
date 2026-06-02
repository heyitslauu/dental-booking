import * as React from "react";
import { cn } from "../../lib/utils";

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      className={cn(
        "shrink-0 bg-zinc-200",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      ref={ref}
      role="separator"
      {...props}
    />
  )
);

Separator.displayName = "Separator";
