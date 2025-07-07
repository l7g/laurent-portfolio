const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkSchema() {
  try {
    console.log("🔍 Checking database schema...");

    // Check if we can query the likes field
    const result = await prisma.blog_comments.findMany({
      select: { id: true, likes: true },
    });
    console.log("✅ likes field exists in blog_comments table");
    console.log("   Total comments:", result.length);

    // Check blog_posts fields
    const posts = await prisma.blog_posts.findMany({
      select: { id: true, seriesId: true, seriesOrder: true },
    });
    console.log("✅ seriesId and seriesOrder fields exist in blog_posts table");
    console.log("   Total posts:", posts.length);

    // Check blog_series table
    const series = await prisma.blog_series.findMany({
      select: { id: true, slug: true },
    });
    console.log("✅ blog_series table exists");
    console.log("   Total series:", series.length);

    // Check if all required tables exist
    const tables = [
      "blog_categories",
      "blog_comments",
      "blog_posts",
      "blog_series",
      "users",
      "projects",
      "skills",
      "contacts",
    ];

    for (const table of tables) {
      try {
        const count = await prisma[table].count();
        console.log(`✅ ${table} table exists with ${count} records`);
      } catch (error) {
        console.log(`❌ ${table} table missing or has issues`);
      }
    }

    console.log("\n🎉 Database schema check completed successfully!");
    console.log("🔧 All blog enhancement fields are properly set up.");
  } catch (error) {
    console.error("❌ Schema check failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
