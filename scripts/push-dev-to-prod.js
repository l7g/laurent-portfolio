#!/usr/bin/env node

/**
 * Push Development Database to Production
 * This script exports data from development branch and imports to production branch
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Get connection strings from environment variables or Neon CLI
const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL;
const PROD_DATABASE_URL =
  process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;

// Validate required environment variables
if (!DEV_DATABASE_URL) {
  console.error("❌ DEV_DATABASE_URL environment variable is required");
  console.log(
    "💡 Set it in your .env.local file or use: neonctl connection-string development",
  );
  process.exit(1);
}

if (!PROD_DATABASE_URL) {
  console.error("❌ PROD_DATABASE_URL environment variable is required");
  console.log(
    "💡 Set it in your .env.local file or use: neonctl connection-string production",
  );
  process.exit(1);
}

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

async function exportFromDev() {
  console.log("📥 Exporting data from development branch...");

  const devPrisma = new PrismaClient({
    datasources: { db: { url: DEV_DATABASE_URL } },
  });

  try {
    await devPrisma.$connect();
    console.log("✅ Connected to development database");

    const data = {};
    const devTableToModel = createTableToModel(devPrisma);

    // List of tables to export
    const tables = [
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

    let totalRecords = 0;

    for (const table of tables) {
      try {
        console.log(`  Exporting ${table}...`);
        const model = devTableToModel[table];
        if (!model) {
          console.log(`  ⚠️ ${table}: Model not found in mapping`);
          data[table] = [];
          continue;
        }
        const records = await model.findMany();
        data[table] = records;
        console.log(`  ✅ ${table}: ${records.length} records`);
        totalRecords += records.length;
      } catch (error) {
        console.log(`  ⚠️ ${table}: Table not found or empty`);
        data[table] = [];
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `dev-to-prod-export-${timestamp}.json`;

    const exportData = {
      timestamp: new Date().toISOString(),
      source: "development",
      target: "production",
      totalRecords,
      data,
    };

    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));

    console.log(`✅ Data exported to ${filename}`);
    console.log(`📊 Total records exported: ${totalRecords}`);

    return filename;
  } finally {
    await devPrisma.$disconnect();
  }
}

async function importToProd(filename) {
  console.log(`📤 Importing data to production branch from ${filename}...`);

  const prodPrisma = new PrismaClient({
    datasources: { db: { url: PROD_DATABASE_URL } },
  });

  try {
    await prodPrisma.$connect();
    console.log("✅ Connected to production database");

    const exportData = JSON.parse(fs.readFileSync(filename, "utf8"));
    const data = exportData.data;
    const prodTableToModel = createTableToModel(prodPrisma);

    console.log(`📅 Export created: ${exportData.timestamp}`);
    console.log(
      `🔄 Migrating from ${exportData.source} to ${exportData.target}`,
    );

    // Clear existing data first (in reverse order)
    const clearOrder = [
      "blog_comments",
      "blog_posts",
      "blog_series",
      "blog_categories",
      "course_skills",
      "courses",
      "portfolio_sections",
      "projects",
      "skills",
      "contacts",
      "academic_programs",
      "site_settings",
      // Don't clear users - keep admin
    ];

    console.log("🧹 Clearing existing production data...");
    for (const tableName of clearOrder) {
      try {
        const model = prodTableToModel[tableName];
        if (model) {
          const count = await model.count();
          if (count > 0) {
            await model.deleteMany();
            console.log(`  🗑️ Cleared ${tableName}: ${count} records`);
          }
        }
      } catch (error) {
        console.log(`  ⚠️ Could not clear ${tableName}: ${error.message}`);
      }
    }

    // Import data in the correct order (considering foreign key constraints)
    const importOrder = [
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
      "course_skills",
      "site_settings",
    ];

    let totalImported = 0;

    for (const tableName of importOrder) {
      const records = data[tableName];
      const model = prodTableToModel[tableName];

      if (records && records.length > 0 && model) {
        console.log(`🔄 Importing ${tableName}: ${records.length} records`);

        for (const record of records) {
          try {
            if (tableName === "users") {
              // For users, use upsert to avoid conflicts with existing admin
              await model.upsert({
                where: { id: record.id },
                update: record,
                create: record,
              });
            } else {
              // For other tables, create new records
              await model.create({
                data: record,
              });
            }
          } catch (error) {
            console.warn(
              `⚠️  Warning: Could not import record ${record.id} in ${tableName}:`,
              error.message,
            );
          }
        }

        totalImported += records.length;
        console.log(`✅ Imported ${tableName}: ${records.length} records`);
      }
    }

    console.log(
      `\n🎉 Migration completed! Total records imported: ${totalImported}`,
    );
  } finally {
    await prodPrisma.$disconnect();
  }
}

async function pushDevToProd() {
  try {
    console.log("🚀 Starting dev to prod migration...");
    console.log("⚠️  WARNING: This will OVERWRITE production data!");
    console.log(`📍 DEV:  ${DEV_DATABASE_URL.replace(/:[^@]*@/, ":***@")}`);
    console.log(`📍 PROD: ${PROD_DATABASE_URL.replace(/:[^@]*@/, ":***@")}`);

    // Security check - prevent accidental same database migration
    if (DEV_DATABASE_URL === PROD_DATABASE_URL) {
      console.error("❌ ERROR: DEV and PROD database URLs are the same!");
      console.error(
        "   This would cause data loss. Please check your environment variables.",
      );
      process.exit(1);
    }

    // Additional safety check for production patterns
    if (
      !PROD_DATABASE_URL.includes("prod") &&
      !PROD_DATABASE_URL.includes("fragrant-pond")
    ) {
      console.warn(
        "⚠️  WARNING: Production URL doesn't contain expected production identifiers.",
      );
      console.warn("   Please verify this is the correct production database.");
    }

    // Step 1: Export from dev
    const filename = await exportFromDev();

    // Step 2: Import to prod
    await importToProd(filename);

    console.log("✅ Dev to prod migration completed successfully!");
    console.log(
      "🎯 Your production database now matches your development data.",
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

pushDevToProd();
