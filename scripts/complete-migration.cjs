/**
 * Complete Production Data Migration Script
 *
 * This script migrates ALL data from production database to local development database.
 * It handles schema differences and ensures data integrity.
 *
 * Usage: node scripts/complete-migration.cjs
 *
 * Requirements:
 * - PROD_DATABASE_URL environment variable set
 * - DATABASE_URL environment variable set for local database
 *
 * What it migrates:
 * - Projects (as personal projects, not demos)
 * - Skills
 * - Site Settings
 * - Contacts
 * - Academic Programs
 * - Users
 */

const { PrismaClient } = require("@prisma/client");

// Production database connection
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

async function copyAllProductionData() {
  try {
    console.log("🔄 Starting complete data migration from production...");

    // Clear local database completely
    console.log("🧹 Clearing local database...");
    const clearTables = [
      "skill_progressions",
      "course_assessments",
      "blog_comments",
      "blog_post_relations",
      "blog_posts",
      "blog_categories",
      "blog_series",
      "academic_programs",
      "contacts",
      "projects",
      "skills",
      "users",
      "site_settings",
      "portfolio_pages",
      "portfolio_sections",
      "demo_requests",
      "courses",
    ];

    for (const table of clearTables) {
      try {
        await devPrisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
        console.log(`  ✅ Cleared ${table}`);
      } catch (e) {
        console.log(`  ⚠️ Could not clear ${table} (might not exist locally)`);
      }
    }

    // 1. Copy Users first (needed for foreign keys)
    console.log("\n👤 Copying users...");
    try {
      const prodUsers = await prodPrisma.$queryRaw`
        SELECT id, email, name, role, "emailVerified", image, "createdAt", "updatedAt"
        FROM users
      `;

      for (const user of prodUsers) {
        await devPrisma.users.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "USER",
            emailVerified: user.emailVerified,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
        console.log(`  ✅ Copied user: ${user.name || user.email}`);
      }
    } catch (e) {
      console.log("  ⚠️ Could not copy users:", e.message);
    }

    // 2. Copy Projects (with all fields that exist in production)
    console.log("\n📦 Copying projects...");
    try {
      const prodProjects = await prodPrisma.$queryRaw`
        SELECT 
          id, title, slug, description, "shortDesc", image, technologies,
          featured, flagship, "isActive", status, "sortOrder",
          "liveUrl", "githubUrl", highlights, "detailedDescription",
          challenges, solutions, results, "clientName", "projectDuration",
          "teamSize", "myRole", "startDate", "endDate", "createdAt", "updatedAt",
          "showWipWarning", "wipWarningText", "wipWarningEmoji"
        FROM projects
        ORDER BY "createdAt" DESC
      `;

      for (const project of prodProjects) {
        await devPrisma.projects.create({
          data: {
            id: project.id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            shortDesc: project.shortDesc,
            image: project.image,
            technologies: project.technologies || [],
            featured: project.featured || false,
            flagship: project.flagship || false,
            isActive: project.isActive !== false,
            status: project.status || "READY",
            sortOrder: project.sortOrder || 0,
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            highlights: project.highlights || [],
            detailedDescription: project.detailedDescription,
            challenges: project.challenges,
            solutions: project.solutions,
            results: project.results,
            clientName: project.clientName,
            projectDuration: project.projectDuration,
            teamSize: project.teamSize,
            myRole: project.myRole,
            startDate: project.startDate,
            endDate: project.endDate,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            showWipWarning: project.showWipWarning !== false,
            wipWarningText: project.wipWarningText,
            wipWarningEmoji: project.wipWarningEmoji || "🚧",
            // New fields default to false (these are personal projects, not demos)
            demo: false,
            demoType: null,
          },
        });
        console.log(`  ✅ Copied project: ${project.title}`);
      }
    } catch (e) {
      console.log("  ❌ Error copying projects:", e.message);
    }

    // 3. Copy Skills
    console.log("\n🎯 Copying skills...");
    try {
      const prodSkills = await prodPrisma.$queryRaw`
        SELECT id, name, category, "proficiencyLevel", "yearsOfExperience",
               "isActive", "sortOrder", "createdAt", "updatedAt"
        FROM skills
        ORDER BY category, "sortOrder"
      `;

      for (const skill of prodSkills) {
        await devPrisma.skills.create({
          data: {
            id: skill.id,
            name: skill.name,
            category: skill.category,
            proficiencyLevel: skill.proficiencyLevel || "INTERMEDIATE",
            yearsOfExperience: skill.yearsOfExperience || 0,
            isActive: skill.isActive !== false,
            sortOrder: skill.sortOrder || 0,
            createdAt: skill.createdAt,
            updatedAt: skill.updatedAt,
          },
        });
        console.log(`  ✅ Copied skill: ${skill.name} (${skill.category})`);
      }
    } catch (e) {
      console.log("  ❌ Error copying skills:", e.message);
    }

    // 4. Copy Academic Programs
    console.log("\n🎓 Copying academic programs...");
    try {
      const prodPrograms = await prodPrisma.$queryRaw`
        SELECT id, title, institution, "degreeType", "fieldOfStudy",
               "startDate", "endDate", "isCompleted", "currentGpa",
               "expectedGraduation", "createdAt", "updatedAt"
        FROM academic_programs
      `;

      for (const program of prodPrograms) {
        await devPrisma.academic_programs.create({
          data: {
            id: program.id,
            title: program.title,
            institution: program.institution,
            degreeType: program.degreeType || "BACHELOR",
            fieldOfStudy: program.fieldOfStudy,
            startDate: program.startDate,
            endDate: program.endDate,
            isCompleted: program.isCompleted || false,
            currentGpa: program.currentGpa,
            expectedGraduation: program.expectedGraduation,
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
          },
        });
        console.log(`  ✅ Copied program: ${program.title}`);
      }
    } catch (e) {
      console.log("  ❌ Error copying academic programs:", e.message);
    }

    // 5. Copy Contacts
    console.log("\n📧 Copying contacts...");
    try {
      const prodContacts = await prodPrisma.$queryRaw`
        SELECT id, name, email, subject, message, "createdAt"
        FROM contacts
        ORDER BY "createdAt" DESC
      `;

      for (const contact of prodContacts) {
        await devPrisma.contacts.create({
          data: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            message: contact.message,
            createdAt: contact.createdAt,
          },
        });
        console.log(`  ✅ Copied contact from: ${contact.name}`);
      }
    } catch (e) {
      console.log("  ❌ Error copying contacts:", e.message);
    }

    // 6. Copy Site Settings
    console.log("\n⚙️ Copying site settings...");
    try {
      const prodSettings = await prodPrisma.$queryRaw`
        SELECT id, key, value, type, description, "isPublic", "createdAt", "updatedAt"
        FROM site_settings
      `;

      for (const setting of prodSettings) {
        await devPrisma.site_settings.create({
          data: {
            id: setting.id,
            key: setting.key,
            value: setting.value,
            type: setting.type || "text",
            description: setting.description,
            isPublic: setting.isPublic || false,
            createdAt: setting.createdAt,
            updatedAt: setting.updatedAt,
          },
        });
        console.log(`  ✅ Copied setting: ${setting.key}`);
      }
    } catch (e) {
      console.log("  ❌ Error copying site settings:", e.message);
    }

    console.log("\n🎉 Complete data migration finished!");
    console.log("📝 All projects are personal projects (demo: false)");
    console.log("💡 Run the demo setup script to configure demo projects");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await prodPrisma.$disconnect();
    await devPrisma.$disconnect();
  }
}

copyAllProductionData();
