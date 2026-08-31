# My Portfolio

Hey, I'm **Mohammed Loudifa** — a software engineer focused mostly on the backend, but I'll happily touch the whole stack when I need to. This repo is my personal portfolio site, the place where I put the projects I'm actually proud of: real-time APIs, AI integrations, full-stack apps, and the systems-level stuff I build for fun on the side.

## What's on here

- **Home** — a quick intro with a typewriter headline, my summary, and the projects I want people to look at first
- **About** — who I am, what I care about, my experience and education
- **Projects** — all my work with image galleries, tech badges, and a full breakdown per project
- **Blog** — my writing (I'll start actually writing soon, promise)
- **Contact** — a form you can use to reach me, plus links to find me elsewhere

## The stack

I built it with the tools I reach for day to day:

| Tech | What I use it for |
|---|---|
| [Next.js](https://nextjs.org/) | The framework, with the App Router |
| [React](https://react.dev/) | The UI |
| [TypeScript](https://www.typescriptlang.org/) | Keeping the whole thing type-safe |
| [Tailwind CSS](https://tailwindcss.com/) | Styling, the v4 version |
| [Framer Motion](https://motion.dev/) | Animations and the modal/lightbox effects |
| [Lucide React](https://lucide.dev/) | Icons |

## Running it locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
```

## Content and the admin panel

All the content you see on the site — bio, skills, projects, blog, contact info — lives in `data/db.json`. I didn't want to hard-code everything and edit files by hand every time, so there's an admin panel at `/admin` where I can update the site from the browser: manage projects and their images, tweak the profile, watch contact messages come in, and change site settings.

I keep the actual images I upload under `public/uploads` and the screenshots for each project under `public/assets/projects/`, so everything stays in the repo and the site is fully self-contained (no external image hosting to fiddle with).

## Notes

- The blog section is ready but empty for now — and that's fine, it gives me somewhere to put things when I start writing properly.
- Want to use something like this for yourself? Go for it. It's a personal project, so treat it as a starting point rather than a template to copy blindly.
