// Test database connection and run migrations
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment variables from .env.local first, then .env
config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Query test successful:", result);

    console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Not set");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
