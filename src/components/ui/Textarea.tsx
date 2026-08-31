"use client";

import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-subtle transition-colors resize-none",
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

Textarea.displayName = "Textarea";
