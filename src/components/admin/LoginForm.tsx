"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { loginAction, type LoginResult } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginResult | undefined, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@mloudifa.dev"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Sign in
      </Button>

      <p className="pt-2 text-center text-xs text-subtle">
        Default credentials: <span className="text-muted">admin@mloudifa.dev</span> /{" "}
        <span className="text-muted">admin123</span>
      </p>
    </form>
  );
}
