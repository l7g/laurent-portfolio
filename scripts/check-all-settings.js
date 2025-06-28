const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });

    console.log(`📊 Site Settings (${settings.length}):`);
    console.log("");

    // Group by category
    const heroSettings = settings.filter((s) => s.key.startsWith("hero_"));
    const aboutSettings = settings.filter((s) => s.key.startsWith("about_"));
    const contactSettings = settings.filter((s) =>
      s.key.startsWith("contact_"),
    );
    const otherSettings = settings.filter(
      (s) =>
        !s.key.startsWith("hero_") &&
        !s.key.startsWith("about_") &&
        !s.key.startsWith("contact_"),
    );

    if (heroSettings.length > 0) {
      console.log("🎯 Hero Section Settings:");
      heroSettings.forEach((s) => {
        const value =
          s.value.length > 50 ? s.value.substring(0, 50) + "..." : s.value;
        console.log(`  - ${s.key}: ${value}`);
      });
      console.log("");
    }

    if (aboutSettings.length > 0) {
      console.log("👨‍💻 About Section Settings:");
      aboutSettings.forEach((s) => {
        const value =
          s.value.length > 50 ? s.value.substring(0, 50) + "..." : s.value;
        console.log(`  - ${s.key}: ${value}`);
      });
      console.log("");
    }

    if (contactSettings.length > 0) {
      console.log("📞 Contact Section Settings:");
      contactSettings.forEach((s) => {
        const value =
          s.value.length > 50 ? s.value.substring(0, 50) + "..." : s.value;
        console.log(`  - ${s.key}: ${value}`);
      });
      console.log("");
    }

    if (otherSettings.length > 0) {
      console.log("⚙️ Other Settings:");
      otherSettings.forEach((s) => {
        const value =
          s.value.length > 50 ? s.value.substring(0, 50) + "..." : s.value;
        console.log(`  - ${s.key}: ${value}`);
      });
      console.log("");
    }

    // Check if they're public (accessible by frontend)
    const publicSettings = settings.filter((s) => s.isPublic);
    console.log(
      `🌐 Public Settings (accessible by frontend): ${publicSettings.length}`,
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSiteSettings();
