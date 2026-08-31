"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Image as ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import type { ArtItem } from "@/lib/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils/cn";
import {
  saveArtAction,
  removeArtAction,
  toggleArtFeaturedAction,
} from "@/lib/admin/actions";

interface ArtForm {
  id?: string;
  title: string;
  year: string;
  description: string;
}

const emptyForm: ArtForm = { title: "", year: "", description: "" };

export function ArtManager({ art }: { art: ArtItem[] }) {
  const [items, setItems] = useState(art);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ArtForm>(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ArtItem | null>(null);

  const openNew = () => {
    setForm(emptyForm);
    setImages([]);
    setImageInput("");
    setError(null);
    setOpen(true);
  };
  const openEdit = (a: ArtItem) => {
    setForm({ id: a.id, title: a.title, year: a.year, description: a.description });
    setImages(a.images);
    setImageInput("");
    setError(null);
    setOpen(true);
  };

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

  async function fetchArt() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    return ((await res.json()).art ?? []) as ArtItem[];
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    const existing = form.id ? items.find((a) => a.id === form.id) : undefined;
    setBusy(true);
    const res = await saveArtAction({
      id: form.id,
      title: form.title.trim(),
      year: form.year.trim(),
      description: form.description.trim(),
      images,
      featured: existing?.featured ?? false,
    });
    setBusy(false);
    if (res.ok) {
      setItems(await fetchArt());
      setOpen(false);
    } else {
      setError(res.error ?? "Failed to save.");
    }
  }

  async function toggleFeatured(a: ArtItem) {
    await toggleArtFeaturedAction(a.id, !a.featured);
    setItems(await fetchArt());
  }
  async function handleDelete() {
    if (!confirmDelete) return;
    await removeArtAction(confirmDelete.id);
    setItems(await fetchArt());
    setConfirmDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Art ({items.length})</h2>
          <p className="mt-1 text-sm text-muted">Manage artwork shown in the homepage gallery.</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={16} aria-hidden="true" /> New piece
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted">
              No artwork yet. Add your first piece.
            </CardContent>
          </Card>
        )}
        {items.map((a) => {
          const cover = a.images[0];
          return (
            <Card key={a.id} className={cn(!a.featured && "opacity-80")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-surface-2 text-muted">
                        <ImageIcon size={16} />
                      </span>
                    )}
                  </div>
                  <span className="min-w-0 truncate">{a.title}</span>
                  {a.featured && <Star size={14} className="shrink-0 text-warning" fill="currentColor" aria-hidden="true" />}
                </CardTitle>
                <div className="flex shrink-0 gap-1.5">
                  <Button variant="ghost" size="icon" onClick={() => toggleFeatured(a)} aria-label={a.featured ? "Unfeature" : "Feature"}
                    title={a.featured ? "Unfeature" : "Feature"}>
                    <Star size={16} className={a.featured ? "text-warning" : "text-muted"} fill={a.featured ? "currentColor" : "none"} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(a)} aria-label="Edit">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(a)} aria-label="Delete">
                    <Trash2 size={16} className="text-danger" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {a.year && <span className="chip-accent">{a.year}</span>}
                  <span className="text-xs text-subtle">{a.images.length} image{a.images.length === 1 ? "" : "s"}</span>
                </div>
                {a.description && <p className="mt-2 line-clamp-2 text-sm text-muted">{a.description}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit art piece" : "New art piece"} size="xl">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="art-title">Title</Label>
              <Input id="art-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="art-year">Year</Label>
              <Input id="art-year" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} placeholder="2025" />
            </div>
          </div>

          <div>
            <Label htmlFor="art-desc">Description (optional)</Label>
            <Textarea id="art-desc" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          <div>
            <Label>Images</Label>
            <div className="flex gap-2">
              <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                placeholder="Paste an image URL and press Enter" type="url" />
              <Button type="button" variant="outline" onClick={addImage}>Add</Button>
            </div>
            <p className="mt-1.5 text-xs text-subtle">The first image is the thumbnail. Add as many as you like.</p>

            <div className="mt-3 space-y-2">
              {images.length === 0 && (
                <p className="rounded-lg border border-dashed border-border p-3 text-center text-sm text-subtle">No images yet.</p>
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
                  <Input value={url} onChange={(e) => updateImage(idx, e.target.value)} type="url" aria-label={`Image ${idx + 1} URL`} />
                  <Button variant="ghost" size="icon" type="button" onClick={() => removeImage(idx)} aria-label={`Remove image ${idx + 1}`}>
                    <Trash2 size={16} className="text-danger" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

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
        title="Delete art piece"
        message={`Delete "${confirmDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
