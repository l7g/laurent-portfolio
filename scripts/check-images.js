const { PrismaClient } = require("@prisma/client");

async function checkImages() {
  const prisma = new PrismaClient();
  try {
    const projects = await prisma.project.findMany({
      select: { title: true, image: true },
    });
    console.log("Projects with images:");
    projects.forEach((p) => {
      console.log(`- ${p.title}: image='${p.image}'`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages();
