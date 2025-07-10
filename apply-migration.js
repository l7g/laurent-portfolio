import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log("🚀 Applying migration: add_blog_series_and_course_fields");

    const migrationSQL = readFileSync(
      join(
        __dirname,
        "prisma/migrations/20250710130000_add_blog_series_and_course_fields/migration.sql",
      ),
      "utf-8",
    );

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log("Executing:", statement.substring(0, 50) + "...");
      await prisma.$executeRawUnsafe(statement + ";");
    }

    console.log("✅ Migration applied successfully!");
  } catch (error) {
    console.error("❌ Error applying migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();
