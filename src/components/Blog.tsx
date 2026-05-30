"use client";

import { ArrowUpRight } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio.config";
import SectionWrapper from "./SectionWrapper";

const { blog } = portfolioConfig;

export default function Blog() {
  return (
    <SectionWrapper id="blog" className="px-6 py-24">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-sm font-mono text-accent italic mb-2">blog</h2>
        <h3 className="text-3xl font-bold text-foreground mb-12">
          Latest Posts
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {blog.map((post) => (
            <a
              key={post.title}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-card border border-white/5 p-5 group hover:border-accent/30 transition-all hover:scale-[1.02] block"
            >
              <div className="w-full aspect-[16/9] rounded-lg bg-white/5 mb-4 flex items-center justify-center text-3xl">
                📝
              </div>
              <div className="flex items-center gap-2 text-xs text-muted mb-2">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h4 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors flex items-start gap-1">
                {post.title}
                <ArrowUpRight size={14} className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                {post.excerpt}
              </p>
            </a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
