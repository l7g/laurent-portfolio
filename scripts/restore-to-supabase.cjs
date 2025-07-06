const { PrismaClient } = require("@prisma/client");
const { readFileSync } = require("fs");
const path = require("path");

// This will use your NEW Supabase connection
const prisma = new PrismaClient();

async function restoreToSupabase() {
  try {
    console.log("🚀 Starting restore to Supabase...");

    // Find the latest backup file
    const backupDir = path.join(process.cwd(), "backups");
    const fs = require("fs");
    const backupFiles = fs
      .readdirSync(backupDir)
      .filter((file) => file.startsWith("supabase-migration-backup-"))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      console.log(
        "❌ No backup files found. Run backup-before-supabase.js first.",
      );
      return;
    }

    const backupFile = backupFiles[0];
    const backupPath = path.join(backupDir, backupFile);
    console.log(`📂 Using backup: ${backupFile}`);

    const backupData = JSON.parse(readFileSync(backupPath, "utf-8"));

    // Restore in correct order (respecting foreign key constraints)
    const restoreOrder = [
      "users",
      "blog_categories",
      "courses",
      "course_assessments",
      "academic_programs",
      "skills",
      "projects",
      "blog_posts",
      "blog_comments",
      "skill_progressions",
      "contacts",
      "demo_requests",
      "site_settings",
      "portfolio_sections",
      "portfolio_pages",
    ];

    for (const table of restoreOrder) {
      if (backupData[table] && backupData[table].length > 0) {
        console.log(
          `📝 Restoring ${backupData[table].length} records to ${table}...`,
        );

        try {
          for (const record of backupData[table]) {
            await prisma[table].upsert({
              where: { id: record.id },
              update: record,
              create: record,
            });
          }
          console.log(`✅ Restored ${table}`);
        } catch (error) {
          console.log(`⚠️  Error restoring ${table}: ${error.message}`);
        }
      }
    }

    console.log("🎉 Restore to Supabase completed successfully!");

    // Test the connection
    const testQuery = await prisma.skills.count();
    console.log(`🔍 Connection test: Found ${testQuery} skills in Supabase`);
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreToSupabase();
