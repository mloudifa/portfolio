export type MediaType = "image" | "video";
export type AdminRole = "admin";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  alt?: string;
  order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  featured: boolean;
  archived: boolean;
  sourceUrl: string;
  documentationUrl: string;
  cover: string;
  media: MediaItem[];
  features: string[];
  challenges: string[];
  lessons: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  techs: string[];
}

export interface ExperienceItem {
  id: string;
  year: string;
  title: string;
  company: string;
  period: string;
  description: string;
  techs: string[];
}

export interface EducationItem {
  id: string;
  period: string;
  degree: string;
  institution: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  url: string;
}

export interface ArtItem {
  id: string;
  title: string;
  description: string;
  year: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  github: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  dribbble: string;
  youtube: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string[];
  avatar: string;
  summary: string;
  bio: string[];
  location: string;
  availability: boolean;
  email: string;
  cvUrl: string;
  socials: SocialLinks;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  accentColor: string;
  url: string;
  categories: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AdminUser {
  name: string;
  email: string;
  role: AdminRole;
  passwordHash: string;
}

export interface DbShape {
  version: number;
  updatedAt: string;
  site: SiteConfig;
  profile: Profile;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: Project[];
  blog: BlogPost[];
  art: ArtItem[];
  messages: ContactMessage[];
  admin: AdminUser;
}
