const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Retry function for database operations
async function retryOperation(operation, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`⚠️  Attempt ${i + 1} failed: ${error.message}`);

      if (i === maxRetries - 1) {
        throw error;
      }

      if (error.message.includes("Can't reach database server")) {
        console.log(`🔄 Waiting ${delay}ms for database to wake up...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error; // Don't retry for other types of errors
      }
    }
  }
}

async function createProductionBackup() {
  try {
    console.log("🚀 Creating production-ready backup...");

    const backupData = await retryOperation(async () => {
      console.log("📊 Fetching data from database...");

      const [users, portfolio_sectionss, projects, skills, site_settingss] =
        await Promise.all([
          prisma.users.findMany({
            select: {
              email: true,
              name: true,
              role: true,
              // Exclude password for security
            },
          }),
          prisma.portfolio_sections.findMany(),
          prisma.projects.findMany(),
          prisma.skills.findMany(),
          prisma.site_settings.findMany(),
        ]);

      return {
        metadata: {
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          description:
            "Production portfolio backup - all content editable via admin",
        },
        data: {
          users,
          portfolio_sectionss,
          projects,
          skills,
          site_settingss,
        },
        stats: {
          users: users.length,
          portfolio_sectionss: portfolio_sectionss.length,
          projects: projects.length,
          skills: skills.length,
          site_settingss: site_settingss.length,
        },
      };
    });

    // Save backup file
    const backupPath = path.join(__dirname, "production-backup.json");
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    console.log("✅ Production backup created successfully!");
    console.log(`📁 Saved to: ${backupPath}`);
    console.log(`📊 Backup contains:`);
    console.log(`   - ${backupData.stats.users} users`);
    console.log(
      `   - ${backupData.stats.portfolio_sectionss} portfolio sections`,
    );
    console.log(`   - ${backupData.stats.projects} projects`);
    console.log(`   - ${backupData.stats.skills} skills`);
    console.log(`   - ${backupData.stats.site_settingss} site settings`);
    console.log(`\n🎯 All text content is now editable via admin dashboard!`);

    return backupData;
  } catch (error) {
    console.error("❌ Failed to create production backup:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly
if (require.main === module) {
  createProductionBackup()
    .then(() => {
      console.log("\n🎉 Production backup completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Production backup failed:", error.message);
      process.exit(1);
    });
}

module.exports = { createProductionBackup };
