import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { isPublic: true },
      select: {
        key: true,
        value: true,
        type: true,
      },
    });

    console.log("📊 Public Site Settings:");
    settings.forEach((setting) => {
      console.log(
        `  ${setting.key}: ${setting.value.substring(0, 100)}${setting.value.length > 100 ? "..." : ""}`,
      );
    });

    console.log(`\n✅ Found ${settings.length} public settings`);
  } catch (error) {
    console.error("❌ Error fetching site settings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSiteSettings();
