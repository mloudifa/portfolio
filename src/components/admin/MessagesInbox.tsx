"use client";

import { useState } from "react";
import { Mail, Trash2, CheckCircle2, MailOpen } from "lucide-react";
import type { ContactMessage } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  toggleMessageReadAction,
  removeMessageAction,
} from "@/lib/admin/actions";

export function MessagesInbox({ messages }: { messages: ContactMessage[] }) {
  const [items, setItems] = useState(messages);
  const [confirm, setConfirm] = useState<ContactMessage | null>(null);

  async function fetchMessages() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    return ((await res.json()).messages ?? []) as ContactMessage[];
  }

  async function toggleRead(m: ContactMessage) {
    await toggleMessageReadAction(m.id, !m.read);
    setItems(await fetchMessages());
  }

  async function handleDelete() {
    if (!confirm) return;
    await removeMessageAction(confirm.id);
    setItems(await fetchMessages());
    setConfirm(null);
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <Card className="p-6">
          <EmptyState title="No messages" description="New contact form submissions will appear here." icon={Mail} />
        </Card>
      )}

      {items.map((m) => (
        <Card key={m.id} className={m.read ? "opacity-70" : "border-accent/40"}>
          <div className="flex items-start gap-4 p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-sm text-accent-hover hover:underline">
                  {m.email}
                </a>
                {!m.read && (
                  <span className="chip-accent">Unread</span>
                )}
              </div>
              <p className="mt-1 text-xs text-subtle">
                {new Date(m.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{m.message}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => toggleRead(m)} aria-label={m.read ? "Mark unread" : "Mark read"}>
                {m.read ? <MailOpen size={16} className="text-muted" /> : <CheckCircle2 size={16} className="text-success" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setConfirm(m)} aria-label="Delete">
                <Trash2 size={16} className="text-danger" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        title="Delete message"
        message={`Delete the message from "${confirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
