import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
  InstagramIcon,
  DribbbleIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import type { SocialLinks } from "@/lib/db/types";

export interface SocialLink {
  key: string;
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
}

const ICONS: Record<string, { label: string; Icon: React.ComponentType<{ size?: number }> }> = {
  github: { label: "GitHub", Icon: GithubIcon },
  twitter: { label: "X (Twitter)", Icon: XIcon },
  linkedin: { label: "LinkedIn", Icon: LinkedinIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  dribbble: { label: "Dribbble", Icon: DribbbleIcon },
  youtube: { label: "YouTube", Icon: YoutubeIcon },
};

export function socialLinkList(socials: SocialLinks): SocialLink[] {
  return (Object.keys(ICONS) as (keyof SocialLinks)[])
    .filter((key) => Boolean(socials[key]))
    .map((key) => ({
      key,
      href: socials[key],
      ...ICONS[key],
    }));
}
