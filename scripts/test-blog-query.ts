import { PrismaClient, BlogStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function testBlogPostsQuery() {
  try {
    console.log("Testing blog posts query...");

    // Test the exact query from the API
    const where = {
      status: BlogStatus.PUBLISHED,
    };

    console.log("Where clause:", JSON.stringify(where, null, 2));

    const posts = await prisma.blog_posts.findMany({
      where,
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

    console.log(`Found ${posts.length} posts`);
    posts.forEach((post) => {
      console.log(`- ${post.title} (${post.status})`);
      console.log(
        `  Category: ${(post as any).blog_categories?.name || "None"}`,
      );
      console.log(`  Author: ${(post as any).users?.name || "None"}`);
    });
  } catch (error) {
    console.error("Error in query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogPostsQuery();
