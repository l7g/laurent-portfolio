const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const prisma = new PrismaClient();

async function seedProduction() {
  try {
    console.log("🌱 Production Database Seeding...");

    // 1. Create admin user from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Admin";

    if (adminEmail && adminPassword) {
      const existingAdmin = await prisma.users.findUnique({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        await prisma.users.create({
          data: {
            id: randomUUID(),
            email: adminEmail,
            name: adminName,
            role: "ADMIN",
            password: hashedPassword,
          },
        });

        console.log("✅ Admin user created");
      } else {
        console.log("✅ Admin user already exists");
      }
    } else {
      console.log("⚠️  No admin credentials provided in environment variables");
      console.log(
        "⚠️  Run `npm run setup:admin` after deployment to create admin user",
      );
    }

    // 2. Create basic portfolio sections (safe to include)
    const sections = [
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
        description:
          "Experienced developer with expertise in modern web technologies.",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "projects",
        displayName: "Projects Section",
        sectionType: "PROJECTS",
        title: "Featured Projects",
        description: "Showcasing my work and technical capabilities.",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "contact",
        displayName: "Contact Section",
        sectionType: "CONTACT",
        title: "Get In Touch",
        description: "Let's discuss your next project.",
        isActive: true,
        sortOrder: 4,
      },
    ];

    for (const section of sections) {
      const existing = await prisma.portfolio_sections.findFirst({
        where: { name: section.name },
      });

      if (!existing) {
        await prisma.portfolio_sections.create({
          data: {
            ...section,
            id: randomUUID(),
          },
        });
        console.log(`✅ Created section: ${section.name}`);
      }
    }

    // 3. Create basic skills (safe to include, avoid conflicts)
    const basicSkills = [
      { name: "JavaScript", category: "FRONTEND", level: 90 },
      { name: "TypeScript", category: "FRONTEND", level: 85 },
      // Note: Skip React, Next.js, Git individually since you have React/Next.js and Git/GitHub
      { name: "Node.js", category: "BACKEND", level: 80 },
      { name: "PostgreSQL", category: "DATABASE", level: 75 },
      { name: "Prisma", category: "DATABASE", level: 80 },
    ];

    for (const skill of basicSkills) {
      const existing = await prisma.skills.findFirst({
        where: { name: skill.name },
      });

      if (!existing) {
        await prisma.skills.create({
          data: {
            ...skill,
            id: randomUUID(),
          },
        });
        console.log(`✅ Created skill: ${skill.name}`);
      }
    }

    console.log("🎉 Production seeding completed!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Visit /admin to access the dashboard");
    console.log("2. Add your projects and customize content");
    console.log("3. Upload project images");
    console.log("4. Customize skills and sections");
  } catch (error) {
    console.error("❌ Production seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProduction();
