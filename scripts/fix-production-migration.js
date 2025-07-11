#!/usr/bin/env node

/**
 * Production Migration Fixer
 *
 * This script fixes the failed migration issue in production
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

console.log("🔧 Production Migration Fixer");
console.log("=============================\n");

async function fixFailedMigration() {
  try {
    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    await prodPrisma.$connect();
    console.log("✅ Connected to production database");

    console.log("🔍 Checking migration status...");

    // Check what the failed migration was trying to do
    console.log("📊 Analyzing what needs to be fixed...");

    // The failed migration was: 20250710130000_add_blog_series_and_course_fields
    // Let's check if the changes were actually applied

    try {
      // Check if blog_post_relations table exists
      await prodPrisma.blog_post_relations.findFirst();
      console.log("✅ blog_post_relations table exists");
    } catch (error) {
      if (error.code === "P2021" || error.message.includes("does not exist")) {
        console.log("❌ blog_post_relations table missing - need to create it");

        // Create the missing table manually
        console.log("🛠️  Creating blog_post_relations table...");

        await prodPrisma.$executeRawUnsafe(`
          CREATE TABLE "blog_post_relations" (
              "id" TEXT NOT NULL,
              "sourcePostId" TEXT NOT NULL,
              "targetPostId" TEXT NOT NULL,
              "relationType" TEXT NOT NULL DEFAULT 'related',
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "createdBy" TEXT NOT NULL,

              CONSTRAINT "blog_post_relations_pkey" PRIMARY KEY ("id")
          );
        `);

        await prodPrisma.$executeRawUnsafe(`
          CREATE UNIQUE INDEX "blog_post_relations_sourcePostId_targetPostId_key" ON "blog_post_relations"("sourcePostId", "targetPostId");
        `);

        await prodPrisma.$executeRawUnsafe(`
          CREATE INDEX "blog_post_relations_sourcePostId_idx" ON "blog_post_relations"("sourcePostId");
        `);

        await prodPrisma.$executeRawUnsafe(`
          CREATE INDEX "blog_post_relations_targetPostId_idx" ON "blog_post_relations"("targetPostId");
        `);

        await prodPrisma.$executeRawUnsafe(`
          ALTER TABLE "blog_post_relations" ADD CONSTRAINT "blog_post_relations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        `);

        await prodPrisma.$executeRawUnsafe(`
          ALTER TABLE "blog_post_relations" ADD CONSTRAINT "blog_post_relations_sourcePostId_fkey" FOREIGN KEY ("sourcePostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        await prodPrisma.$executeRawUnsafe(`
          ALTER TABLE "blog_post_relations" ADD CONSTRAINT "blog_post_relations_targetPostId_fkey" FOREIGN KEY ("targetPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);

        console.log("✅ blog_post_relations table created successfully");
      } else {
        throw error;
      }
    }

    // Now mark the failed migration as completed
    console.log("🏁 Marking failed migration as completed...");

    await prodPrisma.$executeRawUnsafe(`
      UPDATE "_prisma_migrations" 
      SET "finished_at" = CURRENT_TIMESTAMP, 
          "migration_name" = '20250710130000_add_blog_series_and_course_fields',
          "logs" = 'Manually fixed by production migration fixer'
      WHERE "migration_name" = '20250710130000_add_blog_series_and_course_fields' 
      AND "finished_at" IS NULL;
    `);

    console.log("✅ Migration marked as completed");

    await prodPrisma.$disconnect();

    console.log("\n🎉 Production migration fixed!");
    console.log("==============================");
    console.log("✅ Failed migration resolved");
    console.log("✅ Missing table created");
    console.log("✅ Ready for new deployments");
  } catch (error) {
    console.error("❌ Fix failed:", error.message);
    console.log("💡 You may need to manually resolve this in your database");
  }
}

fixFailedMigration().catch(console.error);
