const { PrismaClient } = require("@prisma/client");
const { readFileSync } = require("fs");

// Set the DATABASE_URL for Supabase
process.env.DATABASE_URL =
  "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient();

async function restoreOldestBackup() {
  try {
    console.log("🔄 Starting restore from oldest backup...");

    // Use the older backup from July 5th
    const backupPath = "backups/db-backup-2025-07-05T23-19-10-616Z.json";
    const backupData = JSON.parse(readFileSync(backupPath, "utf-8"));

    console.log(
      "📂 Backup data loaded, found collections:",
      Object.keys(backupData),
    );

    // Count total records
    const totalRecords = Object.values(backupData).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0,
    );
    console.log(`📊 Total records to restore: ${totalRecords}`);

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
          console.log(
            `✅ Successfully restored ${table} (${backupData[table].length} records)`,
          );
        } catch (error) {
          console.log(`⚠️  Error restoring ${table}: ${error.message}`);
        }
      } else {
        console.log(`⏭️  Skipping ${table} (no data)`);
      }
    }

    console.log("\n🎉 Restore completed successfully!");

    // Verify the restore
    console.log("\n🔍 Verifying restored data:");
    const counts = await Promise.all([
      prisma.projects.count(),
      prisma.skills.count(),
      prisma.blog_posts.count(),
      prisma.academic_programs.count(),
    ]);

    console.log(`📊 Verification results:`);
    console.log(`   - Projects: ${counts[0]}`);
    console.log(`   - Skills: ${counts[1]}`);
    console.log(`   - Blog Posts: ${counts[2]}`);
    console.log(`   - Academic Programs: ${counts[3]}`);
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreOldestBackup();
