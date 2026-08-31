"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  name: string;
  items: readonly NavItem[];
}

function Logo({ name }: { name: string }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label={`${name} — home`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-strong text-sm font-bold text-white shadow-glow">
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent-hover">
        {name}
      </span>
    </Link>
  );
}

export function Navbar({ name, items }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-accent-hover to-accent"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="border-b border-border/60 glass">
          <nav
            className="container-site flex h-16 items-center justify-between"
            aria-label="Primary navigation"
          >
            <Logo name={name} />

            <div className="hidden items-center gap-1 md:flex">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-accent-hover"
                      : "text-muted hover:text-foreground",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition-all hover:bg-accent-hover"
              >
                Hire Me
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-surface-2 md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu size={22} />
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-border bg-background"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="text-sm font-semibold text-foreground">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-surface-2"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-5" aria-label="Mobile navigation">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-lg font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-accent/10 text-accent-hover"
                        : "text-foreground hover:bg-surface-2",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t border-border p-5">
                <Link
                  href="/contact"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white"
                >
                  Hire Me
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
