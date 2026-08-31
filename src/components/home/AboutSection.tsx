import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/lib/db/types";
import { Section } from "./Section";

interface AboutSectionProps {
  profile: Profile;
  stats: { label: string; value: string }[];
}

export function AboutSection({ profile, stats }: AboutSectionProps) {
  return (
    <Section id="about" className="border-t border-border/60">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        {/* Portrait */}
        <div className="relative mx-auto lg:mx-0">
          <div className="relative mx-auto w-64 sm:w-72">
            <div
              className="absolute -inset-4 rounded-[2.5rem] bg-accent/10 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-pop">
              <Image
                src={profile.avatar}
                alt={`Portrait of ${profile.name}`}
                width={576}
                height={576}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="card-surface absolute -bottom-4 -right-4 px-4 py-3 sm:-right-8">
              <p className="text-2xl font-bold text-accent-hover">{stats[0]?.value ?? "5+"}</p>
              <p className="text-xs text-muted">{stats[0]?.label ?? "Years experience"}</p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <p className="eyebrow mb-3">About</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Turning ideas into{" "}
            <span className="text-gradient">polished experiences</span>
          </h2>

          <div className="mt-6 space-y-4">
            {profile.bio.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="card-surface px-4 py-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl border border-border-strong px-5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-hover"
          >
            More about me
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
