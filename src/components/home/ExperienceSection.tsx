import { Briefcase, GraduationCap } from "lucide-react";
import type { EducationItem, ExperienceItem } from "@/lib/db/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "./Section";

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  education: EducationItem[];
}

export function ExperienceSection({ experience, education }: ExperienceSectionProps) {
  return (
    <Section id="experience" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Experience & Education"
        title="My journey so far"
        description="A timeline of the roles, teams and skills that shaped how I build."
      />

      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        {/* Timeline */}
        <div className="relative">
          <div
            className="absolute bottom-2 left-[19px] top-2 w-px bg-border"
            aria-hidden="true"
          />
          <ol className="space-y-8">
            {experience.map((exp) => (
              <li key={exp.id} className="relative flex gap-5">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface text-accent-hover shadow-glow">
                  <Briefcase size={17} aria-hidden="true" />
                </span>
                <div className="card-surface flex-1 p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-base font-semibold text-foreground">{exp.title}</h3>
                    <span className="text-sm text-accent-hover">{exp.company}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-subtle">{exp.period}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{exp.description}</p>
                  {exp.techs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.techs.map((tech) => (
                        <span key={tech} className="chip-accent">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Education */}
        <div>
          <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
            <GraduationCap size={20} className="text-accent-hover" aria-hidden="true" />
            Education
          </h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="card-surface p-5">
                <p className="font-mono text-xs text-accent-hover">{edu.period}</p>
                <h4 className="mt-1.5 font-semibold text-foreground">{edu.degree}</h4>
                <p className="text-sm text-muted">{edu.institution}</p>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
