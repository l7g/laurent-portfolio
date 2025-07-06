const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const prisma = new PrismaClient();

async function deploymentSeed() {
  try {
    console.log("🚀 Starting deployment seed process...");

    // Check if any data exists in the database
    const existingUsers = await prisma.users.count();
    const existingProjects = await prisma.projects.count();
    const existingSections = await prisma.portfolio_sections.count();

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

  const existingAdmin = await prisma.users.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists");
    return;
  }

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
}

async function restoreFromBackup(backupData) {
  const { data } = backupData;

  // Restore admin user with secure environment password
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (adminEmail && adminPassword) {
    // Check if admin user already exists
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
      console.log("✅ Created admin user with secure environment password");
    } else {
      console.log("✅ Admin user already exists");
    }
  } else {
    console.log(
      "⚠️  ADMIN_EMAIL and ADMIN_PASSWORD not set, skipping admin user creation",
    );
  }

  // Restore portfolio sections
  if (data.portfolio_sectionss && data.portfolio_sectionss.length > 0) {
    for (const section of data.portfolio_sectionss) {
      await prisma.portfolio_sections.create({
        data: {
          id: randomUUID(),
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
      `✅ Restored ${data.portfolio_sectionss.length} portfolio sections`,
    );
  }

  // Restore projects
  if (data.projects && data.projects.length > 0) {
    for (const project of data.projects) {
      await prisma.projects.create({
        data: {
          id: randomUUID(),
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
      await prisma.skills.create({
        data: {
          id: randomUUID(),
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
  if (data.site_settingss && data.site_settingss.length > 0) {
    for (const setting of data.site_settingss) {
      await prisma.site_settings.create({
        data: {
          id: randomUUID(),
          key: setting.key,
          value: setting.value,
          category: setting.category,
          description: setting.description,
        },
      });
    }
    console.log(`✅ Restored ${data.site_settingss.length} site settings`);
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
    await prisma.site_settings.upsert({
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
