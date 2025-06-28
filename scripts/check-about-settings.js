const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAboutSettings() {
  try {
    const aboutSettings = await prisma.siteSetting.findMany({
      where: {
        key: {
          contains: "about",
        },
      },
    });

    console.log("🔍 About Section Settings:");
    aboutSettings.forEach((setting) => {
      console.log(`${setting.key}: ${setting.value}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAboutSettings();
