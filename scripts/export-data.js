#!/usr/bin/env node

/**
 * Simple Supabase Data Export
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Security: Log which database we're connecting to (without credentials)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  console.log(`🔒 Connecting to: ${dbUrl.replace(/:[^@]*@/, ":***@")}`);
} else {
  console.error("❌ DATABASE_URL not found in environment");
  process.exit(1);
}

const prisma = new PrismaClient();

async function exportData() {
  console.log("📥 Exporting data from current database...");

  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    const data = {};

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
        const records = await prisma[table].findMany();
        data[table] = records;
        console.log(`  ✅ ${table}: ${records.length} records`);
        totalRecords += records.length;
      } catch (error) {
        console.log(`  ⚠️ ${table}: Table not found or empty`);
        data[table] = [];
      }
    }

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `database-export-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    console.log(`\n✅ Data exported to ${filename}`);
    console.log(`📊 Total records exported: ${totalRecords}`);
    console.log("\n📋 Export summary:");
    Object.entries(data).forEach(([table, records]) => {
      if (records.length > 0) {
        console.log(`   ${table}: ${records.length} records`);
      }
    });

    return filename;
  } catch (error) {
    console.error("❌ Export failed:", error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

exportData()
  .then((filename) => {
    if (filename) {
      console.log(`\n🎉 Export completed successfully!`);
      console.log(`📁 Backup saved as: ${filename}`);
    } else {
      console.log("\n❌ Export failed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
