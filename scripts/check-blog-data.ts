import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkBlogData() {
  try {
    console.log("=== CHECKING BLOG DATA ===");

    // Check blog categories
    const categories = await prisma.blog_categories.findMany();
    console.log(`\nBlog Categories (${categories.length}):`);
    categories.forEach((cat) => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });

    // Check blog posts
    const posts = await prisma.blog_posts.findMany({
      include: {
        blog_categories: true,
        users: {
          select: { name: true, email: true },
        },
      },
    });
    console.log(`\nBlog Posts (${posts.length}):`);
    posts.forEach((post) => {
      console.log(`- ${post.title} (${post.slug}) - Status: ${post.status}`);
      console.log(
        `  Author: ${post.users.name}, Category: ${post.blog_categories.name}`,
      );
    });

    // Check users
    const users = await prisma.users.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    console.log(`\nUsers (${users.length}):`);
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
  } catch (error) {
    console.error("Error checking blog data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogData();
