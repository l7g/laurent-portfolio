// Test if blog_series table was created
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

async function testBlogSeries() {
  try {
    console.log("Testing blog_series table...");

    // Try to query the table
    const series = await prisma.blog_series.findMany();
    console.log("✅ blog_series table exists and is accessible!");
    console.log(`Found ${series.length} series`);

    // Test creating a sample series (we'll delete it after)
    console.log("Testing create operation...");
    const testSeries = await prisma.blog_series.create({
      data: {
        title: "Test Series",
        slug: "test-series-" + Date.now(),
        description: "This is a test series",
        authorId: "test-user-" + Date.now(), // We'll need to create a user first
        color: "#FF6B6B",
        tags: ["test", "demo"],
      },
    });

    console.log("✅ Successfully created test series:", testSeries.id);

    // Clean up - delete the test series
    await prisma.blog_series.delete({
      where: { id: testSeries.id },
    });

    console.log("✅ Test series cleaned up");
  } catch (error) {
    console.error("❌ Error with blog_series table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogSeries();
