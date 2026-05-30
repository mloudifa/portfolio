"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { portfolioConfig } from "@/config/portfolio.config";
import Typewriter from "./Typewriter";

const { title, tagline } = portfolioConfig;

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative px-6 pt-16"
    >
      <div className="max-w-[900px] w-full mx-auto flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="w-28 h-28 mx-auto mb-6 relative animate-float">
            <div className="w-full h-full rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-5xl">
              🎨
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-foreground">
            {title.split("&")[0].trim()}
            <br />
            <span className="text-accent">&</span>{" "}
            {title.split("&")[1]?.trim()}
          </h1>

          <p className="text-lg sm:text-xl text-muted mt-4 h-8">
            <Typewriter words={tagline} />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <button
            onClick={() => scrollTo("projects")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-light transition-colors"
          >
            View Projects
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent/40 text-accent font-medium hover:bg-accent/10 transition-colors"
          >
            Contact Me
            <Mail size={18} />
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-muted/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-accent animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
