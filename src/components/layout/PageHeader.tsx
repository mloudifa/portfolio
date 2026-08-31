import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent hero header for inner pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: PageHeaderProps) {
  return (
    <section className={cn("section-pad border-b border-border/60", className)}>
      <div
        className={cn(
          "container-site flex flex-col gap-4",
          align === "center" && "items-center text-center",
        )}
      >
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
