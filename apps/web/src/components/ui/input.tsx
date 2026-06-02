import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";
