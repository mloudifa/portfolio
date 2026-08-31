import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-3 md:mb-16",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-base leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
