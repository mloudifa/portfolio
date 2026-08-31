import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-strong text-lg font-bold text-white">
            A
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted">
            Enter your admin credentials to manage the portfolio.
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent-hover"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
