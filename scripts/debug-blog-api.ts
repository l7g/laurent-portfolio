import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testBlogQuery() {
  try {
    console.log("=== TESTING BLOG QUERY STEP BY STEP ===");

    // Test 1: Simple blog_posts query
    console.log("\n1. Testing simple blog_posts query...");
    const simplePosts = await prisma.blog_posts.findMany({
      take: 3,
    });
    console.log(`✅ Found ${simplePosts.length} posts`);

    // Test 2: With basic include
    console.log("\n2. Testing with blog_categories include...");
    const postsWithCategory = await prisma.blog_posts.findMany({
      take: 3,
      include: {
        blog_categories: true,
      },
    });
    console.log(`✅ Found ${postsWithCategory.length} posts with categories`);

    // Test 3: With users include
    console.log("\n3. Testing with users include...");
    const postsWithUsers = await prisma.blog_posts.findMany({
      take: 3,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    console.log(`✅ Found ${postsWithUsers.length} posts with users`);

    // Test 4: With published filter
    console.log("\n4. Testing with status filter...");
    const publishedPosts = await prisma.blog_posts.findMany({
      where: {
        status: "PUBLISHED",
      },
      take: 3,
    });
    console.log(`✅ Found ${publishedPosts.length} published posts`);

    // Test 5: Full query (what the API is trying to do)
    console.log("\n5. Testing full API query...");
    const fullQuery = await prisma.blog_posts.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            blog_comments: true,
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    });
    console.log(`✅ Full query successful! Found ${fullQuery.length} posts`);

    // Show the data
    fullQuery.forEach((post) => {
      console.log(
        `- ${post.title} by ${post.users.name} in ${post.blog_categories.name}`,
      );
    });
  } catch (error) {
    console.error("❌ Error in blog query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogQuery();
