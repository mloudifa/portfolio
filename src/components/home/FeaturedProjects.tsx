import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/db/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Section } from "./Section";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <Section id="projects" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Projects"
        title="Featured work"
        description="A selection of projects I'm proud of — from real-time APIs and AI integrations to full-stack applications and systems-level tools."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} priority={i < 3} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/projects"
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong px-7 text-base font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-hover"
        >
          View all projects
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
