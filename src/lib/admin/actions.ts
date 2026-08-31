"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/password";
import {
  archiveProject,
  createProject,
  deleteArt,
  deleteBlogPost,
  deleteEducation,
  deleteExperience,
  deleteMessage,
  deleteProject,
  deleteSkillGroup,
  markMessageRead,
  setArtFeatured,
  setProjectFeatured,
  updateAdminCredentials,
  updateBlogPost,
  updateProfile,
  updateProject,
  updateSiteConfig,
  upsertArt,
  upsertEducation,
  upsertExperience,
  upsertSkillGroup,
} from "@/lib/db/repo";
import type {
  ArtItem,
  MediaItem,
  Project,
  SiteConfig,
  SkillGroup,
  ExperienceItem,
  EducationItem,
  BlogPost,
} from "@/lib/db/types";

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    await requireAdmin();
    const data = await fn();
    revalidatePath("/admin", "layout");
    revalidatePath("/", "layout");
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}
export async function saveSiteConfigAction(
  patch: Partial<SiteConfig>,
): Promise<ActionResult<SiteConfig>> {
  return run(() => updateSiteConfig(patch));
}

export async function saveProfileAction(
  patch: Parameters<typeof updateProfile>[0],
): Promise<ActionResult<Record<string, never>>> {
  return run(async () => {
    await updateProfile(patch);
    return {};
  });
}
export interface ProjectFormInput {
  title: string;
  slug?: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies: string[];
  featured: boolean;
  archived?: boolean;
  sourceUrl?: string;
  documentationUrl?: string;
  cover?: string;
  media?: MediaItem[];
  features?: string[];
  challenges?: string[];
  lessons?: string[];
}

export async function saveProjectAction(
  input: ProjectFormInput & { id?: string },
): Promise<ActionResult<Project>> {
  return run(async () => {
    if (input.id) {
      const updated = await updateProject(input.id, input);
      if (!updated) throw new Error("Project not found.");
      return updated;
    }
    return createProject(input);
  });
}

export async function toggleProjectFeaturedAction(
  id: string,
  featured: boolean,
): Promise<ActionResult<Project>> {
  return run(async () => {
    const p = await setProjectFeatured(id, featured);
    if (!p) throw new Error("Project not found.");
    return p;
  });
}

export async function toggleProjectArchiveAction(
  id: string,
  archived: boolean,
): Promise<ActionResult<Project>> {
  return run(async () => {
    const p = await archiveProject(id, archived);
    if (!p) throw new Error("Project not found.");
    return p;
  });
}

export async function removeProjectAction(id: string) {
  return run(async () => {
    await deleteProject(id);
  });
}
export async function saveSkillGroupAction(
  input: { id?: string; category: string; techs: string[] },
): Promise<ActionResult<SkillGroup>> {
  return run(() => upsertSkillGroup(input));
}

export async function removeSkillGroupAction(id: string) {
  return run(async () => {
    await deleteSkillGroup(id);
  });
}

export async function saveExperienceAction(
  input: Omit<ExperienceItem, "id"> & { id?: string },
): Promise<ActionResult<ExperienceItem>> {
  return run(() => upsertExperience(input));
}

export async function removeExperienceAction(id: string) {
  return run(async () => {
    await deleteExperience(id);
  });
}

export async function saveEducationAction(
  input: Omit<EducationItem, "id"> & { id?: string },
): Promise<ActionResult<EducationItem>> {
  return run(() => upsertEducation(input));
}

export async function removeEducationAction(id: string) {
  return run(async () => {
    await deleteEducation(id);
  });
}
export async function saveBlogPostAction(
  input: Partial<BlogPost> & { id?: string },
): Promise<ActionResult<BlogPost>> {
  return run(async () => {
    if (input.id) {
      const post = await updateBlogPost(input.id, input);
      if (!post) throw new Error("Post not found.");
      return post;
    }
    throw new Error("Creating posts from the admin is not supported yet.");
  });
}

export async function removeBlogPostAction(id: string) {
  return run(async () => {
    await deleteBlogPost(id);
  });
}
export async function saveArtAction(
  input: Omit<ArtItem, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<ActionResult<ArtItem>> {
  return run(() => upsertArt(input));
}

export async function toggleArtFeaturedAction(
  id: string,
  featured: boolean,
): Promise<ActionResult<ArtItem>> {
  return run(async () => {
    const a = await setArtFeatured(id, featured);
    if (!a) throw new Error("Art piece not found.");
    return a;
  });
}

export async function removeArtAction(id: string) {
  return run(async () => {
    await deleteArt(id);
  });
}
export async function toggleMessageReadAction(
  id: string,
  read: boolean,
) {
  return run(async () => {
    await markMessageRead(id, read);
  });
}

export async function removeMessageAction(id: string) {
  return run(async () => {
    await deleteMessage(id);
  });
}
export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized." };
  }

  const { getDb } = await import("@/lib/db/store");
  const { verifyPassword } = await import("@/lib/auth/password");
  const db = await getDb();

  if (input.newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }
  const valid = await verifyPassword(input.currentPassword, db.admin.passwordHash);
  if (!valid) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const newHash = await hashPassword(input.newPassword);
  await updateAdminCredentials({ passwordHash: newHash });
  revalidatePath("/admin");
  return { ok: true };
}
