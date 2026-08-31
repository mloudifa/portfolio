"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileDown, Mail, MapPin } from "lucide-react";
import type { Profile, SocialLinks } from "@/lib/db/types";
import { socialLinkList } from "@/lib/utils/socials";
import { Typewriter } from "./Typewriter";

interface HeroProps {
  profile: Profile;
  socials: SocialLinks;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero({ profile, socials }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20 md:pt-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[420px] rounded-full bg-accent-strong/10 blur-[120px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-site relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-8"
      >
        {/* Text column */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p variants={item} className="eyebrow mb-5">
            Hi, I&apos;m
          </motion.p>

          <motion.h1
            variants={item}
            className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {profile.name.split(" ")[0]}
            <span className="text-gradient">{profile.name.split(" ").slice(1).join(" ") || "."}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 h-8 text-lg text-muted sm:text-xl md:text-2xl"
          >
            <Typewriter words={profile.tagline.length ? profile.tagline : ["Creative Developer"]} />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            {profile.summary}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-subtle lg:justify-start"
          >
            {profile.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} aria-hidden="true" />
                {profile.location}
              </span>
            )}
            {profile.availability && (
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-success" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Available for work
              </span>
            )}
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Link
              href="/projects"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-white transition-all hover:bg-accent-hover"
            >
              View Projects
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border-strong px-7 text-base font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-hover"
            >
              <Mail size={18} aria-hidden="true" />
              Contact Me
            </Link>
            {profile.cvUrl && (
              <Link
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border px-7 text-base font-medium text-muted transition-colors hover:border-accent/50 hover:text-accent-hover"
              >
                <FileDown size={18} aria-hidden="true" />
                CV
              </Link>
            )}
          </motion.div>

          <motion.div variants={item} className="mt-8 flex items-center gap-2">
            {socialLinkList(socials).map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-hover"
                aria-label={`${profile.name} on ${social.label}`}
              >
                <social.Icon size={17} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Visual column */}
        <motion.div
          variants={item}
          className="relative mx-auto flex items-center justify-center"
        >
          <div className="relative h-56 w-56 sm:h-72 sm:w-72 md:h-80 md:w-80">
            <div
              className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-accent via-accent-hover to-accent-strong opacity-30 blur-2xl"
              aria-hidden="true"
            />
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-accent to-accent-strong" aria-hidden="true" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] border border-accent/30">
              <Image
                src={profile.avatar}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(min-width: 768px) 320px, 224px"
                priority
                className="object-cover"
              />
            </div>

            <div className="animate-float absolute -right-4 top-6 rounded-xl border border-border bg-surface px-3.5 py-2 shadow-pop sm:-right-8">
              <p className="font-mono text-xs text-muted">
                <span className="text-accent-hover">typescript</span>
                <span className="text-subtle"> ·</span> <span className="text-foreground">nestjs</span>
              </p>
            </div>
            <div className="animate-bob absolute -left-3 bottom-10 rounded-xl border border-border bg-surface px-3.5 py-2 shadow-pop sm:-left-8">
              <p className="font-mono text-xs text-muted">
                <span className="text-accent-hover">postgresql</span>
                <span className="text-subtle"> ·</span> <span className="text-foreground">websockets</span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border-strong pt-2">
          <div className="animate-scroll-dot h-2 w-1 rounded-full bg-accent" />
        </div>
      </motion.div>
    </section>
  );
}
