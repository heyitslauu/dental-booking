import * as React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  outline:
    "border border-border bg-background text-foreground hover:bg-surface hover:text-primary",
  ghost: "text-foreground hover:bg-surface hover:text-primary"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";
