import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function backupPortfolioContent() {
  console.log("🔄 Creating backup of current portfolio content...");

  try {
    // Get all current data
    const [contacts, demoRequests, projects, skills, sections, siteSettings] =
      await Promise.all([
        prisma.contact.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.demoRequest.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.project.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.portfolioSection.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.siteSetting.findMany({ orderBy: { key: "asc" } }),
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
        siteSettings,
      },
      counts: {
        contacts: contacts.length,
        demoRequests: demoRequests.length,
        projects: projects.length,
        skills: skills.length,
        sections: sections.length,
        siteSettings: siteSettings.length,
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
    console.log(`  - ${backup.counts.siteSettings} site settings`);

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
