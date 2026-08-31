import { getDb, updateDb } from "./store";
import type {
  ArtItem,
  BlogPost,
  DbShape,
  EducationItem,
  ExperienceItem,
  MediaItem,
  Project,
  Profile,
  SkillGroup,
} from "./types";
import { slugify, uniqueId } from "@/lib/utils/id";

/* Reads — these just return stored data. */

export function getSite(db: DbShape) {
  return db.site;
}

export function getProfile(db: DbShape) {
  return db.profile;
}

export function getSkills(db: DbShape) {
  return db.skills;
}

export function getExperience(db: DbShape) {
  return db.experience;
}

export function getEducation(db: DbShape) {
  return db.education;
}

export function getBlog(db: DbShape) {
  return db.blog;
}

export function getArt(db: DbShape) {
  return db.art ?? [];
}

export async function getDbShape(): Promise<DbShape> {
  return getDb();
}

/** Public projects, excluding archived ones. */
export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  return db.projects
    .filter((p) => !p.archived)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** All projects including archived (admin view). */
export async function listAllProjects(): Promise<Project[]> {
  const db = await getDb();
  return [...db.projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const db = await getDb();
  return db.projects
    .filter((p) => p.featured && !p.archived)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDb();
  return db.projects.find((p) => p.slug === slug && !p.archived) ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = await getDb();
  return db.projects.find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<string[]> {
  const db = await getDb();
  return db.site.categories;
}

/* Writes — everything that mutates stored data. */

export interface ProjectInput {
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

export async function createProject(input: ProjectInput): Promise<Project> {
  const now = new Date().toISOString();
  const media = (input.media ?? [])
    .filter((m) => m.url.trim())
    .sort((a, b) => a.order - b.order)
    .map((m) => ({ ...m, url: m.url.trim() }));
  const cover = (input.cover?.trim() || media.find((m) => m.type === "image")?.url || "").trim();
  const project: Project = {
    id: uniqueId("project"),
    slug: slugify(input.slug?.trim() || input.title),
    title: input.title.trim(),
    description: input.description.trim(),
    longDescription: (input.longDescription ?? "").trim(),
    category: input.category.trim(),
    technologies: input.technologies.map((t) => t.trim()).filter(Boolean),
    featured: input.featured,
    archived: input.archived ?? false,
    sourceUrl: (input.sourceUrl ?? "").trim(),
    documentationUrl: (input.documentationUrl ?? "").trim(),
    cover,
    media,
    features: (input.features ?? []).filter(Boolean),
    challenges: (input.challenges ?? []).filter(Boolean),
    lessons: (input.lessons ?? []).filter(Boolean),
    createdAt: now,
    updatedAt: now,
  };
  await updateDb((db) => {
    db.projects.unshift(project);
  });
  return project;
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project | null> {
  let result: Project | null = null;
  const now = new Date().toISOString();
  await updateDb((db) => {
    const existing = db.projects.find((p) => p.id === id);
    if (!existing) return;
    const media = (input.media ?? existing.media)
      .filter((m) => m.url.trim())
      .sort((a, b) => a.order - b.order)
      .map((m) => ({ ...m, url: m.url.trim() }));
    existing.slug = slugify(input.slug?.trim() || input.title);
    existing.title = input.title.trim();
    existing.description = input.description.trim();
    existing.longDescription = (input.longDescription ?? "").trim();
    existing.category = input.category.trim();
    existing.technologies = input.technologies.map((t) => t.trim()).filter(Boolean);
    existing.featured = input.featured;
    existing.archived = input.archived ?? existing.archived;
    existing.sourceUrl = (input.sourceUrl ?? "").trim();
    existing.documentationUrl = (input.documentationUrl ?? "").trim();
    existing.cover = (input.cover?.trim() || media.find((m) => m.type === "image")?.url || "").trim();
    existing.media = media;
    existing.features = (input.features ?? []).filter(Boolean);
    existing.challenges = (input.challenges ?? []).filter(Boolean);
    existing.lessons = (input.lessons ?? []).filter(Boolean);
    existing.updatedAt = now;
    result = existing;
  });
  return result;
}

export async function setProjectFeatured(id: string, featured: boolean): Promise<Project | null> {
  let result: Project | null = null;
  await updateDb((db) => {
    const p = db.projects.find((x) => x.id === id);
    if (!p) return;
    p.featured = featured;
    p.updatedAt = new Date().toISOString();
    result = p;
  });
  return result;
}

export async function archiveProject(id: string, archived: boolean): Promise<Project | null> {
  let result: Project | null = null;
  await updateDb((db) => {
    const p = db.projects.find((x) => x.id === id);
    if (!p) return;
    p.archived = archived;
    p.updatedAt = new Date().toISOString();
    result = p;
  });
  return result;
}

export async function deleteProject(id: string): Promise<boolean> {
  let removed = false;
  await updateDb((db) => {
    const before = db.projects.length;
    db.projects = db.projects.filter((p) => p.id !== id);
    removed = db.projects.length < before;
  });
  return removed;
}

export async function updateProfile(
  patch: Partial<Omit<Profile, "socials">> & { socials?: Partial<Profile["socials"]> },
): Promise<Profile> {
  let result!: Profile;
  await updateDb((db) => {
    const { socials, ...rest } = patch;
    if (socials) {
      db.profile.socials = { ...db.profile.socials, ...socials };
    }
    if (rest.bio !== undefined) db.profile.bio = rest.bio;
    if (rest.tagline !== undefined) db.profile.tagline = rest.tagline;
    db.profile = {
      ...db.profile,
      ...rest,
      bio: db.profile.bio,
      tagline: db.profile.tagline,
      socials: db.profile.socials,
    };
    result = db.profile;
  });
  return result;
}

export async function updateSiteConfig(
  patch: Partial<DbShape["site"]>,
): Promise<DbShape["site"]> {
  let result!: DbShape["site"];
  await updateDb((db) => {
    db.site = { ...db.site, ...patch };
    result = db.site;
  });
  return result;
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const db = await getDb();
  return db.skills;
}

export async function upsertSkillGroup(
  input: { id?: string; category: string; techs: string[] },
): Promise<SkillGroup> {
  let result!: SkillGroup;
  await updateDb((db) => {
    const group: SkillGroup = {
      id: input.id?.trim() || uniqueId("skill"),
      category: input.category.trim(),
      techs: input.techs.map((t) => t.trim()).filter(Boolean),
    };
    const idx = db.skills.findIndex((s) => s.id === group.id);
    if (idx >= 0) db.skills[idx] = group;
    else db.skills.push(group);
    result = group;
  });
  return result;
}

export async function deleteSkillGroup(id: string): Promise<boolean> {
  let removed = false;
  await updateDb((db) => {
    const before = db.skills.length;
    db.skills = db.skills.filter((s) => s.id !== id);
    removed = db.skills.length < before;
  });
  return removed;
}

export async function upsertExperience(
  input: Omit<ExperienceItem, "id"> & { id?: string },
): Promise<ExperienceItem> {
  let result!: ExperienceItem;
  await updateDb((db) => {
    const item: ExperienceItem = {
      id: input.id?.trim() || uniqueId("exp"),
      ...input,
      techs: input.techs.map((t) => t.trim()).filter(Boolean),
    };
    const idx = db.experience.findIndex((e) => e.id === item.id);
    if (idx >= 0) db.experience[idx] = item;
    else db.experience.push(item);
    result = item;
  });
  return result;
}

export async function deleteExperience(id: string): Promise<boolean> {
  let removed = false;
  await updateDb((db) => {
    const before = db.experience.length;
    db.experience = db.experience.filter((e) => e.id !== id);
    removed = db.experience.length < before;
  });
  return removed;
}

export async function upsertEducation(
  input: Omit<EducationItem, "id"> & { id?: string },
): Promise<EducationItem> {
  let result!: EducationItem;
  await updateDb((db) => {
    const item: EducationItem = { id: input.id?.trim() || uniqueId("edu"), ...input };
    const idx = db.education.findIndex((e) => e.id === item.id);
    if (idx >= 0) db.education[idx] = item;
    else db.education.push(item);
    result = item;
  });
  return result;
}

export async function deleteEducation(id: string): Promise<boolean> {
  let removed = false;
  await updateDb((db) => {
    const before = db.education.length;
    db.education = db.education.filter((e) => e.id !== id);
    removed = db.education.length < before;
  });
  return removed;
}

export async function createBlogPost(
  input: Omit<BlogPost, "id" | "slug">,
): Promise<BlogPost> {
  const post: BlogPost = {
    ...input,
    id: uniqueId("blog"),
    slug: slugify(input.title),
  };
  await updateDb((db) => {
    db.blog.unshift(post);
  });
  return post;
}

export async function updateBlogPost(
  id: string,
  input: Partial<Omit<BlogPost, "id">>,
): Promise<BlogPost | null> {
  let result: BlogPost | null = null;
  await updateDb((db) => {
    const post = db.blog.find((p) => p.id === id);
    if (!post) return;
    Object.assign(post, input, input.title ? { slug: slugify(input.title) } : {});
    result = post;
  });
  return result;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  let removed = false;
  await updateDb((db) => {
    const before = db.blog.length;
    db.blog = db.blog.filter((p) => p.id !== id);
    removed = db.blog.length < before;
  });
  return removed;
}

export async function getArtItems(): Promise<ArtItem[]> {
  const db = await getDb();
  return [...(db.art ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getFeaturedArt(limit = 9): Promise<ArtItem[]> {
  const db = await getDb();
  return (db.art ?? [])
    .filter((a) => a.featured)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export async function upsertArt(
  input: Omit<ArtItem, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<ArtItem> {
  let result!: ArtItem;
  const now = new Date().toISOString();
  await updateDb((db) => {
    const images = input.images.map((u) => u.trim()).filter(Boolean);
    const existing = db.art?.find((a) => a.id === input.id);
    const item: ArtItem = {
      id: existing?.id || input.id?.trim() || uniqueId("art"),
      title: input.title.trim(),
      description: input.description.trim(),
      year: input.year.trim(),
      images,
      featured: input.featured,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    if (!db.art) db.art = [];
    const idx = db.art.findIndex((a) => a.id === item.id);
    if (idx >= 0) db.art[idx] = item;
    else db.art.push(item);
    result = item;
  });
  return result;
}

export async function setArtFeatured(id: string, featured: boolean): Promise<ArtItem | null> {
  let result: ArtItem | null = null;
  await updateDb((db) => {
    const a = db.art?.find((x) => x.id === id);
    if (!a) return;
    a.featured = featured;
    a.updatedAt = new Date().toISOString();
    result = a;
  });
  return result;
}

export async function deleteArt(id: string): Promise<boolean> {
  let removed = false;
  await updateDb((db) => {
    const before = db.art?.length ?? 0;
    db.art = (db.art ?? []).filter((a) => a.id !== id);
    removed = (db.art?.length ?? 0) < before;
  });
  return removed;
}

export async function addContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await updateDb((db) => {
    db.messages.unshift({
      id: uniqueId("msg"),
      name: input.name.trim(),
      email: input.email.trim(),
      message: input.message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    });
  });
}

export async function listMessages(): Promise<DbShape["messages"]> {
  const db = await getDb();
  return [...db.messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  await updateDb((db) => {
    const m = db.messages.find((x) => x.id === id);
    if (m) m.read = read;
  });
}

export async function deleteMessage(id: string): Promise<void> {
  await updateDb((db) => {
    db.messages = db.messages.filter((m) => m.id !== id);
  });
}

export async function updateAdminCredentials(input: {
  name?: string;
  email?: string;
  passwordHash?: string;
}): Promise<void> {
  await updateDb((db) => {
    if (input.name) db.admin.name = input.name;
    if (input.email) db.admin.email = input.email.trim().toLowerCase();
    if (input.passwordHash) db.admin.passwordHash = input.passwordHash;
  });
}
