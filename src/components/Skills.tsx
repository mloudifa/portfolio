"use client";

import { portfolioConfig } from "@/config/portfolio.config";
import SectionWrapper from "./SectionWrapper";

const { skills } = portfolioConfig;

const pillColors = [
  "bg-accent/10 text-accent border-accent/20",
  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
];

export default function Skills() {
  return (
    <SectionWrapper id="about" className="px-6 pb-24">
      <div className="max-w-[900px] mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((group, i) => (
            <div
              key={group.category}
              className="rounded-xl bg-card border border-white/5 p-6 hover:border-accent/30 transition-colors"
            >
              <h4 className="text-sm font-mono text-accent italic mb-4">
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.techs.map((tech) => (
                  <span
                    key={tech}
                    className={`text-xs px-3 py-1 rounded-full border ${pillColors[i]}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
