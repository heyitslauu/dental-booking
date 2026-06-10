import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export const Breadcrumb = ({
  ...props
}: React.ComponentPropsWithoutRef<"nav">) => (
  <nav aria-label="breadcrumb" {...props} />
);

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
      className,
    )}
    ref={ref}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li className={cn("inline-flex items-center gap-1.5", className)} ref={ref} {...props} />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, ...props }, ref) => (
  <a
    className={cn("transition-colors hover:text-foreground", className)}
    ref={ref}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    ref={ref}
    role="link"
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    role="presentation"
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
