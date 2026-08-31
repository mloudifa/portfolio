import { getDbShape } from "@/lib/db/repo";
import { updateProfile, updateSiteConfig } from "@/lib/db/repo";
import type { Profile, SiteConfig } from "@/lib/db/types";

/**
 * Central place for the site's own settings. Backed by data/db.json, so
 * anything I change here from the admin panel sticks after a restart.
 */

export interface SiteSettings {
  site: SiteConfig;
  profile: Profile;
}

/** Load the full site configuration (site metadata + owner profile). */
export async function loadConfig(): Promise<SiteSettings> {
  const db = await getDbShape();
  return { site: db.site, profile: db.profile };
}

/**
 * Minimal settings for the site shell (metadata, accent, nav name).
 * Only touches read paths, so it's safe to call in layouts.
 */
export async function loadPublicConfig(): Promise<{
  site: SiteConfig;
  name: string;
}> {
  const db = await getDbShape();
  return { site: db.site, name: db.profile.name };
}

/** Persist changes to the site metadata (name, title, description, accent, …). */
export async function saveSiteConfig(
  patch: Partial<SiteConfig>,
): Promise<SiteConfig> {
  return updateSiteConfig(patch);
}

/** Persist changes to the owner profile (bio, title, socials, …). */
export async function saveProfile(
  patch: Partial<Profile> & { socials?: Partial<Profile["socials"]> },
): Promise<Profile> {
  return updateProfile(patch);
}
