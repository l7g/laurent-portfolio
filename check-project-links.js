const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkProjectLinks() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    console.log("🔗 Project Links Analysis:");
    console.log("");

    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   🌐 Live URL: ${project.liveUrl || "Not set"}`);
      console.log(`   📁 GitHub URL: ${project.githubUrl || "Not set"}`);
      console.log(`   📊 Status: ${project.status}`);

      // Check what buttons should show
      const hasValidLive = project.liveUrl && project.liveUrl !== "#";
      const hasValidGithub = project.githubUrl && project.githubUrl !== "#";

      console.log(`   🔘 Buttons to show:`);
      if (project.status === "WIP") {
        if (hasValidLive) {
          console.log(`      - "View Live Demo" button`);
        }
        console.log(`      - "Explore My Work" (always)`);
        if (hasValidGithub) {
          console.log(`      - "Code" button`);
        }
      } else {
        if (hasValidLive) {
          console.log(`      - "Live Demo" button`);
        }
        if (hasValidGithub) {
          console.log(`      - "Code" button`);
        }
        if (!hasValidLive && !hasValidGithub) {
          console.log(`      - "🔗 Links coming soon" message`);
        }
      }
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjectLinks();
