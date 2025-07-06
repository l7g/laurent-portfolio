const { Pris    // First, create the user that the blog posts reference
    const user = await prisma.users.upsert({
      where: { id: "cmcgr4ntj0000mj4k37b6mmyf" },
      update: {},
      create: {
        id: "cmcgr4ntj0000mj4k37b6mmyf",
        name: "Laurent Gagné",
        email: "laurentgagne.portfolio@gmail.com",
        password: "placeholder_password", // This will be handled by NextAuth
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });require("@prisma/client");
const { readFileSync } = require("fs");

process.env.DATABASE_URL =
  "postgresql://postgres.ioohfhvdyqfwgpvgxtsx:2PMTzgX3mcYAx0y5@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient();

async function createUserAndRestoreBlogPosts() {
  try {
    console.log("🔄 Creating user and restoring blog posts...");

    // First, create the user that the blog posts reference
    const user = await prisma.users.upsert({
      where: { id: "cmcgr4ntj0000mj4k37b6mmyf" },
      update: {},
      create: {
        id: "cmcgr4ntj0000mj4k37b6mmyf",
        name: "Laurent Gagné",
        email: "laurentgagne.portfolio@gmail.com",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("✅ Created/verified user:", user.email);

    // Now restore blog posts
    const backupPath = "backups/db-backup-2025-07-05T23-19-10-616Z.json";
    const backup = JSON.parse(readFileSync(backupPath, "utf-8"));
    const backupData = backup.data;

    if (backupData.blog_posts && backupData.blog_posts.length > 0) {
      console.log(`📝 Restoring ${backupData.blog_posts.length} blog posts...`);

      for (const post of backupData.blog_posts) {
        try {
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
            views: post.views || 0,
            likes: post.likes || 0,
            publishedAt: new Date(post.publishedAt),
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
            courseId: post.courseId,
          };

          await prisma.blog_posts.upsert({
            where: { id: cleanPost.id },
            update: cleanPost,
            create: cleanPost,
          });

          console.log(`✅ Restored blog post: ${cleanPost.title}`);
        } catch (error) {
          console.log(`⚠️  Error with post "${post.title}": ${error.message}`);
        }
      }
    }

    // Final verification
    const counts = await Promise.all([
      prisma.projects.count(),
      prisma.skills.count(),
      prisma.blog_posts.count(),
      prisma.academic_programs.count(),
      prisma.users.count(),
    ]);

    console.log(`\n🎉 SUCCESS! Your homepage now has:`);
    console.log(`   - ✅ Projects: ${counts[0]}`);
    console.log(`   - ✅ Skills: ${counts[1]}`);
    console.log(`   - ✅ Blog Posts: ${counts[2]}`);
    console.log(`   - ✅ Academic Programs: ${counts[3]}`);
    console.log(`   - ✅ Users: ${counts[4]}`);
  } catch (error) {
    console.error("❌ Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUserAndRestoreBlogPosts();
