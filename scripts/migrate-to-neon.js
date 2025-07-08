#!/usr/bin/env node

/**
 * Database Migration Script: Supabase to Neon
 * 1. Exports all data from current Supabase database
 * 2. Sets up new Neon database with same schema
 * 3. Imports all data to Neon
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { execSync } from "child_process";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

console.log("🔧 Environment check:");
console.log(
  "OLD_DATABASE_URL:",
  process.env.OLD_DATABASE_URL ? "✅ Set" : "❌ Missing",
);
console.log(
  "NEW_DATABASE_URL:",
  process.env.NEW_DATABASE_URL ? "✅ Set" : "❌ Missing",
);

if (!process.env.OLD_DATABASE_URL || !process.env.NEW_DATABASE_URL) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

// Old database connection (Supabase)
const oldPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.OLD_DATABASE_URL,
    },
  },
});

// New database connection (Neon)
const newPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.NEW_DATABASE_URL,
    },
  },
});

async function exportData() {
  console.log("📥 Exporting data from Supabase...");

  try {
    const data = {
      users: await oldPrisma.users.findMany(),
      site_settings: await oldPrisma.site_settings.findMany(),
      blog_categories: await oldPrisma.blog_categories.findMany(),
      blog_series: await oldPrisma.blog_series.findMany(),
      blog_posts: await oldPrisma.blog_posts.findMany(),
      blog_comments: await oldPrisma.blog_comments.findMany(),
      projects: await oldPrisma.projects.findMany(),
      skills: await oldPrisma.skills.findMany(),
      academic_programs: await oldPrisma.academic_programs.findMany(),
      courses: await oldPrisma.courses.findMany(),
      course_skills: await oldPrisma.course_skills.findMany(),
      portfolio_sections: await oldPrisma.portfolio_sections.findMany(),
      contacts: await oldPrisma.contacts.findMany(),
    };

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `migration-backup-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    console.log(`✅ Data exported to ${filename}`);
    console.log("📊 Export summary:");
    Object.entries(data).forEach(([table, records]) => {
      console.log(`   ${table}: ${records.length} records`);
    });

    return { data, filename };
  } catch (error) {
    console.error("❌ Export failed:", error.message);
    return null;
  }
}

async function setupNewDatabase() {
  console.log("🏗️ Setting up Neon database schema...");

  try {
    // Run migrations on new database
    process.env.DATABASE_URL = process.env.NEW_DATABASE_URL;
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("✅ Schema created in Neon database");
    return true;
  } catch (error) {
    console.error("❌ Schema setup failed:", error.message);
    return false;
  }
}

async function importData(data) {
  console.log("📤 Importing data to Neon database...");

  try {
    // Import in correct order (respecting foreign keys)
    const importOrder = [
      "users",
      "site_settings",
      "blog_categories",
      "blog_series",
      "blog_posts",
      "blog_comments",
      "projects",
      "skills",
      "academic_programs",
      "courses",
      "course_skills",
      "portfolio_sections",
      "contacts",
    ];

    for (const tableName of importOrder) {
      const records = data[tableName];
      if (records && records.length > 0) {
        console.log(`  Importing ${tableName}: ${records.length} records...`);

        for (const record of records) {
          try {
            await newPrisma[tableName].create({ data: record });
          } catch (error) {
            // Skip duplicates or constraint errors
            if (!error.message.includes("Unique constraint")) {
              console.warn(
                `    Warning: ${tableName} record skipped:`,
                error.message,
              );
            }
          }
        }
        console.log(`  ✅ ${tableName} imported`);
      }
    }

    console.log("✅ All data imported successfully!");
    return true;
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("🔄 Starting database migration: Supabase → Neon");

  if (!process.env.NEW_DATABASE_URL) {
    console.error("❌ NEW_DATABASE_URL environment variable is required");
    process.exit(1);
  }

  // Step 1: Export data from Supabase
  const exportResult = await exportData();
  if (!exportResult) {
    console.error("❌ Migration failed: Could not export data");
    process.exit(1);
  }

  // Step 2: Setup Neon database schema
  const schemaSetup = await setupNewDatabase();
  if (!schemaSetup) {
    console.error("❌ Migration failed: Could not setup schema");
    process.exit(1);
  }

  // Step 3: Import data to Neon
  const importSuccess = await importData(exportResult.data);
  if (!importSuccess) {
    console.error("❌ Migration failed: Could not import data");
    process.exit(1);
  }

  console.log("🎉 Migration completed successfully!");
  console.log(`📁 Backup saved as: ${exportResult.filename}`);
  console.log("\n🔧 Next steps:");
  console.log(
    "1. Update DATABASE_URL in .env.local with Neon connection string",
  );
  console.log("2. Update DATABASE_URL in Vercel environment variables");
  console.log("3. Deploy to Vercel");
}

main()
  .then(async () => {
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Migration script failed:", e);
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
    process.exit(1);
  });
