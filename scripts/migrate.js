// Custom migration script that works with Supabase
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { execSync } from "child_process";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config({ path: ".env" });

async function runMigration() {
  try {
    console.log("🚀 Starting migration process...");

    // First, generate the Prisma client
    console.log("📦 Generating Prisma client...");
    execSync("npx prisma generate", { stdio: "inherit" });

    // Then push the schema to the database
    console.log("🔄 Pushing schema to database...");
    execSync("npx prisma db push", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });

    console.log("✅ Migration completed successfully!");

    // Test the connection
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log("✅ Database connection verified!");

    // Check if blog_series table exists
    try {
      const series = await prisma.blog_series.findMany({ take: 1 });
      console.log("✅ blog_series table is ready!");
    } catch (error) {
      console.log("⚠️  blog_series table may not exist yet, but that's okay");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
