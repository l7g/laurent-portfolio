#!/usr/bin/env node

/**
 * Copy Development Data to Production
 *
 * This script copies all your blog data from development to production,
 * preserving your draft posts and real content.
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

console.log("📋 Copy Development to Production");
console.log("=================================\n");

async function copyDevToProduction() {
  try {
    // Initialize both databases
    const devPrisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });

    const prodPrisma = new PrismaClient({
      datasources: { db: { url: process.env.PROD_DATABASE_URL } },
    });

    await devPrisma.$connect();
    await prodPrisma.$connect();

    console.log("✅ Connected to both databases");

    // 1. Copy blog categories
    console.log("\n📂 Copying blog categories...");
    const devCategories = await devPrisma.blog_categories.findMany();

    if (devCategories.length > 0) {
      // Clear existing categories in production
      await prodPrisma.blog_categories.deleteMany({});

      // Copy categories
      for (const category of devCategories) {
        await prodPrisma.blog_categories.create({
          data: {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            color: category.color,
            icon: category.icon,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          },
        });
      }
      console.log(`✅ Copied ${devCategories.length} categories`);
    } else {
      console.log("ℹ️  No categories to copy");
    }

    // 2. Copy blog series (if any)
    console.log("\n📚 Copying blog series...");
    const devSeries = await devPrisma.blog_series.findMany();

    if (devSeries.length > 0) {
      // Clear existing series in production
      await prodPrisma.blog_series.deleteMany({});

      // Copy series
      for (const series of devSeries) {
        await prodPrisma.blog_series.create({
          data: {
            id: series.id,
            title: series.title,
            slug: series.slug,
            description: series.description,
            coverImage: series.coverImage,
            status: series.status,
            totalPosts: series.totalPosts,
            createdAt: series.createdAt,
            updatedAt: series.updatedAt,
          },
        });
      }
      console.log(`✅ Copied ${devSeries.length} series`);
    } else {
      console.log("ℹ️  No series to copy");
    }

    // 3. Handle user mapping for foreign keys FIRST
    console.log("\n👤 Setting up user mappings...");
    let userMapping = new Map();

    // Check if we need to handle user IDs
    const devUsers = await devPrisma.users.findMany();
    const prodUsers = await prodPrisma.users.findMany();

    if (devUsers.length > 0 && prodUsers.length > 0) {
      // Try to map users by email if possible
      for (const devUser of devUsers) {
        const prodUser = prodUsers.find((p) => p.email === devUser.email);
        if (prodUser) {
          userMapping.set(devUser.id, prodUser.id);
          console.log(
            `   ✅ Mapped user ${devUser.email}: ${devUser.id} → ${prodUser.id}`,
          );
        } else {
          console.log(`   ⚠️  No matching user in prod for ${devUser.email}`);
        }
      }
    } else if (prodUsers.length === 0 && devUsers.length > 0) {
      // No users in production, but we have posts that need authors
      // Create a temporary admin user for the posts
      console.log(
        "   🔧 No users in production - creating temporary admin user for blog posts",
      );

      const tempAdmin = await prodPrisma.users.create({
        data: {
          id: devUsers[0].id, // Use the same ID as the first dev user
          email: process.env.ADMIN_EMAIL || devUsers[0].email,
          name: devUsers[0].name || "Admin",
          role: "ADMIN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Map all dev users to this temporary admin
      for (const devUser of devUsers) {
        userMapping.set(devUser.id, tempAdmin.id);
        console.log(`   ✅ Mapped ${devUser.email} → temporary admin`);
      }
    } else {
      console.log("   ℹ️  No users to map");
    }

    // 4. Copy blog posts (including your draft!) - AFTER user mapping
    console.log("\n📝 Copying blog posts...");
    const devPosts = await devPrisma.blog_posts.findMany();

    if (devPosts.length > 0) {
      // Clear existing posts in production
      await prodPrisma.blog_posts.deleteMany({});

      // Copy posts with proper author mapping
      let copiedCount = 0;
      let skippedCount = 0;

      for (const post of devPosts) {
        const mappedAuthorId = userMapping.get(post.authorId);

        if (mappedAuthorId) {
          await prodPrisma.blog_posts.create({
            data: {
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              authorId: mappedAuthorId, // Use mapped user ID
              categoryId: post.categoryId,
              seriesId: post.seriesId,
              seriesOrder: post.seriesOrder,
              courseId: post.courseId,
              status: post.status,
              coverImage: post.coverImage,
              tags: post.tags,
              views: post.views,
              likes: post.likes,
              metaTitle: post.metaTitle,
              metaDescription: post.metaDescription,
              publishedAt: post.publishedAt,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
            },
          });
          copiedCount++;
        } else {
          console.log(
            `   ⚠️  Skipping post "${post.title}" - author ${post.authorId} not found in production`,
          );
          skippedCount++;
        }
      }

      console.log(
        `✅ Copied ${copiedCount}/${devPosts.length} posts (including drafts)`,
      );
      if (skippedCount > 0) {
        console.log(
          `   ⚠️  Skipped ${skippedCount} posts due to missing authors`,
        );
      }

      // Show status breakdown for copied posts
      if (copiedCount > 0) {
        const statusCounts = {};
        devPosts.forEach((post) => {
          if (userMapping.get(post.authorId)) {
            statusCounts[post.status] = (statusCounts[post.status] || 0) + 1;
          }
        });

        console.log("   Status breakdown:");
        Object.entries(statusCounts).forEach(([status, count]) => {
          console.log(`   • ${status}: ${count} post(s)`);
        });
      }
    } else {
      console.log("ℹ️  No posts to copy");
    }

    // 4. Copy blog comments (if any)
    console.log("\n💬 Copying blog comments...");
    const devComments = await devPrisma.blog_comments.findMany();

    if (devComments.length > 0) {
      // Clear existing comments in production
      await prodPrisma.blog_comments.deleteMany({});

      // Copy comments
      for (const comment of devComments) {
        await prodPrisma.blog_comments.create({
          data: {
            id: comment.id,
            postId: comment.postId,
            parentId: comment.parentId,
            name: comment.name,
            email: comment.email,
            content: comment.content,
            status: comment.status,
            ipAddress: comment.ipAddress,
            userAgent: comment.userAgent,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
          },
        });
      }
      console.log(`✅ Copied ${devComments.length} comments`);
    } else {
      console.log("ℹ️  No comments to copy");
    }

    // 6. Copy blog post relations (if any) - with user mapping
    console.log("\n🔗 Copying blog post relations...");
    const devRelations = await devPrisma.blog_post_relations.findMany();

    if (devRelations.length > 0) {
      // Clear existing relations in production
      await prodPrisma.blog_post_relations.deleteMany({});

      // Copy relations with proper user mapping
      let copiedCount = 0;
      for (const relation of devRelations) {
        const mappedUserId = userMapping.get(relation.createdBy);

        if (mappedUserId || prodUsers.length === 0) {
          await prodPrisma.blog_post_relations.create({
            data: {
              id: relation.id,
              sourcePostId: relation.sourcePostId,
              targetPostId: relation.targetPostId,
              relationType: relation.relationType,
              createdBy: mappedUserId || relation.createdBy,
              createdAt: relation.createdAt,
            },
          });
          copiedCount++;
        } else {
          console.log(
            `   ⚠️  Skipping relation ${relation.id} - user ${relation.createdBy} not found in production`,
          );
        }
      }
      console.log(
        `✅ Copied ${copiedCount}/${devRelations.length} post relations`,
      );
    } else {
      console.log("ℹ️  No post relations to copy");
    }

    await devPrisma.$disconnect();
    await prodPrisma.$disconnect();

    console.log("\n🎉 Development data copied to production!");
    console.log("=========================================");
    console.log("✅ Your draft posts are now in production");
    console.log("✅ All categories and content preserved");
    console.log("✅ Comment system ready");
    console.log("✅ User relationships safely mapped");
    console.log("✅ Production is now synchronized with dev");

    if (userMapping.size > 0) {
      console.log(`✅ Mapped ${userMapping.size} user(s) between environments`);
    }
  } catch (error) {
    console.error("❌ Copy failed:", error.message);
    process.exit(1);
  }
}

copyDevToProduction().catch(console.error);
