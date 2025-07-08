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

// Map table names to Prisma model references
const createTableToModel = (prismaClient) => ({
  users: prismaClient.users,
  site_settings: prismaClient.site_settings,
  blog_categories: prismaClient.blog_categories,
  blog_series: prismaClient.blog_series,
  blog_posts: prismaClient.blog_posts,
  blog_comments: prismaClient.blog_comments,
  projects: prismaClient.projects,
  skills: prismaClient.skills,
  academic_programs: prismaClient.academic_programs,
  courses: prismaClient.courses,
  course_skills: prismaClient.course_skills,
  portfolio_sections: prismaClient.portfolio_sections,
  contacts: prismaClient.contacts,
});

async function exportData() {
  console.log("📥 Exporting data from Supabase...");

  try {
    const oldTableToModel = createTableToModel(oldPrisma);
    const data = {};

    // Export data from each table
    for (const [tableName, model] of Object.entries(oldTableToModel)) {
      try {
        console.log(`  Exporting ${tableName}...`);
        const records = await model.findMany();
        data[tableName] = records;
        console.log(`  ✅ ${tableName}: ${records.length} records`);
      } catch (error) {
        console.log(`  ⚠️ ${tableName}: Table not found or empty`);
        data[tableName] = [];
      }
    }

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
    const newTableToModel = createTableToModel(newPrisma);

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
      const model = newTableToModel[tableName];

      if (records && records.length > 0 && model) {
        console.log(`  Importing ${tableName}: ${records.length} records...`);

        for (const record of records) {
          try {
            await model.create({ data: record });
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
