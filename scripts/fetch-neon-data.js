const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fetchAllData() {
  try {
    console.log("🔍 Fetching all data from Neon database...");

    // Fetch all data
    const [users, portfolioSections, projects, skills, siteSettings] =
      await Promise.all([
        prisma.user.findMany(),
        prisma.portfolioSection.findMany(),
        prisma.project.findMany(),
        prisma.skill.findMany(),
        prisma.siteSetting.findMany(),
      ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      users: users.map((user) => ({
        email: user.email,
        name: user.name,
        role: user.role,
        // Don't include password hash for security
      })),
      portfolioSections,
      projects,
      skills,
      siteSettings,
    };

    // Save to backup file
    const fs = require("fs");
    const backupFilePath = "./neon-backup.json";

    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

    console.log("✅ Data exported successfully!");
    console.log(`📊 Exported:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${portfolioSections.length} portfolio sections`);
    console.log(`   - ${projects.length} projects`);
    console.log(`   - ${skills.length} skills`);
    console.log(`   - ${siteSettings.length} site settings`);
    console.log(`💾 Saved to: ${backupFilePath}`);

    return backupData;
  } catch (error) {
    console.error("❌ Failed to fetch data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fetchAllData();
