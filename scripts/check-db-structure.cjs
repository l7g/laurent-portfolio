const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    console.log("🔍 Checking actual database structure...");

    // Get the actual table structure from the database
    const blogCommentsColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'blog_comments' 
      ORDER BY ordinal_position;
    `;

    console.log("📋 blog_comments table structure:");
    console.log(blogCommentsColumns);

    // Check if likes column exists
    const hasLikes = blogCommentsColumns.some(
      (col) => col.column_name === "likes",
    );
    console.log("\n💡 likes column exists:", hasLikes);

    // Get blog_posts structure
    const blogPostsColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      ORDER BY ordinal_position;
    `;

    console.log("\n📋 blog_posts table structure:");
    console.log(blogPostsColumns);

    // Check if series fields exist
    const hasSeriesId = blogPostsColumns.some(
      (col) => col.column_name === "seriesId",
    );
    const hasSeriesOrder = blogPostsColumns.some(
      (col) => col.column_name === "seriesOrder",
    );
    console.log("\n💡 seriesId column exists:", hasSeriesId);
    console.log("💡 seriesOrder column exists:", hasSeriesOrder);

    // Check if blog_series table exists
    const tablesQuery = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'blog%';
    `;

    console.log("\n📋 Blog-related tables:");
    console.log(tablesQuery);
  } catch (error) {
    console.error("❌ Database structure check failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStructure();
