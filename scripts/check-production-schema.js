#!/usr/bin/env node

/**
 * Production Schema Checker
 *
 * This script checks what schema is actually deployed in production
 * and compares it with what should be there.
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

console.log("🔍 Production Schema Analysis");
console.log("============================\n");

async function checkProductionSchema() {
  try {
    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    await prodPrisma.$connect();
    console.log("✅ Connected to production database\n");

    // Check what tables exist by trying to query them
    const checks = [
      {
        name: "blog_categories",
        query: () => prodPrisma.blog_categories.findFirst(),
      },
      { name: "blog_posts", query: () => prodPrisma.blog_posts.findFirst() },
      {
        name: "blog_comments",
        query: () => prodPrisma.blog_comments.findFirst(),
      },
      { name: "blog_series", query: () => prodPrisma.blog_series.findFirst() },
      {
        name: "blog_post_relations",
        query: () => prodPrisma.blog_post_relations.findFirst(),
      },
      { name: "users", query: () => prodPrisma.users.findFirst() },
      { name: "projects", query: () => prodPrisma.projects.findFirst() },
      { name: "courses", query: () => prodPrisma.courses.findFirst() },
      {
        name: "academic_programs",
        query: () => prodPrisma.academic_programs.findFirst(),
      },
    ];

    console.log("📊 Table Structure Analysis:");
    console.log("============================");

    for (const { name, query } of checks) {
      try {
        await query();
        console.log(`✅ ${name} - EXISTS`);
      } catch (error) {
        if (
          error.code === "P2021" ||
          error.message.includes("does not exist")
        ) {
          console.log(`❌ ${name} - MISSING`);
        } else {
          console.log(`⚠️  ${name} - ERROR: ${error.message}`);
        }
      }
    }

    // Check specific fields that might be missing
    console.log("\n🔍 Field Analysis:");
    console.log("==================");

    try {
      const post = await prodPrisma.blog_posts.findFirst({
        select: {
          id: true,
          title: true,
          courseId: true, // This might be missing
          seriesId: true, // This might be missing
          seriesOrder: true, // This might be missing
        },
      });
      console.log(
        "✅ blog_posts has all expected fields (courseId, seriesId, seriesOrder)",
      );
    } catch (error) {
      console.log(`❌ blog_posts missing fields: ${error.message}`);
    }

    await prodPrisma.$disconnect();
  } catch (error) {
    console.error("❌ Schema check failed:", error.message);
  }
}

checkProductionSchema().catch(console.error);
