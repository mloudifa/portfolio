import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/profile", label: "Profile & Settings", icon: "palette" },
  { href: "/admin/projects", label: "Projects", icon: "projects" },
  { href: "/admin/art", label: "Art", icon: "art" },
  { href: "/admin/messages", label: "Messages", icon: "messages" },
  { href: "/admin/account", label: "Account", icon: "account" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar items={navItems} adminEmail={session.sub} />
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
              <p className="mt-1 text-sm text-muted">
                Manage your portfolio content. Changes are saved automatically.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent-hover"
            >
              <ExternalLink size={14} aria-hidden="true" />
              View site
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
