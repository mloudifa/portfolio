"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { BlogPost } from "@/lib/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { saveBlogPostAction, removeBlogPostAction } from "@/lib/admin/actions";

interface FormState {
  id?: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  url: string;
}

const empty: FormState = { title: "", date: "", readingTime: "", excerpt: "", url: "" };

export function BlogEditor({ posts }: { posts: BlogPost[] }) {
  const [items, setItems] = useState(posts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<BlogPost | null>(null);

  const openEdit = (post: BlogPost) => {
    setForm({ id: post.id, title: post.title, date: post.date.slice(0, 10), readingTime: post.readingTime, excerpt: post.excerpt, url: post.url });
    setError(null);
    setOpen(true);
  };
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function fetchItems() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    return ((await res.json()).blog ?? []) as BlogPost[];
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy(true);
    const res = await saveBlogPostAction({
      id: form.id,
      title: form.title.trim(),
      date: form.date || new Date().toISOString().slice(0, 10),
      readingTime: form.readingTime.trim(),
      excerpt: form.excerpt.trim(),
      url: form.url.trim(),
    });
    setBusy(false);
    if (res.ok) {
      setItems(await fetchItems());
      setOpen(false);
    } else {
      setError(res.error ?? "Failed to save.");
    }
  }

  async function handleDelete() {
    if (!confirm) return;
    await removeBlogPostAction(confirm.id);
    setItems(await fetchItems());
    setConfirm(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">No blog posts yet.</p>}
        {items.map((post) => (
          <div key={post.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-2 p-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">{post.title}</p>
              <p className="mt-0.5 truncate text-sm text-muted">{post.excerpt}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => openEdit(post)} aria-label="Edit">
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setConfirm(post)} aria-label="Delete">
                <Trash2 size={16} className="text-danger" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit blog post" size="md">
        <div className="space-y-4">
          <div>
            <Label htmlFor="bg-title">Title</Label>
            <Input id="bg-title" value={form.title} onChange={set("title")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="bg-date">Date</Label>
              <Input id="bg-date" type="date" value={form.date} onChange={set("date")} />
            </div>
            <div>
              <Label htmlFor="bg-time">Reading time</Label>
              <Input id="bg-time" value={form.readingTime} onChange={set("readingTime")} placeholder="6 min read" />
            </div>
          </div>
          <div>
            <Label htmlFor="bg-url">URL</Label>
            <Input id="bg-url" type="url" value={form.url} onChange={set("url")} />
          </div>
          <div>
            <Label htmlFor="bg-excerpt">Excerpt</Label>
            <Textarea id="bg-excerpt" rows={3} value={form.excerpt} onChange={set("excerpt")} />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={busy}>Save</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        title="Delete blog post"
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </Card>
  );
}
