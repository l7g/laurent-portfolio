const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function deploymentSeed() {
  try {
    console.log("🚀 Starting deployment seed process...");

    // Check if any data exists in the database
    const existingUsers = await prisma.user.count();
    const existingProjects = await prisma.project.count();
    const existingSections = await prisma.portfolioSection.count();

    if (existingUsers > 0 || existingProjects > 0 || existingSections > 0) {
      console.log("✅ Database already contains data, skipping full restore");

      // Only ensure admin user exists
      await ensureAdminUser();
      return;
    }

    console.log("📦 Database is empty, restoring from production backup...");

    // Load production backup
    const backupPath = path.join(__dirname, "production-backup.json");
    if (!fs.existsSync(backupPath)) {
      console.log("⚠️  No production backup found, creating minimal seed data");
      await createMinimalSeedData();
      return;
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, "utf8"));

    // Restore data from backup
    await restoreFromBackup(backupData);

    console.log("✅ Deployment seed completed successfully");
  } catch (error) {
    console.error("❌ Error in deployment seed:", error);

    // Fallback: create minimal data if restore fails
    console.log("🔄 Attempting fallback minimal seed...");
    await createMinimalSeedData();
  } finally {
    await prisma.$disconnect();
  }
}

async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (!adminEmail || !adminPassword) {
    console.log("⚠️  ADMIN_EMAIL and ADMIN_PASSWORD required");
    return;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists");
    return;
  }

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
}

async function restoreFromBackup(backupData) {
  const { data } = backupData;

  // Restore users with hashed passwords
  if (data.users && data.users.length > 0) {
    for (const user of data.users) {
      let hashedPassword;

      if (user.password) {
        // Use the existing hashed password from backup
        hashedPassword = user.password;
      } else {
        // Use ADMIN_PASSWORD from environment variables as fallback
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
          console.log(
            `⚠️  No ADMIN_PASSWORD set for user ${user.email}, skipping user creation`,
          );
          continue;
        }
        hashedPassword = await bcrypt.hash(adminPassword, 12);
      }

      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          role: user.role,
          password: hashedPassword,
        },
      });
    }
    console.log(`✅ Restored ${data.users.length} users`);
  }

  // Restore portfolio sections
  if (data.portfolioSections && data.portfolioSections.length > 0) {
    for (const section of data.portfolioSections) {
      await prisma.portfolioSection.create({
        data: {
          name: section.name,
          displayName: section.displayName,
          sectionType: section.sectionType,
          content: section.content,
          isVisible: section.isVisible,
          sortOrder: section.sortOrder,
        },
      });
    }
    console.log(
      `✅ Restored ${data.portfolioSections.length} portfolio sections`,
    );
  }

  // Restore projects
  if (data.projects && data.projects.length > 0) {
    for (const project of data.projects) {
      await prisma.project.create({
        data: {
          title: project.title,
          description: project.description,
          longDescription: project.longDescription,
          imageUrl: project.imageUrl,
          demoUrl: project.demoUrl,
          githubUrl: project.githubUrl,
          technologies: project.technologies,
          featured: project.featured,
          status: project.status,
          sortOrder: project.sortOrder,
        },
      });
    }
    console.log(`✅ Restored ${data.projects.length} projects`);
  }

  // Restore skills
  if (data.skills && data.skills.length > 0) {
    for (const skill of data.skills) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          sortOrder: skill.sortOrder,
        },
      });
    }
    console.log(`✅ Restored ${data.skills.length} skills`);
  }

  // Restore site settings
  if (data.siteSettings && data.siteSettings.length > 0) {
    for (const setting of data.siteSettings) {
      await prisma.siteSetting.create({
        data: {
          key: setting.key,
          value: setting.value,
          category: setting.category,
          description: setting.description,
        },
      });
    }
    console.log(`✅ Restored ${data.siteSettings.length} site settings`);
  }
}

async function createMinimalSeedData() {
  console.log("🔧 Creating minimal seed data...");

  // Create admin user
  await ensureAdminUser();

  // Create basic site settings
  const basicSettings = [
    {
      key: "hero_title",
      value: "Laurent Gagné",
      category: "hero",
      description: "Main hero title",
    },
    {
      key: "hero_subtitle",
      value: "Full-Stack Developer",
      category: "hero",
      description: "Hero subtitle",
    },
    {
      key: "about_title",
      value: "About Me",
      category: "about",
      description: "About section title",
    },
    {
      key: "about_content",
      value: "I'm a passionate full-stack developer...",
      category: "about",
      description: "About section content",
    },
  ];

  for (const setting of basicSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Minimal seed data created");
}

// Run if called directly
if (require.main === module) {
  deploymentSeed();
}

module.exports = { deploymentSeed };
