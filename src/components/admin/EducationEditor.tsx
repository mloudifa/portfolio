"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { EducationItem } from "@/lib/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { saveEducationAction, removeEducationAction } from "@/lib/admin/actions";

interface FormState {
  id?: string;
  period: string;
  degree: string;
  institution: string;
  description: string;
}

const empty: FormState = { period: "", degree: "", institution: "", description: "" };

export function EducationEditor({ education }: { education: EducationItem[] }) {
  const [items, setItems] = useState(education);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<EducationItem | null>(null);

  const openNew = () => { setForm(empty); setError(null); setOpen(true); };
  const openEdit = (item: EducationItem) => { setForm(item); setError(null); setOpen(true); };
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function fetchItems() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    return ((await res.json()).education ?? []) as EducationItem[];
  }

  async function handleSave() {
    if (!form.degree.trim() || !form.institution.trim()) {
      setError("Degree and institution are required.");
      return;
    }
    setBusy(true);
    const res = await saveEducationAction({
      id: form.id,
      period: form.period.trim(),
      degree: form.degree.trim(),
      institution: form.institution.trim(),
      description: form.description.trim(),
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
    await removeEducationAction(confirm.id);
    setItems(await fetchItems());
    setConfirm(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <Button variant="outline" size="sm" onClick={openNew}>
          <Plus size={16} aria-hidden="true" /> Add education
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">No education entries.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-2 p-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip-accent">{item.period}</span>
                <p className="font-medium text-foreground">{item.degree}</p>
              </div>
              <p className="mt-0.5 text-sm text-muted">{item.institution}</p>
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

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit education" : "Add education"} size="md">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ed-period">Period</Label>
              <Input id="ed-period" value={form.period} onChange={set("period")} />
            </div>
            <div>
              <Label htmlFor="ed-degree">Degree</Label>
              <Input id="ed-degree" value={form.degree} onChange={set("degree")} />
            </div>
          </div>
          <div>
            <Label htmlFor="ed-institution">Institution</Label>
            <Input id="ed-institution" value={form.institution} onChange={set("institution")} />
          </div>
          <div>
            <Label htmlFor="ed-desc">Description</Label>
            <Textarea id="ed-desc" rows={3} value={form.description} onChange={set("description")} />
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
        title="Delete education"
        message={`Delete "${confirm?.degree}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </Card>
  );
}
