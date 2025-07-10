"use client";

import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import EducationSkillsSection from "@/components/education-skills-section";
import ProjectsSection from "@/components/projects-section";
import BlogWidget from "@/components/blog-widget";
import ContactSection from "@/components/contact-section";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <EducationSkillsSection />
      <ProjectsSection />
      <BlogWidget />
      <ContactSection />
    </div>
  );
}
