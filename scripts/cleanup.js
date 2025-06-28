const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up portfolio data...");

  try {
    // 1. Remove duplicate sections
    console.log("📂 Checking for duplicate portfolio sections...");

    const allSections = await prisma.portfolioSection.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(`Found ${allSections.length} total sections`);

    // Group by name
    const sectionGroups = {};
    allSections.forEach((section) => {
      if (!sectionGroups[section.name]) {
        sectionGroups[section.name] = [];
      }
      sectionGroups[section.name].push(section);
    });

    // Remove duplicates
    let deletedCount = 0;
    for (const [sectionName, sections] of Object.entries(sectionGroups)) {
      if (sections.length > 1) {
        console.log(
          `  - Found ${sections.length} duplicates of "${sectionName}"`,
        );

        // Keep the first one, delete the rest
        const sectionsToDelete = sections.slice(1);
        for (const section of sectionsToDelete) {
          await prisma.portfolioSection.delete({
            where: { id: section.id },
          });
          console.log(`  ✓ Deleted duplicate: ${section.displayName}`);
          deletedCount++;
        }
      }
    }

    console.log(`Deleted ${deletedCount} duplicate sections`);

    // 2. Update existing projects to add flagship status
    console.log("🚀 Updating projects with flagship status...");

    const projects = await prisma.project.findMany();
    console.log(`Found ${projects.length} existing projects`);

    // Update featured projects to be flagship
    const updatedProjects = await prisma.project.updateMany({
      where: { featured: true },
      data: {
        flagship: true,
        detailedDescription:
          "This is a flagship project showcasing advanced technical skills and comprehensive implementation.",
        challenges:
          "Complex technical requirements and scalability considerations.",
        solutions: "Modern development practices and optimized architecture.",
        results:
          "Successful deployment with improved performance and user experience.",
        clientName: "Portfolio Client",
        projectDuration: "3-4 months",
        teamSize: "Solo developer",
        myRole: "Full-stack developer and project architect",
      },
    });

    console.log(`Updated ${updatedProjects.count} projects to flagship status`);

    // 3. Verify cleanup
    const finalSections = await prisma.portfolioSection.findMany({
      select: { name: true, displayName: true },
    });

    const finalProjects = await prisma.project.findMany({
      select: { title: true, featured: true, flagship: true },
    });

    console.log("✅ Portfolio cleanup completed!");
    console.log(`📊 Final Results:`);
    console.log(`  - Portfolio sections: ${finalSections.length}`);
    finalSections.forEach((section) => {
      console.log(`    * ${section.displayName} (${section.name})`);
    });

    console.log(`  - Projects: ${finalProjects.length}`);
    finalProjects.forEach((project) => {
      const badges = [];
      if (project.featured) badges.push("Featured");
      if (project.flagship) badges.push("Flagship");
      console.log(
        `    * ${project.title} ${badges.length ? `[${badges.join(", ")}]` : ""}`,
      );
    });
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
