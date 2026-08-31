"use client";

import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { changePasswordAction } from "@/lib/admin/actions";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      setStatus({ error: "New passwords do not match." });
      return;
    }
    if (next.length < 8) {
      setStatus({ error: "New password must be at least 8 characters." });
      return;
    }
    setBusy(true);
    const res = await changePasswordAction({ currentPassword: current, newPassword: next });
    setBusy(false);
    setStatus(res);
    if (res.ok) {
      setCurrent("");
      setNext("");
      setConfirm("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="pw-current">Current password</Label>
        <Input id="pw-current" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="pw-next">New password</Label>
          <Input id="pw-next" type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="pw-confirm">Confirm new password</Label>
          <Input id="pw-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
      </div>

      <div aria-live="polite">
        {status?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <Check size={16} aria-hidden="true" /> Password updated.
          </span>
        )}
        {status?.error && (
          <span className="inline-flex items-center gap-1.5 text-sm text-danger">
            <AlertCircle size={16} aria-hidden="true" /> {status.error}
          </span>
        )}
      </div>

      <Button type="submit" loading={busy}>Update password</Button>
    </form>
  );
}
