"use client";

import { ArrowUp } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio.config";

const { name } = portfolioConfig;

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 px-6 py-8">
      <div className="max-w-[900px] mx-auto flex items-center justify-between">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <button
          onClick={scrollToTop}
          className="w-9 h-9 rounded-lg bg-card border border-white/5 flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-all"
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}
