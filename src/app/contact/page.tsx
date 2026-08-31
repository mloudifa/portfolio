import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { getDbShape } from "@/lib/db/repo";
import { socialLinkList } from "@/lib/utils/socials";
import { baseMetadata } from "@/lib/seo";
import { NAV_ITEMS } from "@/config/nav";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/home/ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDbShape();
  return baseMetadata(db.site, db.profile);
}

export default async function ContactPage() {
  const db = await getDbShape();
  const { profile } = db;
  const socials = socialLinkList(profile.socials);

  return (
    <>
      <Navbar name={profile.name} items={NAV_ITEMS} />
      <main id="main-content">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          description="Tell me about your project, ask a question, or just say hello — I'll reply as soon as I can."
        />

        <section className="section-pad pt-12">
          <div className="container-site grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
            <div className="space-y-4">
              <div className="card-surface p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-hover">
                    <Mail size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm text-subtle">Email</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="font-medium text-foreground transition-colors hover:text-accent-hover"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              </div>

              {profile.location && (
                <div className="card-surface p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-hover">
                      <MapPin size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm text-subtle">Location</p>
                      <p className="font-medium text-foreground">{profile.location}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-surface p-6">
                <p className="text-sm text-subtle">Find me online</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-hover"
                      aria-label={`${profile.name} on ${social.label}`}
                    >
                      <social.Icon size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <Footer name={profile.name} year={new Date().getFullYear()} socials={profile.socials} />
    </>
  );
}
