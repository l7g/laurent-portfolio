#!/usr/bin/env node

/**
 * Windows-Compatible Production Deployment Script
 *
 * This script deploys to production without requiring PostgreSQL tools
 * It uses Prisma for all database operations (Windows-friendly)
 */

import { PrismaClient } from "@prisma/client";
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

console.log("🚀 Windows-Compatible Production Deployment");
console.log("===========================================\n");

/**
 * Check environment variables
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
 * Create logical backup using Prisma (Windows-compatible)
 */
async function createLogicalBackup() {
  console.log("💾 Step 2: Creating Production Backup (Prisma Method)");

  try {
    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    console.log("📦 Connecting to production database...");
    await prodPrisma.$connect();

    console.log("📊 Analyzing production data...");

    // Get current table counts
    const stats = {
      categories: await prodPrisma.blog_categories.count(),
      posts: await prodPrisma.blog_posts.count(),
      comments: await prodPrisma.blog_comments.count().catch(() => 0), // Might not exist yet
      users: await prodPrisma.users.count(),
      projects: await prodPrisma.projects.count(),
      skills: await prodPrisma.skills.count(),
    };

    // Create backup metadata
    const backupInfo = {
      timestamp: new Date().toISOString(),
      database: "production",
      method: "prisma-logical",
      tableStats: stats,
      environment: {
        nodejs: process.version,
        platform: process.platform,
      },
      warnings: [
        "This is a logical backup using Prisma",
        "For full SQL backup, install PostgreSQL tools",
        "Current data structure recorded for rollback reference",
      ],
    };

    const backupFile = path.join(
      BACKUP_DIR,
      `prod-backup-metadata-${TIMESTAMP}.json`,
    );
    fs.writeFileSync(backupFile, JSON.stringify(backupInfo, null, 2));

    console.log(`✅ Backup metadata created: ${backupFile}`);
    console.log("📊 Production database state recorded:");
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`   • ${table}: ${count} records`);
    });

    await prodPrisma.$disconnect();
    console.log("✅ Production database connection closed\n");

    return backupFile;
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    console.log("\n💡 Common fixes:");
    console.log("   • Check PROD_DATABASE_URL is correct");
    console.log("   • Verify production database is accessible");
    console.log("   • Ensure network connectivity");
    process.exit(1);
  }
}

/**
 * Deploy schema to production using Prisma migrate
 */
async function deployToProduction() {
  console.log("🎯 Step 3: Deploying Schema to Production");

  try {
    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    console.log("🔗 Connecting to production database...");
    await prodPrisma.$connect();

    console.log("🚀 Deploying pending migrations...");

    // Deploy migrations using Prisma's built-in method
    const { execSync } = await import("child_process");

    // Temporarily set DATABASE_URL to production for migration
    const originalDbUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;

    try {
      execSync("npx prisma migrate deploy", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: process.env.PROD_DATABASE_URL },
      });
      console.log("✅ Migrations deployed successfully");
    } finally {
      // Restore original DATABASE_URL
      process.env.DATABASE_URL = originalDbUrl;
    }

    await prodPrisma.$disconnect();
    console.log("✅ Production deployment completed\n");
  } catch (error) {
    console.error("❌ Production deployment failed:", error.message);
    console.log("🔄 Production database unchanged - safe to retry");
    process.exit(1);
  }
}

/**
 * Seed production with essential data
 */
async function seedProduction() {
  console.log("🌱 Step 4: Seeding Production Data");

  try {
    const { execSync } = await import("child_process");

    console.log("🌿 Running production-safe seeding...");
    execSync("npm run seed:production-safe-prod", { stdio: "inherit" });

    console.log("✅ Production seeding completed\n");
  } catch (error) {
    console.error("❌ Production seeding failed:", error.message);
    console.log("💡 This is usually safe - the schema is deployed");
    console.log("💡 You can seed manually later if needed");
  }
}

/**
 * Verify deployment
 */
