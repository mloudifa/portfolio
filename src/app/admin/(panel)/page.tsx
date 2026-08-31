import Link from "next/link";
import { FolderKanban, MessageSquare, UserCog, Palette, ArrowRight } from "lucide-react";
import { getDbShape, listProjects } from "@/lib/db/repo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const db = await getDbShape();
  const projects = await listProjects();
  const unreadMessages = db.messages.filter((m) => !m.read).length;

  const stats = [
    { label: "Projects", value: projects.length, href: "/admin/projects", icon: FolderKanban },
    { label: "Unread messages", value: unreadMessages, href: "/admin/messages", icon: MessageSquare },
    { label: "Skills groups", value: db.skills.length, href: "/admin/profile", icon: Palette },
    { label: "Blog posts", value: db.blog.length, href: "/admin/profile", icon: UserCog },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group">
              <Card className="transition-colors group-hover:border-accent/40">
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-hover">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="space-y-4">
        {[
          { title: "Profile & Settings", href: "/admin/profile", desc: "Edit your bio, title, social links, site metadata and accent color.", icon: Palette },
          { title: "Projects", href: "/admin/projects", desc: "Create, edit, feature and archive portfolio projects.", icon: FolderKanban },
          { title: "Messages", href: "/admin/messages", desc: "Read and manage contact form submissions.", icon: MessageSquare },
          { title: "Account", href: "/admin/account", desc: "Change your admin password.", icon: UserCog },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <Card className="transition-colors hover:border-accent/40">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-3 text-accent-hover">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                  <ArrowRight size={18} className="text-muted" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
