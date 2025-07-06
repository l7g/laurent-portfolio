import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateDegreeToHonours() {
  try {
    // Update the degree title to include Honours
    const program = await prisma.academic_programs.updateMany({
      data: {
        degree: "BSc (Hons) International Relations",
        name: "BSc (Hons) International Relations",
        description:
          "An Honours Bachelor of Science degree in International Relations, providing comprehensive understanding of global politics, international law, economics, and diplomatic relations. The Honours designation indicates advanced academic study including independent research and dissertation components.",
      },
    });

    console.log("Degree updated to Honours successfully!");
    console.log(`Updated ${program.count} programs`);
  } catch (error) {
    console.error("Error updating degree to Honours:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDegreeToHonours();
