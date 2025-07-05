import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAboutSection() {
  try {
    const aboutSection = await prisma.portfolioSection.findFirst({
      where: { name: "about" },
    });

    console.log("About section data:");
    console.log("Title:", aboutSection?.title);
    console.log("Subtitle:", aboutSection?.subtitle);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAboutSection();
