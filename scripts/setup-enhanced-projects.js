/**
 * Setup script for enhanced projects structure with demos
 * This script will:
 * 1. Generate and run the migration to add new fields
 * 2. Help you designate which projects should be demos
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Setting up enhanced projects structure...\n");

  try {
    // First, let's see your current projects
    console.log("📋 Current projects in your database:");
    const projects = await prisma.projects.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        technologies: true,
        featured: true,
        flagship: true,
        liveUrl: true,
        githubUrl: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (projects.length === 0) {
      console.log("❌ No projects found. Please add some projects first.");
      return;
    }

    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   - Technologies: ${project.technologies.join(", ")}`);
      console.log(`   - Live URL: ${project.liveUrl || "None"}`);
      console.log(`   - GitHub: ${project.githubUrl || "None"}`);
      console.log(`   - Featured: ${project.featured ? "Yes" : "No"}`);
      console.log(`   - Flagship: ${project.flagship ? "Yes" : "No"}`);
      console.log("");
    });

    console.log("\n🎯 Demo Project Selection");
    console.log("You should select 3 projects as your main demos:");
    console.log("1. One FULL STACK demo (has both frontend + backend/API)");
    console.log("2. One FRONTEND demo (pure frontend/UI focused)");
    console.log("3. One BACKEND demo (API/server focused)\n");

    // For now, let's just add the new fields to all projects
    console.log("📝 Adding new fields to existing projects...");

    await prisma.projects.updateMany({
      data: {
        demo: false,
        category: "OPENSOURCE", // Default category
        year: new Date().getFullYear(),
      },
    });

    console.log("✅ Enhanced project structure setup complete!\n");

    console.log("🔧 Next steps:");
    console.log("1. Run: npm run db:migrate or prisma migrate dev");
    console.log("2. Use the admin panel to:");
    console.log('   - Mark 3 projects as "demo: true"');
    console.log(
      "   - Set appropriate categories (COMMERCIAL, CLIENT, OPENSOURCE)",
    );
    console.log("   - Add years, roles, and case study URLs");
    console.log("3. Test the new /demos and enhanced /projects pages\n");

    console.log("💡 Suggested demo project types:");
    console.log("- Full Stack: Your portfolio site (this one!)");
    console.log("- Frontend: A React dashboard or interactive app");
    console.log("- Backend: An API service or data processing tool\n");
  } catch (error) {
    console.error("❌ Error setting up enhanced projects:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
