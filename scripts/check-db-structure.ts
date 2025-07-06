import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    console.log("=== CHECKING DATABASE STRUCTURE ===");

    // Check blog_posts table structure
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      ORDER BY ordinal_position;
    `;

    console.log("\n📋 blog_posts table columns:");
    console.log(result);

    // Try to select from blog_posts without courseId
    const posts = await prisma.$queryRaw`
      SELECT id, title, status, "authorId", "categoryId"
      FROM blog_posts 
      LIMIT 3;
    `;

    console.log("\n📝 Sample blog posts (without courseId):");
    console.log(posts);
  } catch (error) {
    console.error("Error checking database structure:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStructure();
