#!/usr/bin/env node

/**
 * Deployment Restore Script
 * Restores data for production deployment
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("🔄 Starting deployment restore...");

try {
  // Check if backup file exists
  const backupPath = path.join(__dirname, "..", "backups", "latest.json");

  try {
    require("fs").accessSync(backupPath);
    console.log("📦 Found backup file, restoring...");
    execSync(
      `node ${path.join(__dirname, "restore-database.cjs")} ${backupPath}`,
      {
        stdio: "inherit",
        env: { ...process.env, PRISMA_CLI_QUERY_ENGINE_TYPE: "binary" },
      },
    );
  } catch (error) {
    console.log("📝 No backup found, running fresh seed instead...");
    execSync("npx tsx prisma/seed.ts", {
      stdio: "inherit",
      env: { ...process.env, PRISMA_CLI_QUERY_ENGINE_TYPE: "binary" },
    });
  }

  console.log("✅ Deployment restore completed successfully!");
} catch (error) {
  console.error("❌ Deployment restore failed:", error.message);
  process.exit(1);
}
