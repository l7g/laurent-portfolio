const { PrismaClient } = require("@prisma/client");

async function checkProjectOrder() {
  const prisma = new PrismaClient();
  try {
    const projects = await prisma.project.findMany({
      select: {
        title: true,
        image: true,
        flagship: true,
        featured: true,
        sortOrder: true,
      },
      orderBy: [
        { flagship: "desc" },
        { featured: "desc" },
        { sortOrder: "asc" },
      ],
    });
    console.log("Projects in order:");
    projects.forEach((p, i) => {
      console.log(
        `${i}: ${p.title} (flagship: ${p.flagship}, featured: ${p.featured}, image: ${p.image})`,
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjectOrder();
