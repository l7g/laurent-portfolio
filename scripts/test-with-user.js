// Check existing users and test with a real user
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

async function testWithRealUser() {
  try {
    console.log("Checking existing users...");

    // Get existing users
    const users = await prisma.users.findMany();
    console.log(`Found ${users.length} users`);

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
      console.log("✅ Created test user:", testUser.id);
    }

    // Get the first user
    const user = await prisma.users.findFirst();
    console.log("Using user:", user?.name);

    if (user) {
      // Test creating a series with the real user
      console.log("Testing create series with real user...");
      const testSeries = await prisma.blog_series.create({
        data: {
          title: "Test Series",
          slug: "test-series-" + Date.now(),
          description: "This is a test series",
          authorId: user.id,
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
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testWithRealUser();
