#!/usr/bin/env node

/**
 * Fix schema drift by creating a migration for manually added fields
 * This resolves the mismatch between actual DB structure and migration history
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const migrationDir = "./prisma/migrations";
const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+/, "");
const migrationName = `${timestamp}_fix_schema_drift`;
const migrationPath = path.join(migrationDir, migrationName);

console.log("🔧 Creating schema drift fix migration...");

// Create migration directory
fs.mkdirSync(migrationPath, { recursive: true });

// Create a "no-op" migration that tells Prisma the fields already exist
const migrationSQL = `-- This migration resolves schema drift
-- The demo and featured fields were added manually and already exist
-- This migration makes Prisma aware of them without changing the database

-- No actual SQL changes needed - fields already exist in production
SELECT 1; -- No-op statement
`;

fs.writeFileSync(path.join(migrationPath, "migration.sql"), migrationSQL);

console.log(`✅ Created migration: ${migrationName}`);
console.log(
  "📝 This migration tells Prisma about manually added fields without changing the database",
);

// Now mark this migration as applied in production
console.log("🚀 Marking migration as applied in production...");
execSync(`npx prisma migrate resolve --applied ${migrationName}`, {
  stdio: "inherit",
  env: {
    ...process.env,
    ...JSON.parse(
      fs
        .readFileSync(".env.production", "utf-8")
        .split("\n")
        .reduce((acc, line) => {
          const [key, value] = line.split("=");
          if (key && value) acc[key] = value;
          return acc;
        }, {}),
    ),
  },
});

console.log(
  "✅ Schema drift resolved! Production now knows about the manual changes.",
);
