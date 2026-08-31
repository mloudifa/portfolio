import type { Metadata } from "next";
import type { Profile, Project, SiteConfig } from "@/lib/db/types";

const SITE_KEYWORDS = [
  "developer",
  "engineer",
  "portfolio",
  "backend",
  "full-stack",
  "typescript",
  "nestjs",
  "api",
  "real-time",
  "node.js",
];

function absUrl(site: SiteConfig, path: string): string {
  if (!path) return site.url;
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function baseMetadata(site: SiteConfig, profile: Profile): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.title,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    keywords: [...SITE_KEYWORDS, profile.title],
    applicationName: site.name,
    authors: [{ name: profile.name, url: site.url }],
    openGraph: {
      type: "website",
      url: site.url,
      title: site.title,
      description: site.description,
      siteName: site.name,
      images: [{ url: absUrl(site, profile.avatar), width: 512, height: 512, alt: profile.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [absUrl(site, profile.avatar)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function projectMetadata(
  project: Project,
  site: SiteConfig,
  profile: Profile,
): Metadata {
  const image = project.cover || project.media.find((m) => m.type === "image")?.url;
  return {
    title: project.title,
    description: project.description,
    keywords: [...SITE_KEYWORDS, project.category, ...project.technologies],
    openGraph: {
      type: "article",
      title: `${project.title} — ${site.name}`,
      description: project.description,
      url: `${site.url}/projects/${project.slug}`,
      siteName: site.name,
      authors: [profile.name],
      images: image
        ? [{ url: absUrl(site, image), alt: project.title }]
        : [{ url: absUrl(site, profile.avatar), alt: profile.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.name}`,
      description: project.description,
      images: image ? [absUrl(site, image)] : [absUrl(site, profile.avatar)],
    },
  };
}

/* JSON-LD snippets for search engines. */

export function personJsonLd(site: SiteConfig, profile: Profile, projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: site.url,
    image: absUrl(site, profile.avatar),
    description: profile.summary,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: Object.values(profile.socials).filter(Boolean),
    hasOccupation: {
      "@type": "Occupation",
      name: profile.title,
    },
    knowsAbout: projects.flatMap((p) => p.technologies),
  };
}

export function projectJsonLd(project: Project, site: SiteConfig, profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${site.url}/projects/${project.slug}`,
    creator: { "@type": "Person", name: profile.name, url: site.url },
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    keywords: project.technologies.join(", "),
    image: project.cover || undefined,
  };
}
