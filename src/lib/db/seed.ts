import type { DbShape, Project } from "./types";import { hashPassword } from "@/lib/auth/password";

const now = new Date().toISOString();

function seedProject(
  partial: Omit<
    Project,
    | "id"
    | "slug"
    | "archived"
    | "media"
    | "longDescription"
    | "features"
    | "challenges"
    | "lessons"
    | "documentationUrl"
    | "cover"
    | "createdAt"
    | "updatedAt"
  > & { cover: string },
): Project {
  const slug = partial.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    ...partial,
    id: `project-${slug}`,
    slug,
    archived: false,
    cover: "",
    longDescription:
      partial.description,
    features: [],
    challenges: [],
    lessons: [],
    documentationUrl: "",
    media: [],
    createdAt: now,
    updatedAt: now,
  };
}

export async function createSeedDb(): Promise<DbShape> {
  return {
    version: 1,
    updatedAt: now,
    site: {
      name: "Mloudifa",
      title: "Mloudifa — Creative Developer & Designer",
      description:
        "Portfolio of Mloudifa, a creative developer crafting premium, accessible and performant digital experiences.",
      accentColor: "#8b5cf6",
      url: process.env.SITE_URL ?? "http://localhost:3000",
      categories: ["Web App", "Design System", "Tooling", "Open Source", "Game", "Data Visualization"],
    },
    profile: {
      name: "Mloudifa",
      title: "Creative Developer & Designer",
      tagline: ["Developer", "Designer", "Creator"],
      avatar: "/assets/avatar.svg",
      summary:
        "I'm a creative developer who turns complex problems into elegant, accessible and fast digital experiences — blending design thinking with clean engineering.",
      bio: [
        "I'm a creative developer who loves building beautiful, functional interfaces. With years of experience across the full stack, I turn complex problems into elegant digital experiences.",
        "My approach blends design thinking with clean engineering. Every pixel matters, every line of code serves a purpose.",
        "When I'm not coding, you'll find me exploring new tools, contributing to open source, or sketching UI concepts.",
      ],
      location: "Remote — Worldwide",
      availability: true,
      email: "hello@mloudifa.dev",
      cvUrl: "",
      socials: {
        github: "https://github.com/mloudifa",
        twitter: "https://twitter.com/mloudifa",
        linkedin: "https://linkedin.com/in/mloudifa",
        instagram: "https://instagram.com/mloudifa",
        dribbble: "",
        youtube: "",
      },
    },
    skills: [
      { id: "skill-frontend", category: "Frontend", techs: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"] },
      { id: "skill-backend", category: "Backend", techs: ["Node.js", "Python", "PostgreSQL", "GraphQL", "REST APIs"] },
      { id: "skill-tools", category: "Tools & Design", techs: ["Figma", "Git", "Docker", "VS Code", "Vercel"] },
    ],
    experience: [
      {
        id: "exp-2025",
        year: "2025",
        title: "Senior Developer",
        company: "Creative Agency",
        period: "Jan 2024 – Present",
        description:
          "Leading frontend architecture and building scalable design systems for enterprise clients. Mentoring junior developers and driving technical decisions.",
        techs: ["React", "TypeScript", "Design Systems"],
      },
      {
        id: "exp-2023",
        year: "2023",
        title: "Full Stack Developer",
        company: "Tech Startup",
        period: "Jun 2022 – Dec 2023",
        description:
          "Built and shipped multiple products from concept to production. Worked across the entire stack with React, Node.js, and cloud infrastructure.",
        techs: ["Node.js", "React", "PostgreSQL"],
      },
      {
        id: "exp-2021",
        year: "2021",
        title: "Junior Developer",
        company: "Digital Studio",
        period: "Mar 2021 – May 2022",
        description:
          "Developed responsive web applications and contributed to internal tooling. Gained deep experience with modern frontend frameworks.",
        techs: ["JavaScript", "HTML", "CSS"],
      },
    ],
    education: [
      {
        id: "edu-1",
        period: "2017 – 2021",
        degree: "B.Sc. Computer Science",
        institution: "University of Technology",
        description:
          "Focused on software engineering, algorithms and human-computer interaction. Graduated with honors.",
      },
      {
        id: "edu-2",
        period: "2022",
        degree: "Advanced Frontend Engineering",
        institution: "Professional Certification",
        description:
          "Specialized track covering performance, accessibility, testing and modern React architecture.",
      },
    ],
    projects: [
      seedProject({
        title: "Project Aurora",
        description:
          "An accessibility-first design system with dark mode support and theming tokens, powering 20+ products.",
        category: "Design System",
        technologies: ["React", "TypeScript", "Storybook"],
        featured: true,
        sourceUrl: "https://github.com",
        cover: "/assets/projects/p1.svg",
      }),
      seedProject({
        title: "WeatherViz",
        description:
          "Real-time weather visualization dashboard with interactive maps and historical data charts.",
        category: "Data Visualization",
        technologies: ["Next.js", "D3.js", "OpenWeather API"],
        featured: true,
        sourceUrl: "https://github.com",
        cover: "/assets/projects/p2.svg",
      }),
      seedProject({
        title: "TaskFlow",
        description:
          "Kanban project management tool with drag-and-drop, real-time collaboration and team workspaces.",
        category: "Web App",
        technologies: ["React", "Node.js", "Socket.io"],
        featured: true,
        sourceUrl: "https://github.com",
        cover: "/assets/projects/p3.svg",
      }),
      seedProject({
        title: "PixelPlay",
        description:
          "Retro pixel-art game engine built with the Canvas API, featuring a sprite editor and level designer.",
        category: "Game",
        technologies: ["TypeScript", "Canvas API", "Web Workers"],
        featured: false,
        sourceUrl: "https://github.com",
        cover: "/assets/projects/p4.svg",
      }),
    ],
    blog: [
      {
        id: "blog-1",
        slug: "building-accessible-design-systems",
        title: "Building Accessible Design Systems",
        date: "2025-01-15",
        readingTime: "6 min read",
        excerpt:
          "Lessons learned from building a component library that works for everyone — from screen readers to keyboard navigation.",
        url: "https://example.com",
      },
      {
        id: "blog-2",
        slug: "art-of-performance-optimization",
        title: "The Art of Performance Optimization",
        date: "2024-11-20",
        readingTime: "8 min read",
        excerpt:
          "A deep dive into Core Web Vitals, lazy loading strategies, and how we cut our Largest Contentful Paint by 60%.",
        url: "https://example.com",
      },
      {
        id: "blog-3",
        slug: "why-i-switched-to-typescript",
        title: "Why I Switched to TypeScript",
        date: "2024-09-05",
        readingTime: "5 min read",
        excerpt:
          "A practical look at how TypeScript improved our code quality, developer experience, and team velocity.",
        url: "https://example.com",
      },
    ],
    art: [],
    messages: [],
    admin: {
      name: "Administrator",
      email: "admin@mloudifa.dev",
      role: "admin",
      passwordHash: await hashPassword("admin123"),
    },
  };
}
