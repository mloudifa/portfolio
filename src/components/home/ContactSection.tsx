import { Mail, MapPin } from "lucide-react";
import type { Profile, SocialLinks } from "@/lib/db/types";
import { socialLinkList } from "@/lib/utils/socials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { Section } from "./Section";

interface ContactSectionProps {
  profile: Profile;
  socials: SocialLinks;
}

export function ContactSection({ profile, socials }: ContactSectionProps) {
  return (
    <Section id="contact" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something together"
        description="Have a project in mind or just want to say hi? My inbox is always open."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        {/* Info */}
        <div className="space-y-4">
          <div className="card-surface p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-hover">
                <Mail size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-subtle">Email me at</p>
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
            <p className="text-sm text-subtle">Prefer socials?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinkList(socials).map((social) => (
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

        {/* Form */}
        <ContactForm />
      </div>
    </Section>
  );
}
