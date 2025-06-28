import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDb() {
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Database connection working. Users: ${userCount}`);

    const settingsCount = await prisma.siteSetting.count();
    console.log(`✅ Site settings count: ${settingsCount}`);

    // Try to create a test setting
    await prisma.siteSetting.upsert({
      where: { key: "test_setting" },
      update: { value: "updated" },
      create: {
        key: "test_setting",
        value: "test_value",
        type: "text",
        description: "Test setting",
        isPublic: true,
      },
    });

    console.log("✅ Test setting created/updated successfully");
  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDb();
