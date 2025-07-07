const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("Missing DATABASE_URL environment variable");
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  // Read migration file
  const migrationPath = path.join(
    __dirname,
    "../supabase/migrations/001_add_blog_series.sql",
  );
  const migrationSQL = fs.readFileSync(migrationPath, "utf8");

  console.log("Running migration: 001_add_blog_series.sql");

  try {
    await client.connect();

    // Execute the migration
    await client.query(migrationSQL);

    console.log("Migration completed successfully!");

    // Verify the tables exist
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_series'
      );
    `);

    if (result.rows[0].exists) {
      console.log("✓ blog_series table created successfully");
    } else {
      console.log("✗ blog_series table was not created");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
