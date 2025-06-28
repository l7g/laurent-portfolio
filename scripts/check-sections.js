const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkSections() {
  try {
    const sections = await prisma.portfolioSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    console.log("📄 Portfolio Sections:");
    sections.forEach((s) => {
      console.log(`\n- ${s.displayName}:`);
      console.log(`  Title: ${s.title}`);
      console.log(`  Subtitle: ${s.subtitle}`);
      console.log(`  Description: ${s.description}`);
      if (s.content) {
        console.log(
          `  Content: ${JSON.stringify(s.content).substring(0, 100)}...`,
        );
      }
    });

    const settings = await prisma.siteSetting.findMany({
      where: { isPublic: true },
      take: 10,
    });

    console.log("\n\n🔧 Site Settings (sample):");
    settings.forEach((s) => {
      console.log(
        `- ${s.key}: ${s.value.substring(0, 50)}${s.value.length > 50 ? "..." : ""}`,
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSections();
