"use client";

import Link from "next/link";
import { ArrowUp, Lock } from "lucide-react";
import type { SocialLinks } from "@/lib/db/types";
import { socialLinkList } from "@/lib/utils/socials";

interface FooterProps {
  name: string;
  year: number;
  socials: SocialLinks;
}

export function Footer({ name, year, socials }: FooterProps) {
  const socialItems = socialLinkList(socials);
  return (
    <footer className="border-t border-border">
      <div className="container-site flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <p className="text-sm text-muted">
            &copy; {year} {name}. All rights reserved.
          </p>
          <p className="text-xs text-subtle">Designed &amp; built with care.</p>
        </div>

        <div className="flex items-center gap-2">
          {socialItems.map((social) => (
            <a
              key={social.key}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-accent-hover"
              aria-label={`${name} on ${social.label}`}
            >
              <social.Icon size={16} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-subtle transition-colors hover:text-muted"
          >
            <Lock size={12} aria-hidden="true" />
            Admin
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-accent-hover"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
