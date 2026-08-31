"use client";

import { useTransition } from "react";
import type { ReactNode } from "react";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FormStatus {
  ok?: boolean;
  error?: string;
}

interface SaveSectionProps {
  onSave: () => Promise<FormStatus>;
  status: FormStatus | null;
  className?: string;
  children: ReactNode;
}

/**
 * A form section with a "Save changes" button that invokes a server action and
 * surfaces the result (success or error) inline.
 */
export function SaveSection({ onSave, status, className, children }: SaveSectionProps) {
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await onSave();
    });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div aria-live="polite">
          {status?.ok && (
            <span className="inline-flex items-center gap-1.5 text-sm text-success">
              <Check size={16} aria-hidden="true" /> Saved
            </span>
          )}
          {status?.error && (
            <span className="inline-flex items-center gap-1.5 text-sm text-danger">
              <AlertCircle size={16} aria-hidden="true" /> {status.error}
            </span>
          )}
        </div>
        <Button type="submit" loading={pending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
