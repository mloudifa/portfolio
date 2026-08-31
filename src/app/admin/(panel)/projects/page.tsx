import Link from "next/link";
import { listAllProjects, getCategories } from "@/lib/db/repo";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export default async function AdminProjectsPage() {
  const projects = await listAllProjects();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <ProjectsManager projects={projects} categories={categories} />
      <p className="text-xs text-subtle">
        Tip: project pages are generated at <Link href="/projects" className="underline hover:text-accent-hover">/projects</Link>. Media
        (covers/videos) will appear here once the media library is enabled.
      </p>
    </div>
  );
}
