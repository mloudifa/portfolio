import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { getDbShape } from "@/lib/db/repo";
import { baseMetadata } from "@/lib/seo";
import { NAV_ITEMS } from "@/config/nav";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDbShape();
  return baseMetadata(db.site, db.profile);
}

export default async function BlogPage() {
  const db = await getDbShape();
  const { profile, blog } = db;

  return (
    <>
      <Navbar name={profile.name} items={NAV_ITEMS} />
      <main id="main-content">
        <PageHeader
          eyebrow="Blog"
          title="Articles & writing"
          description="Notes on API design, system architecture, real-time engineering and the craft of building better software."
        />

        <section className="section-pad pt-12">
          <div className="container-site">
            {blog.length === 0 ? (
              <EmptyState
                title="No articles yet"
                description="Check back soon for new posts."
                icon={FileText}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blog.map((post) => (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-surface card-hover group flex flex-col p-6"
                  >
                    <div className="flex items-center gap-2 text-xs text-subtle">
                      <CalendarDays size={14} aria-hidden="true" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h2 className="mt-4 flex items-start justify-between gap-3 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-hover">
                      {post.title}
                      <ArrowUpRight
                        size={18}
                        className="mt-0.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer name={profile.name} year={new Date().getFullYear()} socials={profile.socials} />
    </>
  );
}
