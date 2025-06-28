const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function recreateAllContent() {
  console.log("🌱 Recreating all portfolio content from screenshots...");

  try {
    // Clear existing data
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.siteSetting.deleteMany();
    await prisma.portfolioSection.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Cleared existing data");

    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      12,
    );
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
    console.log("✅ Created admin user");

    // Create ALL site settings for every piece of text content
    const siteSettings = [
      // Hero Section Content
      {
        key: "hero_greeting",
        value: "Hi, I'm Laurent",
        type: "text",
        description: "Hero greeting text",
        isPublic: true,
      },
      {
        key: "hero_description",
        value:
          "Aspiring Full-Stack Developer building modern web applications through 3 years of self-study and hands-on learning",
        type: "text",
        description: "Hero description text",
        isPublic: true,
      },
      {
        key: "hero_cta_primary",
        value: "View My Work",
        type: "text",
        description: "Primary hero button text",
        isPublic: true,
      },
      {
        key: "hero_cta_secondary",
        value: "View CV",
        type: "text",
        description: "Secondary hero button text",
        isPublic: true,
      },

      // About Section Content
      {
        key: "about_title",
        value: "About Me",
        type: "text",
        description: "About section title",
        isPublic: true,
      },
      {
        key: "about_description",
        value:
          "I'm a passionate full-stack developer with a love for creating innovative web applications. With expertise in modern technologies and a keen eye for detail, I transform ideas into digital solutions that make a difference.",
        type: "text",
        description: "About section main description",
        isPublic: true,
      },
      {
        key: "about_journey_title",
        value: "My Journey",
        type: "text",
        description: "About journey section title",
        isPublic: true,
      },
      {
        key: "about_journey_description",
        value:
          "My passion for technology began early, and over the years I've developed expertise in both frontend and backend development. I specialize in creating seamless user experiences backed by robust, scalable architecture.\n\nWhen I'm not coding, you'll find me exploring new technologies, reading tech blogs, or experimenting with new frameworks. I believe in continuous learning and staying at the forefront of web development trends.",
        type: "text",
        description: "About journey description",
        isPublic: true,
      },

      // Projects Section Content
      {
        key: "projects_title",
        value: "Featured Projects",
        type: "text",
        description: "Projects section title",
        isPublic: true,
      },
      {
        key: "projects_description",
        value:
          "Comprehensive full-stack applications built with professional quality and scalability in mind. My flagship project showcases my capabilities, while other projects are available for custom development and freelancing opportunities.",
        type: "text",
        description: "Projects section description",
        isPublic: true,
      },
      {
        key: "projects_cta_text",
        value:
          "Interested in hiring me or need custom development work similar to these projects?",
        type: "text",
        description: "Projects section call-to-action text",
        isPublic: true,
      },
      {
        key: "projects_cta_button",
        value: "Get In Touch",
        type: "text",
        description: "Projects section CTA button text",
        isPublic: true,
      },

      // Skills Section Content
      {
        key: "skills_title",
        value: "Skills & Learning Journey",
        type: "text",
        description: "Skills section title",
        isPublic: true,
      },
      {
        key: "skills_description",
        value:
          "3 years of dedicated self-study in web development, with strong foundations in JavaScript and modern web technologies. Recently completed a 3-month C#/.NET course that deepened my understanding of database theory and backend architecture, making me more versatile across different tech stacks.",
        type: "text",
        description: "Skills section description",
        isPublic: true,
      },
      {
        key: "skills_technologies_title",
        value: "Technologies I'm Working With",
        type: "text",
        description: "Technologies section title",
        isPublic: true,
      },
      {
        key: "skills_growing_title",
        value: "Growing Skills & Interests",
        type: "text",
        description: "Growing skills section title",
        isPublic: true,
      },

      // Contact Section Content
      {
        key: "contact_title",
        value: "Get In Touch",
        type: "text",
        description: "Contact section title",
        isPublic: true,
      },
      {
        key: "contact_main_description",
        value:
          "I'm actively seeking my first professional opportunity in web development. Let's connect to discuss potential roles, collaborations, or just chat about technology and coding!",
        type: "text",
        description: "Contact section main description",
        isPublic: true,
      },
      {
        key: "contact_sidebar_title",
        value: "Let's Connect",
        type: "text",
        description: "Contact sidebar title",
        isPublic: true,
      },
      {
        key: "contact_sidebar_description",
        value:
          "I'm enthusiastic about starting my professional journey and eager to learn from experienced developers. Whether you have entry-level opportunities, mentorship, or just want to discuss code - I'd love to hear from you!",
        type: "text",
        description: "Contact sidebar description",
        isPublic: true,
      },
      {
        key: "contact_journey_title",
        value: "My Journey",
        type: "text",
        description: "Contact journey section title",
        isPublic: true,
      },
      {
        key: "contact_journey_stats",
        value: JSON.stringify([
          { label: "Years Learning", value: "3" },
          { label: "Accenture Intern", value: "6mo" },
          { label: "Commercial Projects", value: "3" },
          { label: "Client Work", value: "Real" },
        ]),
        type: "json",
        description: "Contact journey statistics",
        isPublic: true,
      },
      {
        key: "contact_email",
        value: "laurentgagne.dev@pm.me",
        type: "text",
        description: "Contact email address",
        isPublic: true,
      },
      {
        key: "contact_location",
        value: "Cagliari, IT",
        type: "text",
        description: "Current location",
        isPublic: true,
      },

      // Form Content
      {
        key: "contact_tab_general",
        value: "General Contact",
        type: "text",
        description: "General contact tab label",
        isPublic: true,
      },
      {
        key: "contact_tab_work",
        value: "Work Inquiry",
        type: "text",
        description: "Work inquiry tab label",
        isPublic: true,
      },
      {
        key: "contact_general_placeholder",
        value:
          "Tell me about opportunities, collaborations, or just say hello!",
        type: "text",
        description: "General contact form placeholder",
        isPublic: true,
      },
      {
        key: "contact_work_placeholder",
        value:
          "Tell me about the role, responsibilities, team, and what you're looking for in a candidate.",
        type: "text",
        description: "Work inquiry form placeholder",
        isPublic: true,
      },
      {
        key: "contact_success_message",
        value: "Message sent successfully! I'll get back to you soon.",
        type: "text",
        description: "Contact form success message",
        isPublic: true,
      },
      {
        key: "contact_error_message",
        value: "Failed to send message. Please try again or email me directly.",
        type: "text",
        description: "Contact form error message",
        isPublic: true,
      },
    ];

    // Create all site settings
    for (const setting of siteSettings) {
      await prisma.siteSetting.create({
        data: setting,
      });
    }
    console.log(`✅ Created ${siteSettings.length} site settings`);

    // Create portfolio sections
    await prisma.portfolioSection.createMany({
      data: [
        {
          name: "hero",
          displayName: "Hero Section",
          sectionType: "HERO",
          title: "Welcome",
          subtitle: "Full-Stack Developer",
          description: "Building Modern Software Solutions",
          content: JSON.stringify({
            description:
              "Passionate about creating scalable, user-focused solutions with cutting-edge technologies.",
          }),
          isActive: true,
          sortOrder: 1,
        },
        {
          name: "about",
          displayName: "About Section",
          sectionType: "ABOUT",
          title: "About Me",
          subtitle: null,
          description:
            "Experienced developer with expertise in modern web technologies.",
          content: JSON.stringify({
            highlights: [
              {
                title: "Full-Stack Development",
                description:
                  "Expertise in modern web technologies including React, Next.js, Node.js, and TypeScript",
                iconType: "code",
              },
              {
                title: "Database Design",
                description:
                  "Proficient in Prisma, PostgreSQL databases, with experience in C#, .NET, and MongoDB",
                iconType: "database",
              },
              {
                title: "Web Applications",
                description:
                  "Building scalable, responsive applications with focus on performance and user experience",
                iconType: "globe",
              },
              {
                title: "Modern Tools",
                description:
                  "Utilizing the latest development tools and frameworks to deliver cutting-edge solutions",
                iconType: "bolt",
              },
            ],
          }),
          isActive: true,
          sortOrder: 2,
        },
        {
          name: "projects",
          displayName: "Projects Section",
          sectionType: "PROJECTS",
          title: "Featured Projects",
          subtitle: null,
          description: "Showcasing my work and technical capabilities.",
          isActive: true,
          sortOrder: 3,
        },
        {
          name: "contact",
          displayName: "Contact Section",
          sectionType: "CONTACT",
          title: "Get In Touch",
          subtitle: null,
          description: "Let's discuss opportunities and collaborations.",
          isActive: true,
          sortOrder: 4,
        },
      ],
    });
    console.log("✅ Created portfolio sections");

    // Create projects based on screenshots - TRACKER AS FLAGSHIP
    await prisma.project.createMany({
      data: [
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
          featured: false, // FLAGSHIP PROJECT
          status: "WIP",
          image: "/projects/tracker-preview.png",
          liveUrl: "#",
          githubUrl: "#",
          highlights: [
            "Enterprise-grade data architecture and modeling",
            "Advanced authentication & authorization systems",
            "Responsive, modern UI with optimal user experience",
            "Complex database relationships and optimization",
            "Scalable role-based access control implementation",
          ],
          sortOrder: 0,
          isActive: true,
          showWipWarning: true,
          wipWarningText:
            "Personal project currently in development. Code is private. Contact me to discuss my development approach and capabilities.",
          wipWarningEmoji: "🚧",
        },
        {
          title: "E-Commerce Dashboard",
          slug: "ecommerce-dashboard",
          description:
            "Modern e-commerce administration platform with comprehensive inventory management, analytics, and user interface design. Built with scalability and real-world business needs in mind.",
          shortDesc:
            "Available for freelancing - Contact for custom development",
          technologies: ["React", "Node.js", "Express", "MongoDB", "Chart.js"],
          featured: true, // FLAGSHIP PROJECT
          status: "WIP",
          image: "placeholder-ecommerce",
          liveUrl: "#",
          githubUrl: "#",
          highlights: [
            "Comprehensive inventory management system",
            "Advanced analytics and reporting dashboard",
            "Modern, responsive user interface design",
            "Built for scalability and business growth",
            "Real-world e-commerce workflow integration",
          ],
          sortOrder: 1,
          isActive: true,
          showWipWarning: true,
          wipWarningText:
            "Available for freelancing - Contact for custom development",
          wipWarningEmoji: "⚠️",
        },
        {
          title: "Task Management App",
          slug: "task-management-app",
          description:
            "Professional task management solution featuring real-time collaboration, advanced project tracking, and intuitive user experience design for team productivity.",
          shortDesc:
            "Available for freelancing - Contact for custom development",
          technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL"],
          featured: false,
          status: "WIP",
          image: "placeholder-tasks",
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
          showWipWarning: true,
          wipWarningText:
            "Available for freelancing - Contact for custom development",
          wipWarningEmoji: "⚠️",
        },
      ],
    });
    console.log("✅ Created projects");

    // Create skills exactly as shown in screenshots
    await prisma.skill.createMany({
      data: [
        // Frontend Development
        {
          name: "JavaScript",
          category: "FRONTEND",
          level: 90,
          color: "primary",
          sortOrder: 0,
        },
        {
          name: "React/Next.js",
          category: "FRONTEND",
          level: 85,
          color: "primary",
          sortOrder: 1,
        },
        {
          name: "TypeScript",
          category: "FRONTEND",
          level: 82,
          color: "primary",
          sortOrder: 2,
        },
        {
          name: "TailwindCSS",
          category: "FRONTEND",
          level: 80,
          color: "primary",
          sortOrder: 3,
        },

        // Backend Development
        {
          name: "Node.js",
          category: "BACKEND",
          level: 82,
          color: "secondary",
          sortOrder: 4,
        },
        {
          name: "Express.js",
          category: "BACKEND",
          level: 80,
          color: "secondary",
          sortOrder: 5,
        },
        {
          name: "REST APIs",
          category: "BACKEND",
          level: 85,
          color: "secondary",
          sortOrder: 6,
        },
        {
          name: "C# / .NET",
          category: "BACKEND",
          level: 72,
          color: "secondary",
          sortOrder: 7,
        },

        // Database & ORM
        {
          name: "SQL",
          category: "DATABASE",
          level: 85,
          color: "success",
          sortOrder: 8,
        },
        {
          name: "PostgreSQL",
          category: "DATABASE",
          level: 80,
          color: "success",
          sortOrder: 9,
        },
        {
          name: "Prisma",
          category: "DATABASE",
          level: 82,
          color: "success",
          sortOrder: 10,
        },
        {
          name: "MS SQL",
          category: "DATABASE",
          level: 75,
          color: "success",
          sortOrder: 11,
        },

        // Tools & Version Control
        {
          name: "Git/GitHub",
          category: "TOOLS",
          level: 90,
          color: "warning",
          sortOrder: 12,
        },
        {
          name: "Vercel",
          category: "TOOLS",
          level: 85,
          color: "warning",
          sortOrder: 13,
        },
        {
          name: "MongoDB",
          category: "TOOLS",
          level: 55,
          color: "warning",
          sortOrder: 14,
        },
        {
          name: "GraphQL",
          category: "TOOLS",
          level: 45,
          color: "warning",
          sortOrder: 15,
        },
      ],
    });
    console.log("✅ Created skills");

    console.log("🎉 All content recreated successfully!");
    console.log("💾 All text content is now editable via admin dashboard");
  } catch (error) {
    console.error("❌ Failed to recreate content:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

recreateAllContent();
