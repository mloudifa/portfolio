import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Code,
  FolderKanban,
  Lightbulb,
  Star,
  TriangleAlert,
} from "lucide-react";
import { getDbShape, getProjectBySlug, listProjects } from "@/lib/db/repo";
import { projectJsonLd, projectMetadata } from "@/lib/seo";
import { NAV_ITEMS } from "@/config/nav";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDbShape();
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return projectMetadata(project, db.site, db.profile);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const db = await getDbShape();
  const { site, profile } = db;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const related = (await listProjects())
    .filter((p) => p.slug !== project.slug && (p.category === project.category || p.technologies.some((t) => project.technologies.includes(t))))
    .slice(0, 3);

  const sections = [
    { icon: FolderKanban, title: "Key features", items: project.features, empty: "Feature list coming soon." },
    { icon: TriangleAlert, title: "Challenges", items: project.challenges, empty: "Challenges write-up coming soon." },
    { icon: Lightbulb, title: "Lessons learned", items: project.lessons, empty: "Lessons write-up coming soon." },
  ];

  return (
    <>
      <JsonLd data={projectJsonLd(project, site, profile)} />
      <Navbar name={profile.name} items={NAV_ITEMS} />
      <main id="main-content">
        <section className="section-pad">
          <div className="container-site">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent-hover"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to projects
            </Link>

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge>{project.category}</Badge>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning">
                      <Star size={12} fill="currentColor" aria-hidden="true" />
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {project.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                {project.sourceUrl && (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-strong px-5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-hover"
                  >
                    <Code size={16} aria-hidden="true" />
                    Source Code
                  </a>
                )}
                {project.documentationUrl && (
                  <a
                    href={project.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent-hover"
                  >
                    <BookOpen size={16} aria-hidden="true" />
                    Documentation
                  </a>
                )}
              </div>
            </div>

            {/* Media gallery */}
            <div className="mt-12">
              <ProjectGallery media={project.media} cover={project.cover} title={project.title} />
            </div>

            {/* Description + meta */}
            <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
              <div className="min-w-0">
                <h2 className="mb-4 text-xl font-semibold text-foreground">About the project</h2>
                {(project.longDescription || project.description).split(/\n+/).filter(Boolean).map((paragraph, i) => (
                  <p key={i} className="mb-4 leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              <aside className="space-y-6">
                <div className="card-surface p-5">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-subtle">
                    Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-surface p-5">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-subtle">
                    Project details
                  </h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-subtle">Category</dt>
                      <dd className="font-medium text-foreground">{project.category}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-subtle">Status</dt>
                      <dd className="font-medium text-success">{project.archived ? "Archived" : "Active"}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-subtle">Updated</dt>
                      <dd className="font-medium text-foreground">
                        {new Date(project.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>

            {/* Features / challenges / lessons */}
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {sections.map(({ icon: Icon, title, items, empty }) => (
                <div key={title} className="card-surface p-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent-hover">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <h2 className="font-semibold text-foreground">{title}</h2>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-sm text-subtle">{empty}</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="section-pad border-t border-border/60">
            <div className="container-site">
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
                Related projects
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer name={profile.name} year={new Date().getFullYear()} socials={profile.socials} />
    </>
  );
}
