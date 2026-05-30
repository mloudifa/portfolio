"use client";

import { portfolioConfig } from "@/config/portfolio.config";
import SectionWrapper from "./SectionWrapper";

const { experience } = portfolioConfig;

export default function Experience() {
  return (
    <SectionWrapper id="about" className="px-6 pb-24">
      <div className="max-w-[900px] mx-auto">
        <div className="space-y-0">
          {experience.map((exp, i) => (
            <div key={exp.year} className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white shrink-0 z-10">
                  {exp.year}
                </div>
                {i < experience.length - 1 && (
                  <div className="w-px flex-1 bg-white/5" />
                )}
              </div>

              <div className="pb-12 pt-1">
                <h4 className="text-lg font-semibold text-foreground">
                  {exp.title}
                </h4>
                <p className="text-sm text-accent italic font-mono">
                  {exp.company}
                </p>
                <p className="text-xs text-muted mt-1">{exp.period}</p>
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
