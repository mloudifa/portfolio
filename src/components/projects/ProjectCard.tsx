import Link from "next/link";
import { ArrowUpRight, Code, Star } from "lucide-react";
import type { Project } from "@/lib/db/types";
import { SmartImage } from "./SmartImage";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority }: ProjectCardProps) {
  const cover = project.cover || project.media.find((m) => m.type === "image")?.url;

  return (
    <article className="card-surface card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        <SmartImage
          src={cover ?? ""}
          alt={`${project.title} preview`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
        <span className="chip-accent absolute left-3 top-3 backdrop-blur-sm">
          {project.category}
        </span>
        {project.featured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning backdrop-blur-sm">
            <Star size={12} fill="currentColor" aria-hidden="true" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-foreground">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="chip">+{project.technologies.length - 4}</span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
          {project.sourceUrl && (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent-hover"
            >
              <Code size={13} aria-hidden="true" />
              Source Code
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent-hover"
          >
            Details
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
