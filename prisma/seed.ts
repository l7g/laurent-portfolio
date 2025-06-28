import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Setting up portfolio admin...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "laurentgagne.portfolio@gmail.com" },
    update: {},
    create: {
      email: "laurentgagne.portfolio@gmail.com",
      name: "Laurent Gagné",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create default site settings
  const defaultSettings = [
    {
      key: "site_title",
      value: "Laurent Gagné - Portfolio",
      type: "TEXT" as const,
      description: "Main site title",
    },
    {
      key: "site_description",
      value:
        "Full-stack developer passionate about creating innovative solutions",
      type: "TEXT" as const,
      description: "Site meta description",
    },
    {
      key: "hero_image",
      value: "/hero-image.png",
      type: "IMAGE" as const,
      description: "Hero section background image",
    },
    {
      key: "profile_image",
      value: "/profile-image.jpg",
      type: "IMAGE" as const,
      description: "Profile photo",
    },
    {
      key: "github_url",
      value: "https://github.com/laurentgagne",
      type: "URL" as const,
      description: "GitHub profile URL",
    },
    {
      key: "linkedin_url",
      value: "https://linkedin.com/in/laurentgagne",
      type: "URL" as const,
      description: "LinkedIn profile URL",
    },
    {
      key: "email",
      value: "laurentgagne.portfolio@gmail.com",
      type: "TEXT" as const,
      description: "Contact email",
    },
    {
      key: "phone",
      value: "+1 (555) 123-4567",
      type: "TEXT" as const,
      description: "Contact phone",
    },
    {
      key: "location",
      value: "Montreal, Canada",
      type: "TEXT" as const,
      description: "Location",
    },
    {
      key: "primary_color",
      value: "#f98a07",
      type: "COLOR" as const,
      description: "Primary brand color",
    },
    {
      key: "resume_url",
      value: "/resume.pdf",
      type: "URL" as const,
      description: "Resume/CV download link",
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Create default portfolio sections
  await prisma.portfolioSection.createMany({
    data: [
      {
        name: "hero",
        displayName: "Hero Section",
        sectionType: "HERO" as const,
        title: "Laurent Gagné",
        subtitle: "Full-Stack Developer",
        description: "I create digital experiences that make a difference",
        isActive: true,
        sortOrder: 0,
        content: {
          ctaText: "View My Work",
          ctaLink: "#projects",
          backgroundStyle: "gradient",
        },
      },
      {
        name: "about",
        displayName: "About Me",
        sectionType: "ABOUT" as const,
        title: "About Me",
        subtitle: "Passionate Developer",
        description:
          "I'm a full-stack developer with expertise in modern web technologies...",
        isActive: true,
        sortOrder: 1,
        content: {
          experience: "5+ years",
          projectsCompleted: "50+",
          technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        },
      },
      {
        name: "projects",
        displayName: "Projects",
        sectionType: "PROJECTS" as const,
        title: "Featured Projects",
        subtitle: "Recent Work",
        description:
          "Here are some of my recent projects that showcase my skills",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "skills",
        displayName: "Skills",
        sectionType: "SKILLS" as const,
        title: "Technical Skills",
        subtitle: "Technologies & Tools",
        description: "Technologies I work with on a regular basis",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "contact",
        displayName: "Contact",
        sectionType: "CONTACT" as const,
        title: "Get In Touch",
        subtitle: "Let's Work Together",
        description: "I'm always open to discussing new opportunities",
        isActive: true,
        sortOrder: 4,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample projects
  await prisma.project.createMany({
    data: [
      {
        title: "E-commerce Platform",
        slug: "ecommerce-platform",
        description:
          "A full-featured e-commerce platform built with Next.js and Stripe",
        shortDesc: "Modern e-commerce solution",
        technologies: [
          "Next.js",
          "TypeScript",
          "Prisma",
          "Stripe",
          "TailwindCSS",
        ],
        featured: true,
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/username/ecommerce",
        highlights: [
          "Payment processing",
          "Admin dashboard",
          "Responsive design",
        ],
        sortOrder: 0,
      },
      {
        title: "Task Management App",
        slug: "task-management",
        description:
          "A collaborative task management application with real-time updates",
        shortDesc: "Productivity and collaboration tool",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
        featured: true,
        liveUrl: "https://taskapp.com",
        githubUrl: "https://github.com/username/taskapp",
        highlights: [
          "Real-time collaboration",
          "Drag & drop interface",
          "Team workspaces",
        ],
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample skills
  await prisma.skill.createMany({
    data: [
      {
        name: "React",
        category: "FRONTEND" as const,
        level: 90,
        icon: "⚛️",
        sortOrder: 0,
      },
      {
        name: "TypeScript",
        category: "FRONTEND" as const,
        level: 85,
        icon: "📘",
        sortOrder: 1,
      },
      {
        name: "Next.js",
        category: "FRONTEND" as const,
        level: 88,
        icon: "▲",
        sortOrder: 2,
      },
      {
        name: "Node.js",
        category: "BACKEND" as const,
        level: 85,
        icon: "💚",
        sortOrder: 3,
      },
      {
        name: "PostgreSQL",
        category: "DATABASE" as const,
        level: 80,
        icon: "🐘",
        sortOrder: 4,
      },
      {
        name: "Prisma",
        category: "DATABASE" as const,
        level: 85,
        icon: "🔺",
        sortOrder: 5,
      },
      {
        name: "TailwindCSS",
        category: "FRONTEND" as const,
        level: 90,
        icon: "🎨",
        sortOrder: 6,
      },
      {
        name: "Git",
        category: "TOOLS" as const,
        level: 88,
        icon: "📦",
        sortOrder: 7,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Portfolio admin setup completed!");
  console.log(`👤 Admin user: ${admin.email} / admin123`);
  console.log(`🔗 Admin URL: /admin (to be created)`);
}

main()
  .catch((e) => {
    console.error("❌ Error setting up portfolio admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
