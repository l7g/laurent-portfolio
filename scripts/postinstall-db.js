const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function postinstallDatabase() {
  try {
    // Only run in production environment
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "🔄 Skipping database operations in non-production environment",
      );
      return;
    }

    console.log("🚀 Starting production database setup...");

    // Check if database connection is available
    try {
      await prisma.$connect();
      console.log("✅ Database connection successful");
    } catch (error) {
      console.log(
        "⚠️  Database connection failed, skipping database operations",
      );
      console.log(
        "   This is normal during build time when database is not available",
      );
      return;
    }

    // Run safe migrations
    console.log("📦 Running database migrations...");
    try {
      execSync("npx prisma migrate deploy", {
        stdio: "inherit",
        env: { ...process.env, PRISMA_CLI_QUERY_ENGINE_TYPE: "binary" },
      });
      console.log("✅ Database migrations completed");
    } catch (error) {
      console.error("❌ Database migration failed:", error.message);
      // Don't fail the build, just log the error
      return;
    }

    // Run seeding only if database is empty
    console.log("🌱 Checking if seeding is needed...");
    try {
      const existingData =
        (await prisma.user.count()) +
        (await prisma.project.count()) +
        (await prisma.portfolioSection.count());

      if (existingData === 0) {
        console.log("📦 Database is empty, running deployment seed...");
        execSync("npm run seed:deployment", {
          stdio: "inherit",
          env: { ...process.env, PRISMA_CLI_QUERY_ENGINE_TYPE: "binary" },
        });
        console.log("✅ Database seeding completed");
      } else {
        console.log("✅ Database already contains data, skipping seeding");
      }
    } catch (error) {
      console.error("❌ Database seeding failed:", error.message);
      // Don't fail the build, just log the error
    }
  } catch (error) {
    console.error("❌ Error in postinstall database setup:", error);
    // Don't fail the build, just log the error
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
postinstallDatabase().catch(console.error);
