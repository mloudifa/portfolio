import { getDbShape } from "@/lib/db/repo";
import { updateProfile, updateSiteConfig } from "@/lib/db/repo";
import type { Profile, SiteConfig } from "@/lib/db/types";

/**
 * Typed configuration module — the single source for site-wide settings.
 *
 * Reads and writes are backed by the persisted `data/db.json` store (via the
 * repository layer), so anything modified here is saved and survives restarts.
 * The public site and the admin panel both go through this module.
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
 * Load only the minimal settings needed by the site shell (metadata, accent,
 * nav name). Chev only touches read paths, safe to call in layouts.
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
