const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateProjectsToPlaceholders() {
  try {
    // Update E-Commerce Dashboard to use placeholder
    await prisma.project.update({
      where: { slug: "ecommerce-dashboard" },
      data: {
        image: "placeholder-ecommerce",
        status: "READY", // Since this is available for freelancing
      },
    });

    // Update Tracker to use actual image (this is your flagship)
    // Keep as is since it has the actual preview image

    // Task Management App already uses placeholder-tasks

    console.log("✅ Updated projects to use appropriate images");

    // Show updated projects
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    console.log("\nUpdated projects:");
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Image: ${project.image}`);
      console.log(`   Status: ${project.status}`);
      console.log("");
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProjectsToPlaceholders();
