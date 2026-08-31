"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Palette, Paintbrush, FolderKanban, UserCog, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { logoutAction } from "@/lib/auth/actions";

const ICONS = {
  dashboard: LayoutDashboard,
  palette: Palette,
  projects: FolderKanban,
  art: Paintbrush,
  messages: MessageSquare,
  account: UserCog,
} as const;

interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

export function AdminSidebar({
  items,
  adminEmail,
}: {
  items: readonly NavItem[];
  adminEmail: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin navigation">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-accent/10 text-accent-hover"
                : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <Icon size={18} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-6 border-t border-border pt-4">
      <p className="mb-3 truncate px-3.5 text-xs text-subtle">Signed in as {adminEmail}</p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-danger"
        >
          <LogOut size={18} aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar + drawer */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <span className="font-semibold">Admin</span>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-surface-2"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-border bg-background-soft p-4",
          "lg:flex",
          open ? "flex" : "hidden",
        )}
      >
        <div className="mb-6 flex items-center gap-2.5 px-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-strong text-sm font-bold text-white">
            A
          </span>
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
