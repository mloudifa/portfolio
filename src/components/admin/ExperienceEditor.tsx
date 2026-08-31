"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ExperienceItem } from "@/lib/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { saveExperienceAction, removeExperienceAction } from "@/lib/admin/actions";

interface FormState {
  id?: string;
  year: string;
  title: string;
  company: string;
  period: string;
  description: string;
  techs: string;
}

const empty: FormState = { year: "", title: "", company: "", period: "", description: "", techs: "" };

export function ExperienceEditor({ experience }: { experience: ExperienceItem[] }) {
  const [items, setItems] = useState(experience);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ExperienceItem | null>(null);

  const openNew = () => { setForm(empty); setError(null); setOpen(true); };
  const openEdit = (item: ExperienceItem) => {
    setForm({ ...item, techs: item.techs.join(", ") });
    setError(null);
    setOpen(true);
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function fetchItems() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    return ((await res.json()).experience ?? []) as ExperienceItem[];
  }

  async function handleSave() {
    if (!form.title.trim() || !form.company.trim()) {
      setError("Title and company are required.");
      return;
    }
    setBusy(true);
    const res = await saveExperienceAction({
      id: form.id,
      year: form.year.trim(),
      title: form.title.trim(),
      company: form.company.trim(),
      period: form.period.trim(),
      description: form.description.trim(),
      techs: form.techs.split(",").map((t) => t.trim()).filter(Boolean),
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
    await removeExperienceAction(confirm.id);
    setItems(await fetchItems());
    setConfirm(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
        <Button variant="outline" size="sm" onClick={openNew}>
          <Plus size={16} aria-hidden="true" /> Add role
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">No experience entries.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-2 p-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip-accent">{item.year}</span>
                <p className="font-medium text-foreground">{item.title}</p>
              </div>
              <p className="mt-0.5 text-sm text-muted">{item.company} · {item.period}</p>
              {item.description && <p className="mt-2 text-sm text-subtle">{item.description}</p>}
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label="Edit">
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setConfirm(item)} aria-label="Delete">
                <Trash2 size={16} className="text-danger" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit experience" : "Add experience"} size="md">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ex-year">Year</Label>
              <Input id="ex-year" value={form.year} onChange={set("year")} />
            </div>
            <div>
              <Label htmlFor="ex-period">Period</Label>
              <Input id="ex-period" value={form.period} onChange={set("period")} placeholder="Jan 2024 – Present" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ex-title">Title</Label>
              <Input id="ex-title" value={form.title} onChange={set("title")} />
            </div>
            <div>
              <Label htmlFor="ex-company">Company</Label>
              <Input id="ex-company" value={form.company} onChange={set("company")} />
            </div>
          </div>
          <div>
            <Label htmlFor="ex-techs">Technologies (comma separated)</Label>
            <Input id="ex-techs" value={form.techs} onChange={set("techs")} />
          </div>
          <div>
            <Label htmlFor="ex-desc">Description</Label>
            <Textarea id="ex-desc" rows={3} value={form.description} onChange={set("description")} />
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
        title="Delete experience"
        message={`Delete "${confirm?.title}" from experience? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </Card>
  );
}
