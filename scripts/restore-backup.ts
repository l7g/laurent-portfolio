import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function restoreFromBackup(backupFile: string) {
  console.log(`🔄 Restoring portfolio content from backup: ${backupFile}`);

  try {
    // Read backup file
    const backupPath = path.resolve(backupFile);
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, "utf8"));
    console.log(`📅 Backup timestamp: ${backupData.timestamp}`);
    console.log(`📝 Backup version: ${backupData.version}`);

    // Clear existing data (be careful!)
    console.log("🗑️ Clearing existing data...");
    await prisma.contact.deleteMany();
    await prisma.demoRequest.deleteMany();
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.portfolioSection.deleteMany();
    await prisma.siteSetting.deleteMany();

    // Restore data
    console.log("📥 Restoring data...");

    if (backupData.data.contacts.length > 0) {
      await prisma.contact.createMany({ data: backupData.data.contacts });
    }

    if (backupData.data.demoRequests.length > 0) {
      await prisma.demoRequest.createMany({
        data: backupData.data.demoRequests,
      });
    }

    if (backupData.data.projects.length > 0) {
      await prisma.project.createMany({ data: backupData.data.projects });
    }

    if (backupData.data.skills.length > 0) {
      await prisma.skill.createMany({ data: backupData.data.skills });
    }

    if (backupData.data.sections.length > 0) {
      await prisma.portfolioSection.createMany({
        data: backupData.data.sections,
      });
    }

    if (backupData.data.siteSettings.length > 0) {
      await prisma.siteSetting.createMany({
        data: backupData.data.siteSettings,
      });
    }

    console.log("✅ Portfolio content restored successfully!");
    console.log(`📊 Restored:`);
    console.log(`  - ${backupData.counts.contacts} contact messages`);
    console.log(`  - ${backupData.counts.demoRequests} demo requests`);
    console.log(`  - ${backupData.counts.projects} projects`);
    console.log(`  - ${backupData.counts.skills} skills`);
    console.log(`  - ${backupData.counts.sections} portfolio sections`);
    console.log(`  - ${backupData.counts.siteSettings} site settings`);
  } catch (error) {
    console.error("❌ Error restoring backup:", error);
    throw error;
  }
}

async function main() {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error("❌ Please provide a backup file path");
    console.log("Usage: npm run restore-backup <backup-file-path>");
    process.exit(1);
  }

  await restoreFromBackup(backupFile);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
