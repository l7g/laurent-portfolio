const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// This script can backup current data and restore from backup
// Usage:
// - BACKUP_MODE=true to backup current data
// - RESTORE_MODE=true to restore from backup (resets everything)
// - Neither flag: normal seeding (create if not exists)

async function backupRestoreSeed() {
  try {
    console.log("🌱 Starting Backup/Restore Seed Process...");

    const isBackupMode = process.env.BACKUP_MODE === "true";
    const isRestoreMode = process.env.RESTORE_MODE === "true";
    const forceReset = process.env.FORCE_RESET === "true";

    if (isBackupMode) {
      await backupCurrentData();
      return;
    }

    if (isRestoreMode || forceReset) {
      await restoreFromBackup();
      return;
    }

    // Normal seeding mode (create if not exists)
    await normalSeed();
  } catch (error) {
    console.error("❌ Backup/Restore process failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function backupCurrentData() {
  console.log("📦 Creating backup of current database...");

  try {
    // Backup all data
    const users = await prisma.user.findMany();
    const sections = await prisma.portfolioSection.findMany();
    const projects = await prisma.project.findMany();
    const skills = await prisma.skill.findMany();

    const backup = {
      timestamp: new Date().toISOString(),
      users: users.map((u) => ({
        ...u,
        password: "[ENCRYPTED]", // Don't backup actual passwords
      })),
      sections,
      projects,
      skills,
    };

    // In a real app, you'd save this to a file or external storage
    // For now, we'll just log it (you could pipe this to a file)
    console.log("📋 Backup Data (save this to restore later):");
    console.log("=".repeat(50));
    console.log(JSON.stringify(backup, null, 2));
    console.log("=".repeat(50));

    console.log("✅ Backup completed!");
    console.log("💡 Copy the JSON above to restore later");
  } catch (error) {
    console.error("❌ Backup failed:", error);
    throw error;
  }
}

async function restoreFromBackup() {
  console.log("🔄 Restoring from backup (this will reset everything)...");

  try {
    // WARNING: This deletes all data!
    console.log("⚠️  Clearing existing data...");

    // Delete in correct order (respect foreign keys)
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.portfolioSection.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Existing data cleared");

    // Restore from environment variable backup or default data
    const backupData = process.env.BACKUP_DATA;

    if (backupData) {
      console.log("📥 Restoring from provided backup data...");
      const backup = JSON.parse(backupData);

      // Restore users (with new passwords from env vars)
      for (const user of backup.users) {
        const password = process.env.ADMIN_PASSWORD;
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 12);
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              role: user.role,
              password: hashedPassword,
              isActive: user.isActive,
            },
          });
        }
      }

      // Restore sections
      for (const section of backup.sections) {
        await prisma.portfolioSection.create({
          data: {
            name: section.name,
            displayName: section.displayName,
            sectionType: section.sectionType,
            title: section.title,
            subtitle: section.subtitle,
            description: section.description,
            content: section.content,
            settings: section.settings,
            isActive: section.isActive,
            sortOrder: section.sortOrder,
          },
        });
      }

      // Restore projects
      for (const project of backup.projects) {
        await prisma.project.create({
          data: {
            title: project.title,
            description: project.description,
            longDescription: project.longDescription,
            technologies: project.technologies,
            category: project.category,
            status: project.status,
            isWip: project.isWip,
            showWipWarning: project.showWipWarning,
            wipWarningText: project.wipWarningText,
            wipWarningEmoji: project.wipWarningEmoji,
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            imageUrl: project.imageUrl,
            placeholderImage: project.placeholderImage,
            isActive: project.isActive,
            isFeatured: project.isFeatured,
            sortOrder: project.sortOrder,
          },
        });
      }

      // Restore skills
      for (const skill of backup.skills) {
        await prisma.skill.create({
          data: {
            name: skill.name,
            category: skill.category,
            level: skill.level || skill.proficiency || 80, // Handle both old and new field names
            icon: skill.icon,
            color: skill.color,
            isActive: skill.isActive,
            sortOrder: skill.sortOrder,
          },
        });
      }

      console.log("✅ Data restored from backup!");
    } else {
      console.log("📝 No backup data provided, creating default data...");
      await createDefaultData();
    }
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  }
}

async function normalSeed() {
  console.log("🌱 Normal seeding (create if not exists)...");

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: {
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
  }

  await createDefaultData();
}

async function createDefaultData() {
  // Portfolio sections
  const sections = [
    {
      name: "hero",
      displayName: "Hero Section",
      sectionType: "HERO",
      title: "Welcome",
      subtitle: "Full-Stack Developer",
      description: "Building Modern Web Applications",
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
    const existing = await prisma.portfolioSection.findFirst({
      where: { name: section.name },
    });

    if (!existing) {
      await prisma.portfolioSection.create({ data: section });
      console.log(`✅ Created section: ${section.name}`);
    }
  }

  // Basic skills (only add if they don't conflict with existing ones)
  const basicSkills = [
    { name: "JavaScript", category: "FRONTEND", level: 90 },
    { name: "TypeScript", category: "FRONTEND", level: 85 },
    // Note: Skip React, Next.js, Git individually since you have React/Next.js and Git/GitHub
    { name: "Node.js", category: "BACKEND", level: 80 },
    { name: "PostgreSQL", category: "DATABASE", level: 75 },
    { name: "Prisma", category: "DATABASE", level: 80 },
  ];

  for (const skill of basicSkills) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name },
    });

    if (!existing) {
      await prisma.skill.create({ data: skill });
      console.log(`✅ Created skill: ${skill.name}`);
    }
  }

  console.log("🎉 Default data creation completed!");
}

backupRestoreSeed();
