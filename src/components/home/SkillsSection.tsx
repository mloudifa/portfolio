import type { SkillGroup } from "@/lib/db/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "./Section";

interface SkillsSectionProps {
  skills: SkillGroup[];
}

const groupAccents = [
  { text: "text-accent-hover", dot: "bg-accent" },
  { text: "text-info", dot: "bg-info" },
  { text: "text-success", dot: "bg-success" },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <Section id="skills" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Skills"
        title="My toolkit"
        description="The technologies and disciplines I rely on to ship production-quality products."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => {
          const accent = groupAccents[i % groupAccents.length];
          return (
            <div
              key={group.id}
              className="card-surface card-hover p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} aria-hidden="true" />
                <h3 className={`font-mono text-sm uppercase tracking-widest ${accent.text}`}>
                  {group.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.techs.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
