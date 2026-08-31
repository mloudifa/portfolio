import type { ArtItem } from "@/lib/db/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/projects/SmartImage";
import { Section } from "./Section";

interface ArtSectionProps {
  art: ArtItem[];
}

export function ArtSection({ art }: ArtSectionProps) {
  if (art.length === 0) return null;

  return (
    <Section id="art" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Art"
        title="Selected works"
        description="A gallery of visual pieces — artwork, sketches and experiments."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {art.map((item) => {
          const cover = item.images[0];
          return (
            <figure
              key={item.id}
              className="group card-surface card-hover overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <SmartImage
                  src={cover || ""}
                  alt={item.title}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                {item.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-xs text-muted backdrop-blur-sm">
                    {item.images.length} images
                  </span>
                )}
              </div>
              <figcaption className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                  )}
                </div>
                {item.year && (
                  <span className="chip-accent shrink-0">{item.year}</span>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
