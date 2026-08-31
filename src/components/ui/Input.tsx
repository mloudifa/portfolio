"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-foreground placeholder:text-subtle transition-colors",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
          invalid ? "border-danger/60" : "border-border",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
