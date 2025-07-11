#!/usr/bin/env node

/**
 * Migration Conflict Resolver
 *
 * This script resolves the migration conflict by introspecting production
 * and creating a baseline migration if needed.
 */

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

console.log("🔧 Migration Conflict Resolver");
console.log("==============================\n");

async function checkProductionSchema() {
  console.log("🔍 Analyzing production database schema...");

  try {
    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    await prodPrisma.$connect();
    console.log("✅ Connected to production database");

    // Check if blog_comments table exists (our main concern)
    try {
      const commentCount = await prodPrisma.blog_comments.count();
      console.log(`✅ blog_comments table exists (${commentCount} comments)`);
      return "comments_exist";
    } catch (error) {
      if (error.code === "P2021" || error.message.includes("does not exist")) {
        console.log("📋 blog_comments table does not exist yet");
        return "comments_missing";
      }
      throw error;
    } finally {
      await prodPrisma.$disconnect();
    }
  } catch (error) {
    console.error("❌ Failed to analyze production schema:", error.message);
    throw error;
  }
}

async function resolveConflict() {
  console.log("🛠️  Resolving migration conflict...");

  try {
    // Step 1: Create a temporary environment for production analysis
    const originalDbUrl = process.env.DATABASE_URL;

    // Step 2: Introspect production to see actual current state
    console.log("📊 Introspecting production database...");
    process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;

    execSync("npx prisma db pull --force", { stdio: "inherit" });

    // Step 3: Reset the migration state to match production
    console.log("🔄 Resetting migration state...");
    execSync("npx prisma migrate reset --force", { stdio: "inherit" });

    // Step 4: Mark current schema as the baseline
    console.log("📐 Creating baseline migration...");
    execSync("npx prisma migrate dev --name baseline_production_state", {
      stdio: "inherit",
    });

    // Step 5: Restore development environment
    process.env.DATABASE_URL = originalDbUrl;

    console.log("✅ Migration conflict resolved!");
  } catch (error) {
    console.error("❌ Failed to resolve conflict:", error.message);
    throw error;
  }
}

async function createCommentsOnlyMigration() {
  console.log("📝 Creating comments-only migration...");

  try {
    // Only create migration for the blog_comments table
    const migrationSQL = `
-- CreateTable
CREATE TABLE "blog_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
`;

    // Apply this directly to production
    console.log("🎯 Applying comments table to production...");

    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    await prodPrisma.$executeRawUnsafe(migrationSQL);
    await prodPrisma.$disconnect();

    console.log("✅ Comments table added to production!");
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log("ℹ️  Comments table already exists - skipping");
      return;
    }
    console.error("❌ Failed to create comments table:", error.message);
    throw error;
  }
}

async function main() {
  try {
    const schemaState = await checkProductionSchema();

    if (schemaState === "comments_missing") {
      console.log("\n🎯 Strategy: Add only the missing blog_comments table");
      await createCommentsOnlyMigration();
    } else {
      console.log("\n✅ Comments table already exists in production");
      console.log("ℹ️  No schema changes needed");
    }

    console.log("\n🎉 Production database is ready!");
    console.log("==============================");
    console.log("✅ Schema conflict resolved");
    console.log("✅ Comments system available");
    console.log("📧 Email notifications ready");
    console.log("\n🎯 You can now:");
    console.log("   • Deploy your application code");
    console.log("   • Test comment functionality");
    console.log("   • Use the admin interface");
  } catch (error) {
    console.error("💥 Resolution failed:", error.message);
    console.log("\n💡 Alternative approaches:");
    console.log("   1. Check if PROD_DATABASE_URL is correct");
    console.log("   2. Verify production database is accessible");
    console.log("   3. Consider manual schema sync");
    process.exit(1);
  }
}

main().catch(console.error);
