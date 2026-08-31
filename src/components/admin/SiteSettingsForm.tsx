"use client";

import { useState } from "react";
import type { SiteConfig } from "@/lib/db/types";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { SaveSection } from "./SaveSection";
import { saveSiteConfigAction } from "@/lib/admin/actions";

export function SiteSettingsForm({ site }: { site: SiteConfig }) {
  const [form, setForm] = useState({
    name: site.name,
    title: site.title,
    description: site.description,
    accentColor: site.accentColor,
    url: site.url,
    categories: site.categories.join("\n"),
  });
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSave() {
    const res = await saveSiteConfigAction({
      name: form.name.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      accentColor: form.accentColor.trim(),
      url: form.url.trim(),
      categories: form.categories
        .split(/\n|,/g)
        .map((c) => c.trim())
        .filter(Boolean),
    });
    setStatus(res);
    return res;
  }

  return (
    <SaveSection onSave={handleSave} status={status} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="site-name">Site name</Label>
          <Input id="site-name" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <Label htmlFor="site-accent">Accent color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.accentColor}
              onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
              className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-surface"
              aria-label="Accent color"
            />
            <Input id="site-accent" value={form.accentColor} onChange={set("accentColor")} />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="site-title">Browser / SEO title</Label>
        <Input id="site-title" value={form.title} onChange={set("title")} />
      </div>
      <div>
        <Label htmlFor="site-desc">Site description</Label>
        <Textarea id="site-desc" rows={3} value={form.description} onChange={set("description")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="site-url">Site URL</Label>
          <Input id="site-url" value={form.url} onChange={set("url")} />
        </div>
        <div>
          <Label htmlFor="site-categories">Project categories (one per line)</Label>
          <Textarea id="site-categories" rows={3} value={form.categories} onChange={set("categories")} />
        </div>
      </div>
    </SaveSection>
  );
}
