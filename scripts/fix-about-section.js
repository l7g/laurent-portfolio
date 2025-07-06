import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixAboutSection() {
  console.log("🔧 Fixing About section title...");

  try {
    // First find the about section
    const aboutSection = await prisma.portfolio_sections.findFirst({
      where: { name: "about" },
    });

    if (!aboutSection) {
      console.log("❌ About section not found");
      return;
    }

    // Update the about section to have "About" as title and "Me" as subtitle
    const updatedSection = await prisma.portfolio_sections.update({
      where: { id: aboutSection.id },
      data: {
        title: "About",
        subtitle: "Me",
      },
    });

    console.log("✅ About section updated successfully!");
    console.log(`Title: "${updatedSection.title}"`);
    console.log(`Subtitle: "${updatedSection.subtitle}"`);
  } catch (error) {
    console.error("❌ Error updating about section:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAboutSection();
