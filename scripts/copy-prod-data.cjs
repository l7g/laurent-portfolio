/**
 * Simple Production Data Copy Script
 *
 * This is a simplified script to copy basic project data from production.
 * For complete migration, use complete-migration.cjs instead.
 *
 * Usage: node scripts/copy-prod-data.cjs
 */

const { PrismaClient } = require("@prisma/client");

// Production database connection (uses older schema without demo fields)
const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PROD_DATABASE_URL,
    },
  },
});

// Local development database connection
const devPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function copyProductionData() {
  try {
    console.log("🔄 Connecting to production database...");

    // Fetch all projects from production (only core fields)
    const prodProjects = await prodPrisma.$queryRaw`
      SELECT 
        id, title, slug, description, technologies, 
        featured, flagship, "isActive", 
        "liveUrl", "githubUrl", highlights, 
        "createdAt", "updatedAt"
      FROM projects 
      ORDER BY "createdAt" DESC
    `;

    console.log(`📦 Found ${prodProjects.length} projects in production`);

    if (prodProjects.length === 0) {
      console.log("⚠️  No projects found in production database");
      return;
    }

    console.log("🧹 Clearing local development database...");
    await devPrisma.projects.deleteMany();

    console.log("📝 Copying projects to local database...");

    for (const prodProject of prodProjects) {
      // Map production project to local schema with new fields
      const localProject = {
        id: prodProject.id,
        title: prodProject.title,
        slug: prodProject.slug,
        description: prodProject.description,
        shortDesc: prodProject.shortDesc,
        image: prodProject.image,
        technologies: prodProject.technologies || [],
        featured: prodProject.featured || false,
        flagship: prodProject.flagship || false,
        demo: false, // Default to false, we'll set manually later
        demoType: inferDemoType(
          prodProject.technologies || [],
          prodProject.title,
          prodProject.description,
        ),
        isActive: prodProject.isActive !== false, // Default to true if not specified
        status: prodProject.status || "WIP",
        category: inferCategory(prodProject),
        sortOrder: prodProject.sortOrder || 0,
        liveUrl: prodProject.liveUrl,
        githubUrl: prodProject.githubUrl,
        caseStudyUrl: prodProject.caseStudyUrl,
        highlights: prodProject.highlights || [],
        detailedDescription: prodProject.detailedDescription,
        challenges: prodProject.challenges,
        solutions: prodProject.solutions,
        results: prodProject.results,
        outcomes: prodProject.outcomes || [],
        clientName: prodProject.clientName,
        projectDuration: prodProject.projectDuration,
        teamSize: prodProject.teamSize,
        myRole: prodProject.myRole,
        role: prodProject.role,
        year: prodProject.year,
        startDate: prodProject.startDate,
        endDate: prodProject.endDate,
        createdAt: prodProject.createdAt,
        updatedAt: new Date(),
        showWipWarning: prodProject.showWipWarning !== false,
        wipWarningText: prodProject.wipWarningText,
        wipWarningEmoji: prodProject.wipWarningEmoji || "🚧",
      };

      try {
        await devPrisma.projects.create({
          data: localProject,
        });
        console.log(`✅ Copied: ${prodProject.title}`);
      } catch (error) {
        console.error(`❌ Failed to copy ${prodProject.title}:`, error.message);
      }
    }

    // Now let's mark a few projects as demos for testing
    console.log("🎯 Setting up demo projects...");

    const allLocalProjects = await devPrisma.projects.findMany({
      orderBy: { featured: "desc" },
    });

    // Mark the first 3-6 projects as demos with different types
    const demoUpdates = allLocalProjects.slice(0, 6).map((project, index) => {
      const demoTypes = ["FULLSTACK", "FRONTEND", "BACKEND"];
      const demoType = demoTypes[index % 3];

      return devPrisma.projects.update({
        where: { id: project.id },
        data: {
          demo: true,
          demoType: demoType,
          isActive: true,
        },
      });
    });

    await Promise.all(demoUpdates);
    console.log(`🎉 Set ${demoUpdates.length} projects as demos`);

    console.log("✅ Production data successfully copied to local database!");
  } catch (error) {
    console.error("❌ Error copying production data:", error);
  } finally {
    await prodPrisma.$disconnect();
    await devPrisma.$disconnect();
  }
}

function inferDemoType(technologies, title, description) {
  const tech = technologies.map((t) => t.toLowerCase());
  const content = (title + " " + description).toLowerCase();

  // Check for backend-only indicators
  if (
    tech.some((t) =>
      [
        "node.js",
        "express",
        "fastify",
        "nestjs",
        "python",
        "django",
        "flask",
        "go",
        "rust",
        "java",
        "spring",
      ].includes(t),
    ) &&
    !tech.some((t) =>
      ["react", "vue", "angular", "next.js", "nuxt", "svelte"].includes(t),
    )
  ) {
    return "BACKEND";
  }

  // Check for fullstack indicators
  if (
    tech.some((t) =>
      [
        "node.js",
        "express",
        "nestjs",
        "python",
        "django",
        "php",
        "laravel",
      ].includes(t),
    ) &&
    tech.some((t) =>
      ["react", "vue", "angular", "next.js", "nuxt", "svelte"].includes(t),
    )
  ) {
    return "FULLSTACK";
  }

  // Check for frontend-only
  if (
    tech.some((t) =>
      [
        "react",
        "vue",
        "angular",
        "next.js",
        "nuxt",
        "svelte",
        "html",
        "css",
        "javascript",
      ].includes(t),
    )
  ) {
    return "FRONTEND";
  }

  // Default to fullstack for complete applications
  return "FULLSTACK";
}

function inferCategory(project) {
  const title = project.title?.toLowerCase() || "";
  const desc = project.description?.toLowerCase() || "";

  // Check for commercial indicators
  if (
    title.includes("commercial") ||
    desc.includes("client") ||
    desc.includes("business")
  ) {
    return "COMMERCIAL";
  }

  // Check for open source indicators
  if (
    project.githubUrl &&
    (desc.includes("open source") || desc.includes("opensource"))
  ) {
    return "OPENSOURCE";
  }

  // Default to OPENSOURCE for most projects
  return "OPENSOURCE";
}

// Run the script
copyProductionData();
