"use client";

import { portfolioConfig } from "@/config/portfolio.config";
import SectionWrapper from "./SectionWrapper";

const { bio } = portfolioConfig;

export default function About() {
  return (
    <SectionWrapper id="about" className="px-6 py-24">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-sm font-mono text-accent italic mb-2">about</h2>
        <h3 className="text-3xl font-bold text-foreground mb-12">
          About Me
        </h3>

        <div className="grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-3 space-y-4">
            {bio.map((paragraph, i) => (
              <p key={i} className="text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="md:col-span-2 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-2xl bg-card border border-white/5 flex items-center justify-center text-6xl animate-float">
                🎨
              </div>
              <div className="absolute -top-3 -right-3 w-4 h-4 bg-accent rounded-full" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 border border-accent/50 rotate-45" />
              <div className="absolute top-1/2 -left-6 w-2 h-2 bg-accent/40 rounded-full" />
              <div className="absolute bottom-6 -right-5 w-2 h-2 bg-accent/40" />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
