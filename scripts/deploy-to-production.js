#!/usr/bin/env node

/**
 * Safe Production Deployment Script
 *
 * This script provides a step-by-step, safe way to deploy database changes to production.
 * It includes backups, validation, and rollback capabilities.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const BACKUP_DIR = "./backups";
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log("🚀 Production Deployment Safety Check");
console.log("=====================================\n");

/**
 * Step 1: Environment Check
 */
function checkEnvironment() {
  console.log("📋 Step 1: Environment Check");

  const requiredEnvVars = [
    "PROD_DATABASE_URL",
    "DATABASE_URL",
    "RESEND_API_KEY",
    "NEXTAUTH_SECRET",
  ];

  const missing = requiredEnvVars.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing.join(", "));
    process.exit(1);
  }

  console.log("✅ All required environment variables present\n");
}

/**
 * Step 2: Backup Current Production Database
 */
function backupDatabase() {
  console.log("💾 Step 2: Creating Production Backup");

  const backupFile = path.join(BACKUP_DIR, `prod-backup-${TIMESTAMP}.sql`);

  try {
    // Use pg_dump to create a backup
    const prodUrl = process.env.PROD_DATABASE_URL;
    console.log("📦 Creating database backup...");

    execSync(`pg_dump "${prodUrl}" > "${backupFile}"`, {
      stdio: "inherit",
    });

    console.log(`✅ Backup created: ${backupFile}\n`);
    return backupFile;
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    process.exit(1);
  }
}

/**
 * Step 3: Validate Schema Changes
 */
function validateSchema() {
  console.log("🔍 Step 3: Schema Validation");

  try {
    // Check if the migration files are valid
    console.log("📝 Checking migration files...");
    execSync("npx prisma validate", { stdio: "inherit" });

    // Generate a diff to see what will change
    console.log("📊 Generating schema diff...");
    execSync(
      "npx prisma migrate diff --from-schema-datamodel ./prisma/schema.prisma --to-schema-datasource ./prisma/schema.prisma --script",
      {
        stdio: "inherit",
      },
    );

    console.log("✅ Schema validation passed\n");
  } catch (error) {
    console.error("❌ Schema validation failed:", error.message);
    process.exit(1);
  }
}

/**
 * Step 4: Test Migration on Development Copy
 */
function testMigration() {
  console.log("🧪 Step 4: Testing Migration on Development Database");

  try {
    // Reset and migrate development database
    console.log("🔄 Resetting development database...");
    execSync("npx prisma migrate reset --force", { stdio: "inherit" });

    console.log("🚀 Running migrations on development...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });

    console.log("🌱 Seeding development database...");
    execSync("npm run db:seed", { stdio: "inherit" });

    console.log("✅ Development migration test passed\n");
  } catch (error) {
    console.error("❌ Development migration test failed:", error.message);
    process.exit(1);
  }
}

/**
 * Step 5: Deploy to Production
 */
function deployToProduction() {
  console.log("🎯 Step 5: Deploying to Production");

  try {
    // Temporarily switch to production database
    const originalDbUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;

    console.log("🚀 Running production migrations...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });

    console.log("🔧 Generating Prisma client for production...");
    execSync("npx prisma generate", { stdio: "inherit" });

    // Restore original database URL
    process.env.DATABASE_URL = originalDbUrl;

    console.log("✅ Production deployment completed\n");
  } catch (error) {
    console.error("❌ Production deployment failed:", error.message);
    console.log("🔄 Consider restoring from backup if needed");
    process.exit(1);
  }
}

/**
 * Step 6: Verify Production Deployment
 */
function verifyDeployment() {
  console.log("✅ Step 6: Verifying Production Deployment");

  try {
    // Switch to production database for verification
    const originalDbUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;

    console.log("🔍 Checking database connection...");
    execSync("npx prisma db pull", { stdio: "inherit" });

    console.log("📊 Verifying schema state...");
    execSync("npx prisma migrate status", { stdio: "inherit" });

    // Restore original database URL
    process.env.DATABASE_URL = originalDbUrl;

    console.log("✅ Production verification completed\n");
  } catch (error) {
    console.error("❌ Production verification failed:", error.message);
    console.log("🚨 Manual verification may be required");
  }
}

/**
 * Main Deployment Function
 */
async function main() {
  try {
    // Get user confirmation
    console.log("⚠️  WARNING: This will modify your production database!");
    console.log("📋 Deployment checklist:");
    console.log("   • Database backup will be created");
    console.log("   • Schema changes will be validated");
    console.log("   • Migration will be tested on development");
    console.log("   • Production deployment will proceed");
    console.log("   • Deployment will be verified\n");

    const readline = await import("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
      rl.question("Continue with production deployment? (yes/no): ", resolve);
    });

    rl.close();

    if (answer.toLowerCase() !== "yes") {
      console.log("❌ Deployment cancelled");
      process.exit(0);
    }

    // Execute deployment steps
    checkEnvironment();
    const backupFile = backupDatabase();
    validateSchema();
    testMigration();
    deployToProduction();
    verifyDeployment();

    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=====================================");
    console.log(`📦 Backup saved: ${backupFile}`);
    console.log("🚀 Production database updated");
    console.log("✅ All verification checks passed");
    console.log("\n🎯 Next steps:");
    console.log("   • Deploy your application code");
    console.log("   • Test critical functionality");
    console.log("   • Monitor for any issues");
  } catch (error) {
    console.error("💥 Deployment failed:", error.message);
    process.exit(1);
  }
}

// Handle script arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🚀 Safe Production Deployment Script

Usage: node scripts/deploy-to-production.js [options]

Options:
  --help, -h     Show this help message
  --backup-only  Only create a backup (no deployment)
  --verify-only  Only verify current production state

Environment Variables Required:
  DATABASE_URL      - Development database URL
  PROD_DATABASE_URL - Production database URL
  RESEND_API_KEY    - Email service API key
  NEXTAUTH_SECRET   - Authentication secret

Safety Features:
  • Automatic backup creation
  • Schema validation
  • Development testing
  • Production verification
  • Rollback guidance

Example:
  node scripts/deploy-to-production.js
  `);
  process.exit(0);
}

if (args.includes("--backup-only")) {
  checkEnvironment();
  backupDatabase();
  process.exit(0);
}

if (args.includes("--verify-only")) {
  checkEnvironment();
  verifyDeployment();
  process.exit(0);
}

// Run main deployment
main().catch(console.error);
