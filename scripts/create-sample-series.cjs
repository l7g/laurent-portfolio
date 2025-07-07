const { PrismaClient } = require("@prisma/client");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const prisma = new PrismaClient();

async function createSampleSeries() {
  try {
    // Get the first user to use as author
    const user = await prisma.users.findFirst();
    if (!user) {
      console.error("No users found. Please create a user first.");
      return;
    }

    // Create a sample blog series
    const series = await prisma.blog_series.create({
      data: {
        title: "Modern Web Development",
        slug: "modern-web-development",
        description:
          "A comprehensive guide to modern web development using cutting-edge technologies and best practices.",
        color: "#3B82F6",
        icon: "🚀",
        difficulty: "intermediate",
        tags: ["javascript", "react", "nextjs", "web-development"],
        authorId: user.id,
        sortOrder: 1,
        metaTitle: "Modern Web Development Series",
        metaDescription:
          "Learn modern web development from scratch with practical examples and real-world projects.",
      },
    });

    console.log("✅ Sample blog series created:", series);

    // Update existing posts to be part of the series
    const posts = await prisma.blog_posts.findMany({
      where: { status: "PUBLISHED" },
      take: 2,
    });

    if (posts.length > 0) {
      for (let i = 0; i < posts.length; i++) {
        await prisma.blog_posts.update({
          where: { id: posts[i].id },
          data: {
            seriesId: series.id,
            seriesOrder: i + 1,
          },
        });
        console.log(
          `✅ Updated post "${posts[i].title}" to be part of series (order: ${i + 1})`,
        );
      }
    }

    // Create another series
    const series2 = await prisma.blog_series.create({
      data: {
        title: "International Relations & Tech",
        slug: "international-relations-tech",
        description:
          "Exploring the intersection of technology and international relations in the modern world.",
        color: "#10B981",
        icon: "🌍",
        difficulty: "advanced",
        tags: ["geopolitics", "technology", "international-relations"],
        authorId: user.id,
        sortOrder: 2,
        metaTitle: "International Relations & Tech Series",
        metaDescription:
          "Understand how technology shapes global politics and international relations.",
      },
    });

    console.log("✅ Second blog series created:", series2);
  } catch (error) {
    console.error("Error creating sample series:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleSeries();
