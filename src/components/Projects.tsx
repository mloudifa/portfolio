"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code, X } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio.config";
import SectionWrapper from "./SectionWrapper";

const { projects } = portfolioConfig;

export default function Projects() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <SectionWrapper id="projects" className="px-6 py-24">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-sm font-mono text-accent italic mb-2">projects</h2>
        <h3 className="text-3xl font-bold text-foreground mb-12">
          Featured Work
        </h3>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((project) => (
            <div
              key={project.title}
              className="rounded-xl bg-card border border-white/5 overflow-hidden group hover:border-accent/30 transition-all hover:scale-[1.02]"
            >
              <button
                onClick={() => setLightbox(project.image)}
                className="w-full aspect-video bg-white/5 flex items-center justify-center text-4xl overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.textContent = "🖼";
                  }}
                />
              </button>

              <div className="p-5">
                <h4 className="text-lg font-semibold text-foreground">
                  {project.title}
                </h4>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techs.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-light transition-colors"
                  >
                    <ExternalLink size={14} />
                    Live
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
                  >
                  <Code size={14} />
                  GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox}
              alt="Project screenshot"
              className="max-w-full max-h-[85vh] rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22 fill=%22%23333%22%3E%3Crect width=%22400%22 height=%22300%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 fill=%22%23888%22 font-size=%2220%22%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
