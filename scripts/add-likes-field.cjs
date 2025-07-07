const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addLikesField() {
  try {
    console.log("🔧 Adding likes field to blog_comments table...");

    // Add the likes column
    await prisma.$executeRaw`
      ALTER TABLE blog_comments 
      ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;
    `;

    console.log("✅ Successfully added likes field to blog_comments table");

    // Verify the field was added
    const result = await prisma.blog_comments.findMany({
      select: { id: true, likes: true },
      take: 1,
    });

    console.log("✅ Verified: likes field is now accessible");
    console.log("🎉 Blog enhancement migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addLikesField();
