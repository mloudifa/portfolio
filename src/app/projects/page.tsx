import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getDbShape, listProjects } from "@/lib/db/repo";
import { baseMetadata } from "@/lib/seo";
import { NAV_ITEMS } from "@/config/nav";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { Pagination } from "@/components/projects/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

const PER_PAGE = 6;

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDbShape();
  return baseMetadata(db.site, db.profile);
}

function matchesQuery(project: { title: string; description: string; technologies: string[]; category: string }, q: string) {
  const needle = q.toLowerCase();
  return (
    project.title.toLowerCase().includes(needle) ||
    project.description.toLowerCase().includes(needle) ||
    project.category.toLowerCase().includes(needle) ||
    project.technologies.some((t) => t.toLowerCase().includes(needle))
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const db = await getDbShape();
  const { profile } = db;
  const categories = await getCategories();

  const { q = "", category = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const all = await listProjects();
  const filtered = all.filter((project) => {
    const matchesCategory = category === "all" || project.category === category;
    const matchesQueryText = q ? matchesQuery(project, q) : true;
    return matchesCategory && matchesQueryText;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProjects = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <>
      <Navbar name={profile.name} items={NAV_ITEMS} />
      <main id="main-content">
        <PageHeader
          eyebrow="Projects"
          title="My projects"
          description="Browse my work. Search by name or technology, filter by category, and open any project for the full story."
        />

        <section className="section-pad">
          <div className="container-site">
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
              <ProjectFilters categories={categories} total={filtered.length} />
            </Suspense>

            {pageProjects.length === 0 ? (
              <div className="mt-10">
                <EmptyState
                  title="No projects found"
                  description="Try adjusting your search or filters, or check back soon."
                />
              </div>
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pageProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              basePath="/projects"
              query={{ q, category }}
            />
          </div>
        </section>
      </main>
      <Footer name={profile.name} year={new Date().getFullYear()} socials={profile.socials} />
    </>
  );
}
