const { PrismaClient } = require("@prisma/client");
const { readFileSync } = require("fs");

// Set the DATABASE_URL for Supabase
process.env.DATABASE_URL =
  "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient();

function cleanRecord(record, fieldsToRemove = []) {
  const cleaned = { ...record };
  // Remove nested objects and specified fields
  const defaultFieldsToRemove = [
    "courses",
    "blog_categories",
    "course_assessments",
    ...fieldsToRemove,
  ];
  defaultFieldsToRemove.forEach((field) => delete cleaned[field]);
  return cleaned;
}

async function restoreDataSimple() {
  try {
    console.log("🔄 Starting simple restore from oldest backup...");

    const backupPath = "backups/db-backup-2025-07-05T23-19-10-616Z.json";
    const backup = JSON.parse(readFileSync(backupPath, "utf-8"));
    const backupData = backup.data;

    console.log(
      "📂 Backup data loaded, found collections:",
      Object.keys(backupData),
    );

    // Simple restore order - skip problematic nested data
    const simpleRestore = [
      { table: "academic_programs", cleanFields: ["courses"] },
      { table: "blog_posts", cleanFields: ["blog_categories"] },
      { table: "courses", cleanFields: ["course_assessments"] },
    ];

    for (const { table, cleanFields } of simpleRestore) {
      if (backupData[table] && backupData[table].length > 0) {
        console.log(
          `📝 Restoring ${backupData[table].length} records to ${table}...`,
        );

        try {
          for (const record of backupData[table]) {
            const cleanedRecord = cleanRecord(record, cleanFields);
            await prisma[table].upsert({
              where: { id: cleanedRecord.id },
              update: cleanedRecord,
              create: cleanedRecord,
            });
          }
          console.log(
            `✅ Successfully restored ${table} (${backupData[table].length} records)`,
          );
        } catch (error) {
          console.log(
            `⚠️  Error restoring ${table}: ${error.message.split("\n")[0]}`,
          );
        }
      }
    }

    console.log("\n🎉 Simple restore completed!");

    // Verify the restore
    console.log("\n🔍 Verifying all restored data:");
    const counts = await Promise.all([
      prisma.projects.count(),
      prisma.skills.count(),
      prisma.blog_posts.count(),
      prisma.academic_programs.count(),
      prisma.blog_categories.count(),
      prisma.courses.count(),
    ]);

    console.log(`📊 Final results:`);
    console.log(`   - Projects: ${counts[0]}`);
    console.log(`   - Skills: ${counts[1]}`);
    console.log(`   - Blog Posts: ${counts[2]}`);
    console.log(`   - Academic Programs: ${counts[3]}`);
    console.log(`   - Blog Categories: ${counts[4]}`);
    console.log(`   - Courses: ${counts[5]}`);
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreDataSimple();
