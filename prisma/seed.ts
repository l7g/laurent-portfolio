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

  // Create sample projects based on the reference images
  await prisma.project.createMany({
    data: [
      {
        title: "E-Commerce Dashboard",
        slug: "ecommerce-dashboard",
        description:
          "Modern e-commerce administration platform with comprehensive inventory management, analytics, and user interface design. Built with scalability and real-world business needs in mind.",
        shortDesc: "Available for freelancing - Contact for custom development",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Chart.js"],
        featured: true,
        status: "READY",
        image: "placeholder-ecommerce", // This will use the placeholder component
        liveUrl: "#",
        githubUrl: "#",
        highlights: [
          "Comprehensive inventory management system",
          "Advanced analytics and reporting dashboard",
          "Modern, responsive user interface design",
          "Built for scalability and business growth",
          "Real-world e-commerce workflow integration",
        ],
        sortOrder: 0,
        isActive: true,
      },
      {
        title: "Tracker - Political Data Platform",
        slug: "tracker-political-platform",
        description:
          "A comprehensive data platform built with Next.js, designed to handle complex political information with enterprise-level architecture. Features advanced user authentication, role-based access control, and scalable database design patterns.",
        shortDesc:
          "Personal project currently in development. Code is private. Contact me to discuss my development approach and capabilities.",
        technologies: [
          "Next.js",
          "TypeScript",
          "Prisma",
          "PostgreSQL",
          "TailwindCSS",
          "NextAuth.js",
        ],
        featured: true,
        status: "WIP",
        image: "/projects/tracker-preview.png",
        liveUrl: "#", // Will be updated when ready
        githubUrl: "#", // Private repo
        highlights: [
          "Enterprise-grade data architecture and modeling",
          "Advanced authentication & authorization systems",
          "Responsive, modern UI with optimal user experience",
          "Complex database relationships and optimization",
          "Scalable role-based access control implementation",
        ],
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "Task Management App",
        slug: "task-management-app",
        description:
          "Professional task management solution featuring real-time collaboration, advanced project tracking, and intuitive user experience design for team productivity.",
        shortDesc: "Available for freelancing - Contact for custom development",
        technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL"],
        featured: false,
        status: "WIP",
        image: "placeholder-tasks", // This will use the placeholder component
        liveUrl: "#",
        githubUrl: "#",
        highlights: [
          "Real-time collaboration features",
          "Advanced project tracking capabilities",
          "Intuitive user experience design",
          "Team productivity optimization",
          "Scalable architecture for growing teams",
        ],
        sortOrder: 2,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample skills based on the reference image
  await prisma.skill.createMany({
    data: [
      // Frontend Development (🔧 icon in reference)
      {
        name: "JavaScript",
        category: "FRONTEND" as const,
        level: 90,
        color: "primary",
        sortOrder: 0,
      },
      {
        name: "React/Next.js",
        category: "FRONTEND" as const,
        level: 85,
        color: "primary",
        sortOrder: 1,
      },
      {
        name: "TypeScript",
        category: "FRONTEND" as const,
        level: 82,
        color: "primary",
        sortOrder: 2,
      },
      {
        name: "TailwindCSS",
        category: "FRONTEND" as const,
        level: 80,
        color: "primary",
        sortOrder: 3,
      },

      // Backend Development (🎒 icon in reference)
      {
        name: "Node.js",
        category: "BACKEND" as const,
        level: 82,
        color: "secondary",
        sortOrder: 4,
      },
      {
        name: "Express.js",
        category: "BACKEND" as const,
        level: 80,
        color: "secondary",
        sortOrder: 5,
      },
      {
        name: "REST APIs",
        category: "BACKEND" as const,
        level: 85,
        color: "secondary",
        sortOrder: 6,
      },
      {
        name: "C# / .NET",
        category: "BACKEND" as const,
        level: 72,
        color: "secondary",
        sortOrder: 7,
      },

      // Database & ORM (🗃️ icon in reference)
      {
        name: "SQL",
        category: "DATABASE" as const,
        level: 85,
        color: "success",
        sortOrder: 8,
      },
      {
        name: "PostgreSQL",
        category: "DATABASE" as const,
        level: 80,
        color: "success",
        sortOrder: 9,
      },
      {
        name: "Prisma",
        category: "DATABASE" as const,
        level: 82,
        color: "success",
        sortOrder: 10,
      },
      {
        name: "MS SQL",
        category: "DATABASE" as const,
        level: 75,
        color: "success",
        sortOrder: 11,
      },

      // Tools & Version Control (☁️ icon in reference)
      {
        name: "Git/GitHub",
        category: "TOOLS" as const,
        level: 90,
        color: "warning",
        sortOrder: 12,
      },
      {
        name: "Vercel",
        category: "TOOLS" as const,
        level: 85,
        color: "warning",
        sortOrder: 13,
      },
      {
        name: "MongoDB",
        category: "TOOLS" as const,
        level: 55,
        color: "warning",
        sortOrder: 14,
      },
      {
        name: "GraphQL",
        category: "TOOLS" as const,
        level: 45,
        color: "warning",
        sortOrder: 15,
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
