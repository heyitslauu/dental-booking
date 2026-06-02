import * as React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";
