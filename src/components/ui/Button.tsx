"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white font-semibold shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-accent)_65%,transparent)] hover:bg-accent-hover hover:shadow-[0_8px_28px_-6px_color-mix(in_srgb,var(--color-accent)_75%,transparent)] active:scale-[0.98]",
  secondary: "bg-surface-3 text-foreground font-medium hover:bg-border-strong active:scale-[0.98]",
  outline:
    "border border-border-strong bg-transparent text-foreground font-medium hover:border-accent/50 hover:text-accent-hover active:scale-[0.98]",
  ghost: "bg-transparent text-muted font-medium hover:text-foreground hover:bg-surface-2",
  danger: "bg-danger/10 text-danger font-semibold border border-danger/30 hover:bg-danger/20 active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-base gap-2 rounded-xl",
  icon: "h-10 w-10 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
