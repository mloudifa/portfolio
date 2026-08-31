import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileDown, Mail } from "lucide-react";
import { getDbShape } from "@/lib/db/repo";
import { socialLinkList } from "@/lib/utils/socials";
import { personJsonLd } from "@/lib/seo";
import { baseMetadata } from "@/lib/seo";
import { NAV_ITEMS } from "@/config/nav";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillsSection } from "@/components/home/SkillsSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDbShape();
  return baseMetadata(db.site, db.profile);
}

export default async function AboutPage() {
  const db = await getDbShape();
  const { site, profile, skills, experience, education } = db;
  const socials = socialLinkList(profile.socials);

  const facts = [
    { label: "Location", value: profile.location },
    { label: "Email", value: profile.email },
    { label: "Focus", value: "Backend / Full-Stack" },
    { label: "Freelance", value: profile.availability ? "Available" : "Unavailable" },
  ];

  return (
    <>
      <JsonLd data={personJsonLd(site, profile, db.projects)} />
      <Navbar name={profile.name} items={NAV_ITEMS} />
      <main id="main-content">
        <PageHeader
          eyebrow="About"
          title="About me"
          description="A quick introduction, my professional summary, experience and education."
        />

        <section className="section-pad">
          <div className="container-site grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div className="space-y-6">
              <div className="relative mx-auto w-56 lg:w-full lg:max-w-72">
                <div className="absolute -inset-3 rounded-[2rem] bg-accent/10 blur-2xl" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-pop">
                  <Image
                    src={profile.avatar}
                    alt={`Portrait of ${profile.name}`}
                    width={640}
                    height={640}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </div>

              <div className="card-surface divide-y divide-border">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-subtle">{fact.label}</span>
                    <span className="max-w-[55%] truncate text-sm font-medium text-foreground">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {socials.map((social) => (
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
              </div>
            </div>

            <div>
              <p className="eyebrow mb-3">Professional summary</p>
              <div className="space-y-4">
                {profile.bio.map((paragraph, i) => (
                  <p key={i} className="leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {profile.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    <FileDown size={17} aria-hidden="true" />
                    Download CV
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong px-6 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-hover"
                >
                  <Mail size={17} aria-hidden="true" />
                  Get in touch
                </Link>
              </div>

              {profile.cvUrl && (
                <p className="mt-3 text-xs text-subtle">
                  Can&apos;t view PDFs?{" "}
                  <a
                    href={profile.cvUrl}
                    className="text-accent-hover hover:underline"
                    download
                  >
                    Download the file
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </section>

        <SkillsSection skills={skills} />
        <ExperienceSection experience={experience} education={education} />

        <section className="section-pad border-t border-border/60">
          <div className="container-site">
            <div className="card-surface flex flex-col items-center gap-6 px-6 py-14 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Want to work together?
              </h2>
              <p className="max-w-lg text-muted">
                I&apos;m always open to discussing new projects, creative ideas or
                opportunities to be part of your vision.
              </p>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-7 text-base font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Start a conversation
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer name={profile.name} year={new Date().getFullYear()} socials={profile.socials} />
    </>
  );
}
