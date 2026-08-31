"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Archive, Image as ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import type { Project } from "@/lib/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils/cn";
import {
  saveProjectAction,
  removeProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectArchiveAction,
  type ProjectFormInput,
} from "@/lib/admin/actions";

type ProjectState = ProjectFormInput & { id?: string };

const emptyForm: ProjectState = {
  title: "",
  description: "",
  longDescription: "",
  category: "",
  technologies: [],
  featured: false,
  archived: false,
  sourceUrl: "",
  documentationUrl: "",
  features: [],
  challenges: [],
  lessons: [],
};

export function ProjectsManager({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [items, setItems] = useState(projects);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProjectState>(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  const openNew = () => {
    setForm({ ...emptyForm, category: categories[0] ?? "" });
    setTechInput("");
    setImages([]);
    setImageInput("");
    setError(null);
    setOpen(true);
  };
  const openEdit = (p: Project) => {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription,
      category: p.category,
      technologies: p.technologies,
      featured: p.featured,
      archived: p.archived,
      sourceUrl: p.sourceUrl,
      documentationUrl: p.documentationUrl,
      features: p.features,
      challenges: p.challenges,
      lessons: p.lessons,
    });
    setImages(p.media.filter((m) => m.type === "image").map((m) => m.url));
    setImageInput("");
    setTechInput("");
    setError(null);
    setOpen(true);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (!t) return;
    setForm((f) => ({ ...f, technologies: [...f.technologies, t] }));
    setTechInput("");
  };
  const removeTech = (t: string) =>
    setForm((f) => ({ ...f, technologies: f.technologies.filter((x) => x !== t) }));

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setImages((arr) => [...arr, url]);
    setImageInput("");
  };
  const removeImage = (idx: number) => setImages((arr) => arr.filter((_, i) => i !== idx));
  const updateImage = (idx: number, url: string) =>
    setImages((arr) => arr.map((v, i) => (i === idx ? url : v)));
  const moveImage = (idx: number, dir: -1 | 1) =>
    setImages((arr) => {
      const next = [...arr];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return arr;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });

  async function fetchProjects() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    return ((await res.json()).projects ?? []) as Project[];
  }

  async function handleSave() {
    if (!form.title.trim() || !form.category.trim()) {
      setError("Title and category are required.");
      return;
    }
    const media = images
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url, order) => ({ id: `img-${Date.now()}-${order}`, type: "image" as const, url, order }));
    setBusy(true);
    const res = await saveProjectAction({
      ...form,
      title: form.title.trim(),
      description: form.description.trim() || form.title.trim(),
      technologies: form.technologies,
      media,
    });
    setBusy(false);
    if (res.ok) {
      setItems(await fetchProjects());
      setOpen(false);
    } else {
      setError(res.error ?? "Failed to save.");
    }
  }

  async function toggleFeatured(p: Project) {
    await toggleProjectFeaturedAction(p.id, !p.featured);
    setItems(await fetchProjects());
  }
  async function toggleArchived(p: Project) {
    await toggleProjectArchiveAction(p.id, !p.archived);
    setItems(await fetchProjects());
  }
  async function handleDelete() {
    if (!confirmDelete) return;
    await removeProjectAction(confirmDelete.id);
    setItems(await fetchProjects());
    setConfirmDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Projects ({items.length})</h2>
          <p className="mt-1 text-sm text-muted">Manage portfolio projects and their visibility.</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={16} aria-hidden="true" /> New project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted">No projects yet.</CardContent>
          </Card>
        )}
        {items.map((p) => (
          <Card key={p.id} className={cn(p.archived && "opacity-60")}>
            <CardHeader>
              <CardTitle>
                {p.featured && <Star size={14} className="mr-1.5 inline text-warning" fill="currentColor" aria-hidden="true" />}
                {p.title}
              </CardTitle>
              <div className="flex shrink-0 gap-1.5">
                <Button variant="ghost" size="icon" onClick={() => toggleFeatured(p)} aria-label={p.featured ? "Unfeature" : "Feature"}
                  title={p.featured ? "Unfeature" : "Feature"}>
                  <Star size={16} className={p.featured ? "text-warning" : "text-muted"} fill={p.featured ? "currentColor" : "none"} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toggleArchived(p)} aria-label={p.archived ? "Unarchive" : "Archive"}
                  title={p.archived ? "Unarchive" : "Archive"}>
                  <Archive size={16} className="text-muted" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(p)} aria-label="Delete">
                  <Trash2 size={16} className="text-danger" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="chip-accent">{p.category}</p>
              <p className="mt-3 line-clamp-2 text-sm text-muted">{p.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit project" : "New project"} size="xl">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="pj-title">Title</Label>
              <Input id="pj-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="pj-category">Category</Label>
              <Input id="pj-category" list="category-options" value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              <datalist id="category-options">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <Label>Images</Label>
              <div className="flex gap-2">
                <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                  placeholder="Paste an image URL and press Enter" type="url" />
                <Button type="button" variant="outline" onClick={addImage}>Add</Button>
              </div>
              <p className="mt-1.5 text-xs text-subtle">The first image is used as the card cover. Add as many as you like.</p>

              <div className="mt-3 space-y-2">
                {images.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border p-3 text-center text-sm text-subtle">
                    No images yet.
                  </p>
                )}
                {images.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex shrink-0 flex-col">
                      <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0}
                        aria-label={`Move image ${idx + 1} up`}
                        className="rounded p-0.5 text-muted transition-colors hover:text-foreground disabled:opacity-30">
                        <ChevronUp size={14} />
                      </button>
                      <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === images.length - 1}
                        aria-label={`Move image ${idx + 1} down`}
                        className="rounded p-0.5 text-muted transition-colors hover:text-foreground disabled:opacity-30">
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    {url.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt="" className="h-10 w-14 shrink-0 rounded-md border border-border object-cover" />
                    ) : (
                      <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-muted">
                        <ImageIcon size={14} />
                      </span>
                    )}
                    <Input value={url} onChange={(e) => updateImage(idx, e.target.value)} type="url"
                      aria-label={`Image ${idx + 1} URL`} />
                    <Button variant="ghost" size="icon" type="button" onClick={() => removeImage(idx)} aria-label={`Remove image ${idx + 1}`}>
                      <Trash2 size={16} className="text-danger" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="pj-desc">Short description</Label>
            <Textarea id="pj-desc" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          <div>
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} placeholder="Type and press Enter" />
              <Button type="button" variant="outline" onClick={addTech}>Add</Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.technologies.map((t) => (
                <button key={t} type="button" onClick={() => removeTech(t)}
                  className="chip transition-colors hover:border-danger/40 hover:text-danger" aria-label={`Remove ${t}`}>
                  {t} ×
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(["sourceUrl", "documentationUrl"] as const).map((k) => (
              <div key={k}>
                <Label htmlFor={`pj-${k}`}>{k === "sourceUrl" ? "Source URL" : "Docs URL"}</Label>
                <Input id={`pj-${k}`} type="url" value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="pj-long">Long description (optional)</Label>
            <Textarea id="pj-long" rows={4} value={form.longDescription} onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))} />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-muted">
            <input type="checkbox" checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 accent-[var(--color-accent)]" />
            Featured on homepage
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={busy}>Save</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete project"
        message={`Delete "${confirmDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
