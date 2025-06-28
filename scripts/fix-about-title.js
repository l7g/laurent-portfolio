const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixAboutSection() {
  try {
    console.log("🔧 Fixing About section title duplication...");

    // First find the about section
    const aboutSection = await prisma.portfolioSection.findFirst({
      where: { name: "about" },
    });

    if (!aboutSection) {
      console.log("❌ About section not found");
      return;
    }

    // Update the About section to have proper title/subtitle split
    await prisma.portfolioSection.update({
      where: { id: aboutSection.id },
      data: {
        title: "About",
        subtitle: "Me",
      },
    });

    console.log('✅ Updated About section to: "About" + "Me"');

    // Verify the fix
    const updatedSection = await prisma.portfolioSection.findUnique({
      where: { id: aboutSection.id },
    });

    console.log(
      `📄 About section now shows: "${updatedSection?.title}" + "${updatedSection?.subtitle}"`,
    );
  } catch (error) {
    console.error("❌ Error fixing about section:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAboutSection();
