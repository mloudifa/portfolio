"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Film, X } from "lucide-react";
import type { MediaItem } from "@/lib/db/types";
import { cn } from "@/lib/utils/cn";
import { SmartImage } from "./SmartImage";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  alt?: string;
}

interface ProjectGalleryProps {
  media: MediaItem[];
  cover?: string;
  title: string;
}

function buildItems(media: MediaItem[], cover: string | undefined, title: string): GalleryItem[] {
  const items: GalleryItem[] = [];
  if (cover) {
    items.push({ id: "cover", type: "image", url: cover, alt: `${title} cover` });
  }
  for (const m of [...media].sort((a, b) => a.order - b.order)) {
    if (items.some((i) => i.url === m.url)) continue;
    items.push({ id: m.id, type: m.type, url: m.url, alt: m.alt || `${title} media` });
  }
  return items;
}

export function ProjectGallery({ media, cover, title }: ProjectGalleryProps) {
  const items = useMemo(() => buildItems(media, cover, title), [media, cover, title]);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const [prevItems, setPrevItems] = useState(items);

  if (prevItems !== items) {
    setPrevItems(items);
    setActive(0);
  }

  const current = items[active];

  const goTo = useCallback(
    (index: number) => {
      setActive((index + items.length) % items.length);
    },
    [items.length],
  );

  // Lightbox keyboard + focus management.
  useEffect(() => {
    if (!lightbox) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightboxRef.current?.querySelector<HTMLElement>("button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [lightbox, active, goTo]);

  if (items.length === 0) return null;

  const canNavigate = items.length > 1;

  return (
    <div className="space-y-4">
      {/* Main display */}
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-pop">
        {current.type === "video" ? (
          <video
            src={current.url}
            poster={cover || undefined}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
            aria-label={current.alt}
          />
        ) : (
          <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
              className="absolute inset-0 h-full w-full"
            aria-label={`Open ${current.alt ?? "image"} in fullscreen viewer`}
          >
            <SmartImage src={current.url} alt={current.alt ?? ""} sizes="(min-width: 1024px) 80vw, 100vw" className="rounded-2xl" />
          </button>
        )}

        {canNavigate && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(active - 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:text-accent-hover"
              aria-label="Previous media"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(active + 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:text-accent-hover"
              aria-label="Next media"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-xs text-muted backdrop-blur-sm">
          {active + 1} / {items.length}
        </span>
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Media thumbnails">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${item.alt ?? `media ${i + 1}`}`}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-32",
                i === active
                  ? "border-accent ring-2 ring-accent/40"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              {item.type === "video" ? (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 to-surface text-accent-hover">
                  <Film size={20} aria-hidden="true" />
                </span>
              ) : (
                <SmartImage src={item.url} alt={item.alt ?? ""} sizes="128px" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && current.type === "image" && (
          <motion.div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${current.alt ?? "Image"} in fullscreen`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close fullscreen viewer"
            >
              <X size={22} />
            </button>

            {canNavigate && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goTo(active - 1); }}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goTo(active + 1); }}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] max-w-full"
            >
              {current.type === "image" && (
                // Fullscreen uses a plain img to avoid optimizer cropping inside the viewer.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.url}
                  alt={current.alt ?? ""}
                  className="max-h-[85vh] max-w-full rounded-xl object-contain"
                />
              )}
              <p className="mt-3 text-center text-sm text-white/70">
                {current.alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
