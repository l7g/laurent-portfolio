#!/usr/bin/env node

/**
 * Production Seed Script
 * Seeds database for production environment
 */

const { execSync } = require("child_process");

console.log("🌱 Starting production seeding...");

try {
  // Run the main TypeScript seed file with production flag
  console.log("📦 Seeding production database...");
  execSync("npx tsx prisma/seed.ts", {
    stdio: "inherit",
    env: {
      ...process.env,
      PRISMA_CLI_QUERY_ENGINE_TYPE: "binary",
      NODE_ENV: "production",
    },
  });

  console.log("✅ Production seeding completed successfully!");
} catch (error) {
  console.error("❌ Production seeding failed:", error.message);
  process.exit(1);
}
