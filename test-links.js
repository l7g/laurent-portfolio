const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkProjectLinks() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    console.log("🔗 Current Project Status:");
    console.log("");

    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   🌐 Live URL: ${project.liveUrl || "Not set"}`);
      console.log(`   📁 GitHub URL: ${project.githubUrl || "Not set"}`);
      console.log(`   📊 Status: ${project.status}`);
      console.log(`   ⭐ Featured: ${project.featured}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjectLinks();
