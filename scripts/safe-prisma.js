#!/usr/bin/env node

/**
 * Safe Prisma commands that automatically handle environment switching
 * No more manual DATABASE_URL juggling!
 */

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

// Load environment file based on mode
function loadEnvFile(mode) {
  const envFile = join(projectRoot, `.env.${mode}`);
  if (!fs.existsSync(envFile)) {
    throw new Error(`Environment file not found: .env.${mode}`);
  }

  const envContent = fs.readFileSync(envFile, "utf-8");
  const envVars = {};

  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });

  return envVars;
}

// Execute command with proper environment
function execWithEnv(command, mode) {
  const envVars = loadEnvFile(mode);
  const env = { ...process.env, ...envVars };

  console.log(`🔧 Running: ${command}`);
  console.log(`📁 Environment: ${mode}`);
  console.log(`🔗 Database: ${envVars.DATABASE_URL?.substring(0, 30)}...`);

  execSync(command, { stdio: "inherit", env });
}

// Main script
const [, , action, ...args] = process.argv;

switch (action) {
  case "dev:migrate":
    console.log("🏠 Creating development migration...");
    const migrationName = args[0] || "schema_changes";
    execWithEnv(
      `npx prisma migrate dev --name ${migrationName}`,
      "development",
    );
    break;

  case "dev:studio":
    console.log("🏠 Opening development Prisma Studio...");
    execWithEnv("npx prisma studio", "development");
    break;

  case "dev:status":
    console.log("🏠 Checking development migration status...");
    execWithEnv("npx prisma migrate status", "development");
    break;

  case "prod:deploy":
    console.log("🚀 Deploying to production...");
    execWithEnv("npx prisma generate", "production");
    execWithEnv("npx prisma migrate deploy", "production");
    console.log("✅ Production deployment complete!");
    break;

  case "prod:status":
    console.log("🚀 Checking production migration status...");
    execWithEnv("npx prisma migrate status", "production");
    break;

  case "prod:studio":
    console.log("🚀 Opening production Prisma Studio...");
    console.log("⚠️  READ-ONLY mode recommended for production!");
    execWithEnv("npx prisma studio", "production");
    break;

  case "generate":
    console.log("🔧 Generating Prisma client...");
    execWithEnv("npx prisma generate", "development");
    break;

  default:
    console.log(`
🛠️  Safe Prisma Commands

Development (Docker):
  npm run prisma dev:migrate [name]    - Create migration
  npm run prisma dev:studio           - Open Studio
  npm run prisma dev:status           - Check status
  npm run prisma generate             - Generate client

Production (Neon):
  npm run prisma prod:deploy          - Deploy migrations
  npm run prisma prod:status          - Check status
  npm run prisma prod:studio          - Open Studio (careful!)

Examples:
  npm run prisma dev:migrate add_demo_fields
  npm run prisma prod:deploy
    `);
}
