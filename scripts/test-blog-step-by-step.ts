import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testBlogQuery() {
  try {
    console.log("Testing blog query step by step...");

    // Step 1: Basic query without includes
    console.log("\n=== Step 1: Basic query ===");
    const basicPosts = await prisma.blog_posts.findMany({
      where: { status: "PUBLISHED" },
      take: 2,
    });
    console.log(`✓ Basic query works: ${basicPosts.length} posts`);

    // Step 2: Add blog_categories
    console.log("\n=== Step 2: With blog_categories ===");
    const postsWithCategories = await prisma.blog_posts.findMany({
      where: { status: "PUBLISHED" },
      include: {
        blog_categories: true,
      },
      take: 2,
    });
    console.log(`✓ With categories works: ${postsWithCategories.length} posts`);

    // Step 3: Add users
    console.log("\n=== Step 3: With users ===");
    const postsWithUsers = await prisma.blog_posts.findMany({
      where: { status: "PUBLISHED" },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      take: 2,
    });
    console.log(`✓ With users works: ${postsWithUsers.length} posts`);

    // Step 4: Add courses (this might fail)
    console.log("\n=== Step 4: With courses ===");
    const postsWithCourses = await prisma.blog_posts.findMany({
      where: { status: "PUBLISHED" },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        courses: {
          select: {
            id: true,
            code: true,
            title: true,
            year: true,
            semester: true,
          },
        },
      },
      take: 2,
    });
    console.log(`✓ With courses works: ${postsWithCourses.length} posts`);
    console.log("Sample post with course:", {
      title: postsWithCourses[0]?.title,
      course: postsWithCourses[0]?.courses,
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogQuery();