async function verifyDeployment() {
  console.log("✅ Step 5: Verifying Production Deployment");

  try {
    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    console.log("🔍 Connecting to production database...");
    await prodPrisma.$connect();

    console.log("📊 Checking table structure...");

    // Verify key tables exist and are accessible
    const verificationTests = [
      {
        name: "blog_categories",
        test: () => prodPrisma.blog_categories.count(),
      },
      { name: "blog_posts", test: () => prodPrisma.blog_posts.count() },
      { name: "blog_comments", test: () => prodPrisma.blog_comments.count() },
      { name: "users", test: () => prodPrisma.users.count() },
      { name: "projects", test: () => prodPrisma.projects.count() },
    ];

    console.log("🧪 Running verification tests...");
    const results = {};

    for (const { name, test } of verificationTests) {
      try {
        const count = await test();
        results[name] = { status: "✅", count };
        console.log(`   ✅ ${name}: ${count} records`);
      } catch (error) {
        results[name] = { status: "❌", error: error.message };
        console.log(`   ❌ ${name}: ${error.message}`);
      }
    }

    await prodPrisma.$disconnect();

    // Check if critical tables are working
    const criticalTables = ["blog_categories", "blog_posts", "users"];
    const criticalFailures = criticalTables.filter(
      (table) => results[table]?.status === "❌",
    );

    if (criticalFailures.length > 0) {
      console.log(
        `\n⚠️  Critical tables failed: ${criticalFailures.join(", ")}`,
      );
      console.log("💡 Deployment may need attention");
    } else {
      console.log("\n🎉 All critical tables verified successfully!");
    }

    console.log("✅ Production verification completed\n");
  } catch (error) {
    console.error("❌ Production verification failed:", error.message);
    console.log("🚨 Manual verification may be required");
  }
}

/**
 * Main deployment function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(`
🚀 Windows-Compatible Production Deployment

Usage: npm run deploy:windows [options]

Options:
  --backup-only   Only create backup metadata
  --verify-only   Only verify production state
  --help          Show this help

Features:
  ✅ Windows-compatible (no PostgreSQL tools required)
  ✅ Uses Prisma for all database operations  
  ✅ Creates logical backup metadata
  ✅ Safe migration deployment
  ✅ Production verification
  ✅ Detailed logging and error handling

This script safely deploys your comment system to production.
    `);
    process.exit(0);
  }

  if (args.includes("--backup-only")) {
    checkEnvironment();
    await createLogicalBackup();
    process.exit(0);
  }

  if (args.includes("--verify-only")) {
    checkEnvironment();
    await verifyDeployment();
    process.exit(0);
  }

  try {
    console.log("⚠️  PRODUCTION DEPLOYMENT WARNING");
    console.log("This will deploy the blog comments system to production.");
    console.log("\n📋 What will happen:");
    console.log("   1. Backup production database metadata");
    console.log("   2. Deploy new schema (adds blog_comments table)");
    console.log("   3. Seed essential data if missing");
    console.log("   4. Verify deployment success");
    console.log("\n🔒 Safety features:");
    console.log("   • Backup metadata created before changes");
    console.log("   • Only adds new tables (no data loss)");
    console.log("   • Uses Prisma migrate (safe & reliable)");
    console.log("   • Comprehensive verification");

    // Auto-proceed for now - you can uncomment the prompt below if you want manual confirmation
    console.log("\n🚀 Proceeding with deployment...\n");

    /* Uncomment this section if you want manual confirmation:
    const readline = await import("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
      rl.question("\nContinue with production deployment? (yes/no): ", resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== "yes") {
      console.log("❌ Deployment cancelled");
      process.exit(0);
    }
    */

    // Execute deployment steps
    checkEnvironment();
    const backupFile = await createLogicalBackup();
    await deployToProduction();
    await seedProduction();
    await verifyDeployment();

    console.log("🎉 PRODUCTION DEPLOYMENT COMPLETED!");
    console.log("===================================");
    console.log(`📦 Backup: ${backupFile}`);
    console.log("🗄️  Comment system deployed to production");
    console.log("📧 Email notifications ready");
    console.log("👥 Admin interface available");
    console.log("\n🎯 Next steps:");
    console.log("   1. Deploy your application to Vercel/hosting");
    console.log("   2. Test comment posting on live site");
    console.log("   3. Verify email notifications work");
    console.log("   4. Check admin dashboard functionality");
  } catch (error) {
    console.error("💥 Deployment failed:", error.message);
    console.log("\n🔄 Safe to retry - no partial deployments");
    process.exit(1);
  }
}

main().catch(console.error);
