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

    // Check for existing users first
    const users = await prisma.users.findMany();
    let authorId;

    if (users.length === 0) {
      console.log("No users found. Creating a test user...");
      const testUser = await prisma.users.create({
        data: {
          id: "test-user-" + Date.now(),
          email: "test@example.com",
          name: "Test User",
          password: "hashed-password",
        },
      });
      authorId = testUser.id;
      console.log("✅ Created test user:", authorId);
    } else {
      // Use the first existing user
      authorId = users[0].id;
      console.log("Using existing user:", users[0].name);
    }

    // Test creating a sample series (we'll delete it after)
    console.log("Testing create operation...");
    const testSeries = await prisma.blog_series.create({
      data: {
        title: "Test Series",
        slug: "test-series-" + Date.now(),
        description: "This is a test series",
        authorId: authorId,
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

    // If we created a test user, clean that up too
    if (users.length === 0) {
      await prisma.users.delete({
        where: { id: authorId },
      });
      console.log("✅ Test user cleaned up");
    }
  } catch (error) {
    console.error("❌ Error with blog_series table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogSeries();
