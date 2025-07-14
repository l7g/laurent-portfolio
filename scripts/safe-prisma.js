#!/usr/bin/env node

/**
 * Safe Prisma commands that automatically handle environment switching
 * No more manual DATABASE_URL juggling!
 */

import { execSync, spawnSync } from "child_process";
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

// Sanitize migration name to prevent command injection
function sanitizeMigrationName(name) {
  // Only allow alphanumeric characters, underscores, and hyphens
  const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  if (sanitized !== name) {
    console.log(
      `⚠️  Migration name sanitized from "${name}" to "${sanitized}"`,
    );
  }
  return sanitized;
}

// Execute command with proper environment (safe version)
function execWithEnv(command, mode) {
  const envVars = loadEnvFile(mode);
  const env = { ...process.env, ...envVars };

  console.log(`🔧 Running: ${command}`);
  console.log(`📁 Environment: ${mode}`);
  console.log(`🔗 Database: ${envVars.DATABASE_URL?.substring(0, 30)}...`);

  execSync(command, { stdio: "inherit", env });
}

// Execute command with arguments array (safer for user input)
function execWithArgs(command, args, mode) {
  const envVars = loadEnvFile(mode);
  const env = { ...process.env, ...envVars };

  console.log(`🔧 Running: ${command} ${args.join(" ")}`);
  console.log(`📁 Environment: ${mode}`);
  console.log(`🔗 Database: ${envVars.DATABASE_URL?.substring(0, 30)}...`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
    shell: false, // Explicitly disable shell interpretation
  });

  if (result.error) {
    throw new Error(`Command failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`Command exited with status ${result.status}`);
  }
}

// Execute pg_dump with proper argument handling
function execPgDump(databaseUrl, outputFile, mode) {
  const envVars = loadEnvFile(mode);
  const env = { ...process.env, ...envVars };

  console.log(`🔧 Running: pg_dump to ${outputFile}`);
  console.log(`📁 Environment: ${mode}`);
  console.log(`🔗 Database: ${envVars.DATABASE_URL?.substring(0, 30)}...`);

  // Use spawnSync with array arguments to avoid shell interpretation
  const result = spawnSync("pg_dump", [databaseUrl], {
    stdio: ["inherit", "pipe", "inherit"],
    env,
    shell: false,
  });

  if (result.error) {
    throw new Error(`pg_dump failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`pg_dump exited with status ${result.status}`);
  }

  // Write the output to file
  fs.writeFileSync(outputFile, result.stdout);
}

// Main script
const [, , action, ...args] = process.argv;

switch (action) {
  case "dev:migrate":
    console.log("🏠 Creating development migration...");
    const migrationName = sanitizeMigrationName(args[0] || "schema_changes");
    execWithArgs(
      "npx",
      ["prisma", "migrate", "dev", "--name", migrationName],
      "development",
    );
    break;

  case "dev:studio":
    console.log("🏠 Opening development Prisma Studio...");
    execWithArgs("npx", ["prisma", "studio"], "development");
    break;

  case "dev:status":
    console.log("🏠 Checking development migration status...");
    execWithArgs("npx", ["prisma", "migrate", "status"], "development");
    break;

  case "dev:push":
    console.log("🏠 Pushing schema to development (no migration files)...");
    execWithArgs("npx", ["prisma", "db", "push"], "development");
    break;

  case "dev:reset":
    console.log("🏠 Resetting development database...");
    execWithArgs(
      "npx",
      ["prisma", "migrate", "reset", "--force"],
      "development",
    );
    break;

  case "dev:seed":
    console.log("🏠 Seeding development database...");
    execWithArgs("npx", ["prisma", "db", "seed"], "development");
    break;

  case "prod:deploy":
    console.log("🚀 Deploying to production...");
    execWithArgs("npx", ["prisma", "generate"], "production");
    execWithArgs("npx", ["prisma", "migrate", "deploy"], "production");
    console.log("✅ Production deployment complete!");
    break;

  case "prod:backup":
    console.log("🚀 Creating production database backup...");
    const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
    const backupDir = join(projectRoot, "backups");
    const backupFile = join(backupDir, `prod-backup-${timestamp}.sql`);

    // Ensure backups directory exists
    if (!fs.existsSync(backupDir)) {
      console.log("📁 Creating backups directory...");
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const envVars = loadEnvFile("production");
    if (!envVars.DATABASE_URL) {
      throw new Error("DATABASE_URL not found in production environment");
    }

    execPgDump(envVars.DATABASE_URL, backupFile, "production");
    console.log(`✅ Backup saved to ${backupFile}`);
    break;

  case "prod:push":
    console.log("🚀 Pushing schema changes to production (db push)...");
    execWithArgs("npx", ["prisma", "db", "push"], "production");
    break;

  case "prod:check-schema":
    console.log("🚀 Checking production database schema...");
    execWithArgs("npx", ["prisma", "db", "pull", "--print"], "production");
    break;

  case "prod:status":
    console.log("🚀 Checking production migration status...");
    execWithArgs("npx", ["prisma", "migrate", "status"], "production");
    break;

  case "prod:studio":
    console.log("🚀 Opening production Prisma Studio...");
    console.log("⚠️  READ-ONLY mode recommended for production!");
    execWithArgs("npx", ["prisma", "studio"], "production");
    break;

  case "generate":
    console.log("🔧 Generating Prisma client...");
    execWithArgs("npx", ["prisma", "generate"], "development");
    break;

  default:
    console.log(`
🛠️  Safe Prisma Commands

Development (Docker):
  npm run prisma dev:migrate [name]    - Create migration
  npm run prisma dev:studio           - Open Studio
  npm run prisma dev:status           - Check status
  npm run prisma dev:push             - Push schema
  npm run prisma dev:reset            - Reset database
  npm run prisma dev:seed             - Seed database
  npm run prisma generate             - Generate client

Production (Neon):
  npm run prisma prod:deploy          - Deploy migrations
  npm run prisma prod:backup          - Create database backup
  npm run prisma prod:check-schema    - Check actual schema
  npm run prisma prod:status          - Check status
  npm run prisma prod:studio          - Open Studio (careful!)

Examples:
  npm run prisma dev:migrate add_demo_fields
  npm run prisma prod:deploy
    `);
}
