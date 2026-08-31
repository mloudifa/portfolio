import { getDbShape, getFeaturedProjects } from "@/lib/db/repo";
import { personJsonLd } from "@/lib/seo";
import { NAV_ITEMS } from "@/config/nav";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ArtSection } from "@/components/home/ArtSection";
import { BlogSection } from "@/components/home/BlogSection";
import { ContactSection } from "@/components/home/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await getDbShape();
  const { site, profile, skills, experience, education, blog } = db;
  const projects = await getFeaturedProjects(6);
  const currentYear = new Date().getFullYear();

  const startYears = experience.map((e) => parseInt(e.year, 10)).filter((y) => !Number.isNaN(y));
  const yearsExperience =
    startYears.length > 0 ? Math.max(3, currentYear - Math.min(...startYears)) : 3;
  const techCount = skills.reduce((sum, group) => sum + group.techs.length, 0);

  const stats = [
    { value: `${yearsExperience}+`, label: "Years experience" },
    { value: String(projects.length), label: "Featured projects" },
    { value: String(techCount), label: "Technologies" },
  ];

  return (
    <>
      <JsonLd data={personJsonLd(site, profile, projects)} />
      <Navbar name={profile.name} items={NAV_ITEMS} />
      <main id="main-content">
        <Hero profile={profile} socials={profile.socials} />
        <AboutSection profile={profile} stats={stats} />
        <SkillsSection skills={skills} />
        <ExperienceSection experience={experience} education={education} />
        <FeaturedProjects projects={projects} />
        <ArtSection art={db.art ?? []} />
        <BlogSection posts={blog.slice(0, 3)} />
        <ContactSection profile={profile} socials={profile.socials} />
      </main>
      <Footer name={profile.name} year={currentYear} socials={profile.socials} />
    </>
  );
}
