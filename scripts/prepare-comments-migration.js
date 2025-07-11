#!/usr/bin/env node

/**
 * Generate New Migration for Blog Comments
 *
 * This script creates a proper migration for the blog comments feature
 * that can be safely applied to production.
 */

import { execSync } from "child_process";
import fs from "fs";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

console.log("📝 Generating Blog Comments Migration");
console.log("====================================\n");

/**
 * Check environment variables
 */
function checkEnvironment() {
  console.log("🔍 Checking environment variables...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable not found");
    console.log(
      "💡 Make sure you have a .env.local file with DATABASE_URL set",
    );
    process.exit(1);
  }

  console.log("✅ Environment variables loaded\n");
}

/**
 * Check if blog_comments table already exists in current schema
 */
function checkCurrentSchema() {
  console.log("🔍 Checking current database schema...");

  try {
    // Check if we can connect to the database
    execSync("npx prisma db pull --force", { stdio: "inherit" });

    // Read the pulled schema to see current state
    const schemaContent = fs.readFileSync("./prisma/schema.prisma", "utf8");

    if (schemaContent.includes("model blog_comments")) {
      console.log("✅ blog_comments model already exists in schema");
      return true;
    } else {
      console.log("📋 blog_comments model needs to be created");
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to check current schema:", error.message);
    process.exit(1);
  }
}

/**
 * Generate migration for blog comments
 */
function generateMigration() {
  console.log("🚀 Generating migration for blog comments...");

  try {
    // Create a migration with a descriptive name
    const migrationName = "add_blog_comments_system";

    execSync(`npx prisma migrate dev --name ${migrationName}`, {
      stdio: "inherit",
    });

    console.log(`✅ Migration generated: ${migrationName}\n`);

    // List the new migration files
    console.log("📁 Migration files created:");
    execSync("ls -la prisma/migrations/", { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Migration generation failed:", error.message);
    process.exit(1);
  }
}

/**
 * Validate the generated migration
 */
function validateMigration() {
  console.log("🔍 Validating generated migration...");

  try {
    // Validate the Prisma schema
    execSync("npx prisma validate", { stdio: "inherit" });

    // Check migration status
    execSync("npx prisma migrate status", { stdio: "inherit" });

    console.log("✅ Migration validation passed\n");
  } catch (error) {
    console.error("❌ Migration validation failed:", error.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  checkEnvironment();
  const commentsExist = checkCurrentSchema();

  if (!commentsExist) {
    generateMigration();
    validateMigration();

    console.log("🎉 Blog Comments Migration Ready!");
    console.log("================================");
    console.log("✅ Migration files generated");
    console.log("✅ Schema validation passed");
    console.log("📋 Ready for production deployment");
    console.log("\n🎯 Next steps:");
    console.log("   1. Review the generated migration files");
    console.log("   2. Test locally: npm run db:reset && npm run db:seed");
    console.log(
      "   3. Deploy to production: node scripts/deploy-to-production.js",
    );
  } else {
    console.log(
      "ℹ️  Blog comments schema already exists - no migration needed",
    );
    console.log("\n🎯 You can proceed directly to production deployment:");
    console.log("   node scripts/deploy-to-production.js");
  }
}

main();
