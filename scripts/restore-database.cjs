const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

async function restoreData(backupFile) {
  try {
    console.log(`Restoring data from: ${backupFile}`);

    if (!fs.existsSync(backupFile)) {
      console.error(`❌ Backup file not found: ${backupFile}`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(backupFile, "utf8"));
    console.log(`📅 Backup created: ${data.timestamp}`);

    // Restore data in the correct order (considering foreign key constraints)
    const restoreOrder = [
      "users",
      "academic_programs",
      "blog_categories",
      "blog_series",
      "blog_posts",
      "blog_comments",
      "contacts",
      "projects",
      "skills",
      "portfolio_sections",
      "courses",
      "course_assessments",
      "demo_requests",
      "skill_progressions",
      "site_settings",
      "portfolio_pages",
    ];

    let totalRestored = 0;

    for (const tableName of restoreOrder) {
      const records = data[tableName];
      if (records && records.length > 0) {
        console.log(`🔄 Restoring ${tableName}: ${records.length} records`);

        // Use upsert to handle existing records
        for (const record of records) {
          try {
            await prisma[tableName].upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
          } catch (error) {
            console.warn(
              `⚠️  Warning: Could not restore record ${record.id} in ${tableName}:`,
              error.message,
            );
          }
        }

        totalRestored += records.length;
        console.log(`✅ Restored ${tableName}: ${records.length} records`);
      }
    }

    console.log(
      `\n🎉 Restore completed! Total records restored: ${totalRestored}`,
    );
  } catch (error) {
    console.error("❌ Restore failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2];
if (!backupFile) {
  console.error("Usage: node restore-database.cjs <backup-file.json>");
  process.exit(1);
}

restoreData(backupFile);
