const { PrismaClient } = require("@prisma/client");
const { readFileSync } = require("fs");

// Set the DATABASE_URL for Supabase
process.env.DATABASE_URL =
  "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient();

async function fixBlogPosts() {
  try {
    console.log("🔄 Fixing blog posts...");

    const backupPath = "backups/db-backup-2025-07-05T23-19-10-616Z.json";
    const backup = JSON.parse(readFileSync(backupPath, "utf-8"));
    const backupData = backup.data;

    if (backupData.blog_posts && backupData.blog_posts.length > 0) {
      console.log(`📝 Restoring ${backupData.blog_posts.length} blog posts...`);

      for (const post of backupData.blog_posts) {
        try {
          // Remove nested objects and only keep the basic fields
          const cleanPost = {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            categoryId: post.categoryId,
            tags: post.tags,
            status: post.status,
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            authorId: post.authorId,
            views: post.views,
            likes: post.likes,
            publishedAt: post.publishedAt,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            courseId: post.courseId,
          };

          await prisma.blog_posts.upsert({
            where: { id: cleanPost.id },
            update: cleanPost,
            create: cleanPost,
          });

          console.log(`✅ Restored blog post: ${cleanPost.title}`);
        } catch (error) {
          console.log(
            `⚠️  Error with post "${post.title}": ${error.message.split("\n")[0]}`,
          );
        }
      }
    }

    // Check final counts
    const counts = await Promise.all([
      prisma.projects.count(),
      prisma.skills.count(),
      prisma.blog_posts.count(),
      prisma.academic_programs.count(),
      prisma.blog_categories.count(),
    ]);

    console.log(`\n📊 Final homepage data:`);
    console.log(`   - Projects: ${counts[0]} ✅`);
    console.log(`   - Skills: ${counts[1]} ✅`);
    console.log(`   - Blog Posts: ${counts[2]} ${counts[2] > 0 ? "✅" : "❌"}`);
    console.log(`   - Academic Programs: ${counts[3]} ✅`);
    console.log(`   - Blog Categories: ${counts[4]} ✅`);

    console.log("\n🎉 Your homepage should now display:");
    console.log("   - Projects section");
    console.log("   - Skills section");
    console.log("   - Academic degree section");
    if (counts[2] > 0) {
      console.log("   - Blog section");
    }
  } catch (error) {
    console.error("❌ Failed to fix blog posts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBlogPosts();
