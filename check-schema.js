import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function checkBlogPostsSchema() {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();

    // Query the information schema to see what columns exist
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      ORDER BY ordinal_position;
    `;

    console.log("Current blog_posts table columns:");
    console.table(result);
  } catch (error) {
    console.error("Error checking schema:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogPostsSchema();
