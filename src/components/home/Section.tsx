import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { Reveal } from "@/components/ui/Reveal";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
}

/** Consistent vertical rhythm + entrance animation for home sections. */
export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section id={id} className={cn("section-pad", className)} {...props}>
      <div className="container-site">
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}
