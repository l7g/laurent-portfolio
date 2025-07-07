const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

async function backupData() {
  try {
    console.log("Creating database backup...");

    const data = {
      timestamp: new Date().toISOString(),
      blog_categories: await prisma.blog_categories.findMany(),
      blog_comments: await prisma.blog_comments.findMany(),
      blog_posts: await prisma.blog_posts.findMany(),
      contacts: await prisma.contacts.findMany(),
      users: await prisma.users.findMany(),
      projects: await prisma.projects.findMany(),
      skills: await prisma.skills.findMany(),
      portfolio_sections: await prisma.portfolio_sections.findMany(),
      courses: await prisma.courses.findMany(),
      course_assessments: await prisma.course_assessments.findMany(),
      demo_requests: await prisma.demo_requests.findMany(),
      skill_progressions: await prisma.skill_progressions.findMany(),
      site_settings: await prisma.site_settings.findMany(),
      portfolio_pages: await prisma.portfolio_pages.findMany(),
      academic_programs: await prisma.academic_programs.findMany(),
      blog_series: await prisma.blog_series.findMany(),
    };

    // Ensure backups directory exists
    const backupsDir = path.join(__dirname, "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const filename = path.join(
      backupsDir,
      `db-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    );
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    console.log(`✅ Backup created: ${filename}`);
    console.log(
      `📊 Total records backed up: ${Object.values(data).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)}`,
    );

    // Show summary by table
    console.log("\n📋 Backup Summary:");
    Object.entries(data).forEach(([table, records]) => {
      if (Array.isArray(records) && records.length > 0) {
        console.log(`   ${table}: ${records.length} records`);
      }
    });
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupData();
