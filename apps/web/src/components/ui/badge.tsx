import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "destructive" | "muted" | "warning";
};

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-primary/20 bg-primary/10 text-primary",
  destructive: "border-destructive/25 bg-destructive/10 text-destructive",
  muted: "border-border bg-surface text-muted-foreground",
  success: "border-emerald-600/25 bg-emerald-600/10 text-emerald-700",
  warning: "border-primary/25 bg-primary/10 text-primary",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
