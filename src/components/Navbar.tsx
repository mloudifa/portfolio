"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio.config";

const { name, nav } = portfolioConfig;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleNav = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-[900px] px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => handleNav("home")}
          className="font-[family-name:var(--font-pacifico)] text-xl text-foreground hover:text-accent transition-colors"
        >
          {name}
        </button>

        <div className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <button
              key={item}
              onClick={() => handleNav(item)}
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-card border-l border-white/5 p-8">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {nav.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNav(item)}
                  className="text-lg text-muted hover:text-accent transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
