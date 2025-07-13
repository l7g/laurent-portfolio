/**
 * Demo Projects Setup Script
 *
 * This script helps configure which projects should be displayed as demos.
 * The demo system shows one project per category (FULLSTACK, FRONTEND, BACKEND).
 *
 * Usage:
 * - node scripts/setup-demos.cjs          (shows current setup and options)
 * - node scripts/setup-demos.cjs auto     (automatically assigns first 3 projects)
 *
 * Demo System:
 * - Only 3 projects should be marked as demos (one per category)
 * - Each demo represents a different aspect of development skills
 * - Demos are displayed on the homepage in the "Live Demos" section
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function setupDemoProjects() {
  try {
    console.log("🎯 Setting up demo project selection...");

    // Get all your projects
    const projects = await prisma.projects.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    });

    if (projects.length === 0) {
      console.log(
        "❌ No projects found. Please restore your production data first.",
      );
      return;
    }

    console.log(`\n📦 Found ${projects.length} projects:`);
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
    });

    console.log(`\n🎯 Demo System Setup:`);
    console.log(`You need to select ONE project for each demo category:`);
    console.log(`- FULLSTACK: A full-stack application`);
    console.log(`- FRONTEND: A frontend-focused project`);
    console.log(`- BACKEND: A backend/API project`);

    console.log(`\n💡 Use the admin panel or Prisma Studio to:`);
    console.log(`1. Mark 3 projects as demos (demo: true)`);
    console.log(`2. Set their demoType (FULLSTACK, FRONTEND, or BACKEND)`);
    console.log(`3. Each category should have exactly ONE demo project`);

    console.log(`\n🚀 Or run this quick setup for your 3 projects:`);
    console.log(`- "${projects[0]?.title}" as FULLSTACK demo`);
    console.log(`- "${projects[1]?.title}" as FRONTEND demo (if exists)`);
    console.log(`- "${projects[2]?.title}" as BACKEND demo (if exists)`);

    // Quick setup option
    if (projects.length >= 3) {
      console.log(
        `\n❓ Would you like me to set this up automatically? (You can change it later)`,
      );
      console.log(
        `Type 'y' and run the script with argument 'auto' to proceed`,
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Auto setup if requested
async function autoSetupDemos() {
  try {
    console.log("🔄 Setting up demo projects automatically...");

    const projects = await prisma.projects.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    });

    if (projects.length < 3) {
      console.log("❌ Need at least 3 projects for demo setup");
      return;
    }

    // Clear existing demos
    await prisma.projects.updateMany({
      data: { demo: false, demoType: null },
    });

    // Set up 3 demos
    const demoTypes = ["FULLSTACK", "FRONTEND", "BACKEND"];

    for (let i = 0; i < 3; i++) {
      await prisma.projects.update({
        where: { id: projects[i].id },
        data: {
          demo: true,
          demoType: demoTypes[i],
        },
      });
      console.log(`✅ Set "${projects[i].title}" as ${demoTypes[i]} demo`);
    }

    console.log("🎉 Demo projects setup complete!");
    console.log("💡 You can change these selections in the admin panel");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check command line argument
if (process.argv[2] === "auto") {
  autoSetupDemos();
} else {
  setupDemoProjects();
}
