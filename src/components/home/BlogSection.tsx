import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import type { BlogPost } from "@/lib/db/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "./Section";

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <Section id="blog" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Blog"
        title="Latest from the blog"
        description="Notes, deep dives and lessons learned along the way."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
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

            <h3 className="mt-4 flex items-start justify-between gap-3 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-hover">
              {post.title}
              <ArrowUpRight
                size={18}
                className="mt-0.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
              {post.excerpt}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong px-7 text-base font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-hover"
        >
          All articles
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
