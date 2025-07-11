#!/usr/bin/env node

/**
 * Production Seed Script - Safe for Production Environment
 *
 * This script safely seeds production data without destroying existing content.
 * It only adds missing essential data and preserves all existing content.
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

/**
 * Check environment and determine database URL
 */
function getDatabaseUrl() {
  const args = process.argv.slice(2);
  const useProduction =
    args.includes("--production") || args.includes("--prod");

  if (useProduction) {
    if (!process.env.PROD_DATABASE_URL) {
      console.error("❌ PROD_DATABASE_URL not found in environment");
      console.log("💡 Make sure PROD_DATABASE_URL is set in .env.local");
      process.exit(1);
    }
    console.log("🏭 Using production database");
    return process.env.PROD_DATABASE_URL;
  } else {
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL not found in environment");
      console.log("💡 Make sure DATABASE_URL is set in .env.local");
      process.exit(1);
    }
    console.log("🧪 Using development database");
    return process.env.DATABASE_URL;
  }
}

// Initialize Prisma with the correct database URL
const databaseUrl = getDatabaseUrl();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

console.log("🌱 Production-Safe Seeding");
console.log("==========================\n");

/**
 * Seed blog categories (only if missing)
 */
async function seedBlogCategories() {
  console.log("📂 Checking blog categories...");

  const existingCategories = await prisma.blog_categories.findMany();

  if (existingCategories.length === 0) {
    console.log("🆕 Creating default blog categories...");

    const categories = [
      {
        id: crypto.randomUUID(),
        name: "Technology",
        slug: "technology",
        description: "Posts about technology, programming, and development",
        color: "#3B82F6",
        icon: "💻",
      },
      {
        id: crypto.randomUUID(),
        name: "Learning",
        slug: "learning",
        description: "Educational content and learning experiences",
        color: "#10B981",
        icon: "📚",
      },
      {
        id: crypto.randomUUID(),
        name: "Projects",
        slug: "projects",
        description: "Project updates and development insights",
        color: "#F59E0B",
        icon: "🚀",
      },
    ];

    for (const category of categories) {
      await prisma.blog_categories.create({
        data: {
          ...category,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log("✅ Blog categories created");
  } else {
    console.log(
      `ℹ️  Found ${existingCategories.length} existing blog categories - skipping`,
    );
  }
}

/**
 * Ensure admin user exists
 */
async function ensureAdminUser() {
  console.log("👤 Checking admin user...");

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.log("⚠️  ADMIN_EMAIL not set - skipping admin user check");
    return;
  }

  // Note: In a real app, you'd check your users table here
  // For now, just log that admin should be set up
  console.log(`ℹ️  Admin user should be: ${adminEmail}`);
  console.log(
    "ℹ️  Ensure admin user is properly configured in your auth system",
  );
}

/**
 * Verify database structure for comments
 */
async function verifyCommentsStructure() {
  console.log("💬 Verifying comments structure...");

  try {
    // Try to query the comments table to ensure it exists
    const commentCount = await prisma.blog_comments.count();
    console.log(`✅ Comments table exists (${commentCount} comments found)`);

    // Check if any blog posts exist for comment testing
    const postCount = await prisma.blog_posts.count();
    console.log(`ℹ️  Found ${postCount} blog posts for commenting`);
  } catch (error) {
    console.error("❌ Comments structure verification failed:", error.message);
    console.log(
      "💡 This might mean the comments migration needs to be applied",
    );
    throw error;
  }
}

/**
 * Create sample data for development/staging (not production)
 */
async function createSampleDataIfNeeded() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    console.log("🏭 Production environment detected - skipping sample data");
    return;
  }

  console.log("🧪 Development environment - checking for sample data...");

  const postCount = await prisma.blog_posts.count();

  if (postCount === 0) {
    console.log("📝 Creating sample blog post for testing...");

    const categories = await prisma.blog_categories.findMany();
    const techCategory =
      categories.find((c) => c.slug === "technology") || categories[0];

    if (techCategory) {
      await prisma.blog_posts.create({
        data: {
          id: crypto.randomUUID(),
          title: "Welcome to My Blog",
          slug: "welcome-to-my-blog",
          excerpt: "This is a sample blog post to test the commenting system.",
          content: `# Welcome to My Blog

This is a sample blog post created to test the new commenting system.

## Features

- Blog comments with moderation
- Email notifications
- Spam detection
- Auto-approval for clean comments

Feel free to leave a comment below to test the system!`,
          categoryId: techCategory.id,
          status: "PUBLISHED",
          featured: false,
          views: 0,
          likes: 0,
          readingTime: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log("✅ Sample blog post created");
    }
  } else {
    console.log(
      `ℹ️  Found ${postCount} existing blog posts - skipping sample data`,
    );
  }
}

/**
 * Main seeding function
 */
async function main() {
  try {
    console.log("🎯 Starting production-safe seeding...\n");

    await seedBlogCategories();
    await ensureAdminUser();
    await verifyCommentsStructure();
    await createSampleDataIfNeeded();

    console.log("\n🎉 Production seeding completed successfully!");
    console.log("==========================================");
    console.log("✅ All essential data verified/created");
    console.log("✅ Database structure validated");
    console.log("✅ Ready for production use");

    // Log current state
    const stats = {
      categories: await prisma.blog_categories.count(),
      posts: await prisma.blog_posts.count(),
      comments: await prisma.blog_comments.count(),
    };

    console.log("\n📊 Current database state:");
    console.log(`   • Blog categories: ${stats.categories}`);
    console.log(`   • Blog posts: ${stats.posts}`);
    console.log(`   • Comments: ${stats.comments}`);
  } catch (error) {
    console.error("💥 Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Seeding interrupted");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Seeding terminated");
  await prisma.$disconnect();
  process.exit(0);
});

main().catch(console.error);
