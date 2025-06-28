const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkFlagship() {
  try {
    const featuredProjects = await prisma.project.findMany({
      where: { featured: true },
      select: { title: true, featured: true, sortOrder: true },
    });

    console.log("🏆 Flagship projects:");
    featuredProjects.forEach((p) => {
      console.log(
        `- ${p.title} (featured: ${p.featured}, order: ${p.sortOrder})`,
      );
    });

    const allProjects = await prisma.project.findMany({
      select: { title: true, featured: true, sortOrder: true },
      orderBy: { sortOrder: "asc" },
    });

    console.log("\n📂 All projects:");
    allProjects.forEach((p) => {
      console.log(
        `- ${p.title} (featured: ${p.featured}, order: ${p.sortOrder})`,
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFlagship();
