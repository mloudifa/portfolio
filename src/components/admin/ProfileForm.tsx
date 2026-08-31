"use client";

import { useState } from "react";
import type { Profile } from "@/lib/db/types";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { SaveSection } from "./SaveSection";
import { saveProfileAction } from "@/lib/admin/actions";
import type { SocialLinks } from "@/lib/db/types";

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string }[] = [
  { key: "github", label: "GitHub" },
  { key: "twitter", label: "X (Twitter)" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "dribbble", label: "Dribbble" },
  { key: "youtube", label: "YouTube" },
];

export function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    name: profile.name,
    title: profile.title,
    summary: profile.summary,
    bio: profile.bio.join("\n"),
    tagline: profile.tagline.join("\n"),
    location: profile.location,
    availability: profile.availability,
    email: profile.email,
    avatar: profile.avatar,
    cvUrl: profile.cvUrl,
    socials: { ...profile.socials },
  });
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSave() {
    const res = await saveProfileAction({
      name: form.name.trim(),
      title: form.title.trim(),
      summary: form.summary.trim(),
      bio: form.bio.split("\n").map((p) => p.trim()).filter(Boolean),
      tagline: form.tagline.split("\n").map((t) => t.trim()).filter(Boolean),
      location: form.location.trim(),
      availability: form.availability,
      email: form.email.trim(),
      avatar: form.avatar.trim(),
      cvUrl: form.cvUrl.trim(),
      socials: Object.fromEntries(
        SOCIAL_FIELDS.map((s) => [s.key, form.socials[s.key].trim()]),
      ) as Partial<SocialLinks>,
    });
    setStatus(res);
    return res;
  }

  return (
    <SaveSection onSave={handleSave} status={status} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-name">Name</Label>
          <Input id="p-name" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <Label htmlFor="p-title">Role / Title</Label>
          <Input id="p-title" value={form.title} onChange={set("title")} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-email">Email</Label>
          <Input id="p-email" type="email" value={form.email} onChange={set("email")} />
        </div>
        <div>
          <Label htmlFor="p-location">Location</Label>
          <Input id="p-location" value={form.location} onChange={set("location")} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-avatar">Avatar URL</Label>
          <Input id="p-avatar" value={form.avatar} onChange={set("avatar")} />
        </div>
        <div>
          <Label htmlFor="p-cv">CV URL</Label>
          <Input id="p-cv" value={form.cvUrl} onChange={set("cvUrl")} />
        </div>
      </div>

      <div>
        <Label htmlFor="p-summary">Short summary</Label>
        <Textarea id="p-summary" rows={2} value={form.summary} onChange={set("summary")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-bio">Bio (one paragraph per line)</Label>
          <Textarea id="p-bio" rows={5} value={form.bio} onChange={set("bio")} />
        </div>
        <div>
          <Label htmlFor="p-tagline">Tagline words (one per line)</Label>
          <Textarea id="p-tagline" rows={5} value={form.tagline} onChange={set("tagline")} />
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-muted">
        <input
          type="checkbox"
          checked={form.availability}
          onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
          className="h-4 w-4 accent-[var(--color-accent)]"
        />
        Available for work
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        {SOCIAL_FIELDS.map((field) => (
          <div key={field.key}>
            <Label htmlFor={`p-${field.key}`}>{field.label}</Label>
            <Input
              id={`p-${field.key}`}
              type="url"
              value={form.socials[field.key]}
              onChange={(e) => setForm((f) => ({ ...f, socials: { ...f.socials, [field.key]: e.target.value } }))}
            />
          </div>
        ))}
      </div>
    </SaveSection>
  );
}
