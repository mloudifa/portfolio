"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { SkillGroup } from "@/lib/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  saveSkillGroupAction,
  removeSkillGroupAction,
} from "@/lib/admin/actions";

interface FormState {
  id?: string;
  category: string;
  techs: string;
}

const empty: FormState = { category: "", techs: "" };

export function SkillsEditor({ skills }: { skills: SkillGroup[] }) {
  const [items, setItems] = useState(skills);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<SkillGroup | null>(null);

  function openNew() {
    setForm(empty);
    setError(null);
    setOpen(true);
  }
  function openEdit(group: SkillGroup) {
    setForm({ id: group.id, category: group.category, techs: group.techs.join(", ") });
    setError(null);
    setOpen(true);
  }

  async function handleSave() {
    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }
    setBusy(true);
    const res = await saveSkillGroupAction({
      id: form.id,
      category: form.category,
      techs: form.techs.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setBusy(false);
    if (res.ok) {
      setItems(await fetchSkills());
      setOpen(false);
    } else {
      setError(res.error ?? "Failed to save.");
    }
  }

  async function handleDelete() {
    if (!confirm) return;
    await removeSkillGroupAction(confirm.id);
    setItems(await fetchSkills());
    setConfirm(null);
  }

  // Re-read from the server after a mutation so the list reflects persisted state.
  async function fetchSkills() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    const data = await res.json();
    return data.skills as SkillGroup[];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <Button variant="outline" size="sm" onClick={openNew}>
          <Plus size={16} aria-hidden="true" /> Add group
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">No skill groups yet.</p>}
        {items.map((group) => (
          <div
            key={group.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-2 p-4"
          >
            <div>
              <p className="font-medium text-foreground">{group.category}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.techs.map((tech) => (
                  <span key={tech} className="chip">{tech}</span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => openEdit(group)} aria-label={`Edit ${group.category}`}>
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setConfirm(group)} aria-label={`Delete ${group.category}`}>
                <Trash2 size={16} className="text-danger" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit skill group" : "Add skill group"} size="sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="sk-cat">Category</Label>
            <Input id="sk-cat" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="sk-techs">Technologies (comma separated)</Label>
            <Input id="sk-techs" value={form.techs} onChange={(e) => setForm((f) => ({ ...f, techs: e.target.value }))} />
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
        title="Delete skill group"
        message={`Delete the "${confirm?.category}" skill group? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </Card>
  );
}
