import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
}

function pageHref(basePath: string, page: number, query?: Record<string, string>) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ currentPage, totalPages, basePath, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  const itemClass = (active: boolean) =>
    cn(
      "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors",
      active
        ? "border-accent bg-accent text-white"
        : "border-border bg-surface text-muted hover:border-accent/40 hover:text-accent-hover",
    );

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={pageHref(basePath, currentPage - 1, query)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent-hover"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(basePath, p, query)}
          className={itemClass(p === currentPage)}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={pageHref(basePath, currentPage + 1, query)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent-hover"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
