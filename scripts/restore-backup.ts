import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

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
    await prisma.contacts.deleteMany();
    await prisma.demo_requests.deleteMany();
    await prisma.projects.deleteMany();
    await prisma.skills.deleteMany();
    await prisma.portfolio_sections.deleteMany();
    await prisma.site_settings.deleteMany();

    // Restore data
    console.log("📥 Restoring data...");

    if (backupData.data.contacts.length > 0) {
      await prisma.contacts.createMany({
        data: backupData.data.contacts.map((item: any) => ({
          ...item,
          id: randomUUID(),
        })),
      });
    }

    if (backupData.data.demoRequests.length > 0) {
      await prisma.demo_requests.createMany({
        data: backupData.data.demoRequests.map((item: any) => ({
          ...item,
          id: randomUUID(),
        })),
      });
    }

    if (backupData.data.projects.length > 0) {
      await prisma.projects.createMany({
        data: backupData.data.projects.map((item: any) => ({
          ...item,
          id: randomUUID(),
        })),
      });
    }

    if (backupData.data.skills.length > 0) {
      await prisma.skills.createMany({
        data: backupData.data.skills.map((item: any) => ({
          ...item,
          id: randomUUID(),
        })),
      });
    }

    if (backupData.data.sections.length > 0) {
      await prisma.portfolio_sections.createMany({
        data: backupData.data.sections.map((item: any) => ({
          ...item,
          id: randomUUID(),
        })),
      });
    }

    if (backupData.data.site_settingss.length > 0) {
      await prisma.site_settings.createMany({
        data: backupData.data.site_settingss.map((item: any) => ({
          ...item,
          id: randomUUID(),
        })),
      });
    }

    console.log("✅ Portfolio content restored successfully!");
    console.log(`📊 Restored:`);
    console.log(`  - ${backupData.counts.contacts} contact messages`);
    console.log(`  - ${backupData.counts.demoRequests} demo requests`);
    console.log(`  - ${backupData.counts.projects} projects`);
    console.log(`  - ${backupData.counts.skills} skills`);
    console.log(`  - ${backupData.counts.sections} portfolio sections`);
    console.log(`  - ${backupData.counts.site_settingss} site settings`);
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
