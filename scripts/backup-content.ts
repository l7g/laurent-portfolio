import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function backupPortfolioContent() {
  console.log("🔄 Creating backup of current portfolio content...");

  try {
    // Get all current data
    const [contacts, demoRequests, projects, skills, sections, site_settingss] =
      await Promise.all([
        prisma.contacts.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.demo_requests.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.projects.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.skills.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.portfolio_sections.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.site_settings.findMany({ orderBy: { key: "asc" } }),
      ]);

    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      data: {
        contacts,
        demoRequests,
        projects,
        skills,
        sections,
        site_settingss,
      },
      counts: {
        contacts: contacts.length,
        demoRequests: demoRequests.length,
        projects: projects.length,
        skills: skills.length,
        sections: sections.length,
        site_settingss: site_settingss.length,
      },
    };

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Save backup file
    const backupFileName = `portfolio-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const backupPath = path.join(backupsDir, backupFileName);

    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    console.log("✅ Backup created successfully!");
    console.log(`📁 Backup saved to: ${backupPath}`);
    console.log(`📊 Backup contains:`);
    console.log(`  - ${backup.counts.contacts} contact messages`);
    console.log(`  - ${backup.counts.demoRequests} demo requests`);
    console.log(`  - ${backup.counts.projects} projects`);
    console.log(`  - ${backup.counts.skills} skills`);
    console.log(`  - ${backup.counts.sections} portfolio sections`);
    console.log(`  - ${backup.counts.site_settingss} site settings`);

    return backupPath;
  } catch (error) {
    console.error("❌ Error creating backup:", error);
    throw error;
  }
}

async function main() {
  await backupPortfolioContent();
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
