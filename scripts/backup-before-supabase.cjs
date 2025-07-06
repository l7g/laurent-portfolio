const { PrismaClient } = require("@prisma/client");
const { writeFileSync } = require("fs");
const path = require("path");

// Use current database connection
const prisma = new PrismaClient();

async function backupForSupabase() {
  try {
    console.log("📦 Starting backup before Supabase migration...");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(process.cwd(), "backups");

    // Create backups directory if it doesn't exist
    const fs = require("fs");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(
      backupDir,
      `supabase-migration-backup-${timestamp}.json`,
    );

    // Export all data from your current database
    const backupData = {};

    // Export all tables
    const tables = [
      "users",
      "blog_categories",
      "blog_posts",
      "blog_comments",
      "courses",
      "course_assessments",
      "academic_programs",
      "skills",
      "skill_progressions",
      "projects",
      "contacts",
      "demo_requests",
      "site_settings",
      "portfolio_sections",
      "portfolio_pages",
    ];

    for (const table of tables) {
      try {
        console.log(`📋 Exporting ${table}...`);
        const data = await prisma[table].findMany();
        backupData[table] = data;
        console.log(`✅ Exported ${data.length} records from ${table}`);
      } catch (error) {
        console.log(
          `⚠️  Skipping ${table} (table might not exist): ${error.message}`,
        );
        backupData[table] = [];
      }
    }

    // Write backup file
    writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`💾 Backup saved to: ${backupPath}`);

    // Summary
    const totalRecords = Object.values(backupData).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    console.log(`📊 Backup complete! Total records: ${totalRecords}`);

    console.log("\n🎯 Next steps:");
    console.log("1. Update your .env.local with Supabase connection details");
    console.log("2. Run: npx prisma db push");
    console.log("3. Run: node scripts/restore-to-supabase.js");
  } catch (error) {
    console.error("❌ Backup failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backupForSupabase();
