import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log("📦 Starting database backup...");

    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        // Core content
        blog_posts: await prisma.blog_posts.findMany({
          include: {
            blog_categories: true,
          },
        }),
        blog_categories: await prisma.blog_categories.findMany(),
        projects: await prisma.projects.findMany(),
        skills: await prisma.skills.findMany(),

        // Academic data
        academic_programs: await prisma.academic_programs.findMany({
          include: {
            courses: true,
          },
        }),
        courses: await prisma.courses.findMany({
          include: {
            course_assessments: true,
          },
        }),
        course_assessments: await prisma.course_assessments.findMany(),

        // Settings and misc
        site_settings: await prisma.site_settings.findMany(),
        demo_requests: await prisma.demo_requests.findMany(),

        // Check if these exist (they might be optional)
        portfolio_sections: [] as any[],
        skill_progressions: [] as any[],
        contacts: [] as any[],
      },
    };

    // Try to get optional tables
    try {
      backup.data.portfolio_sections =
        await prisma.portfolio_sections.findMany();
    } catch (e) {
      console.log("ℹ️  portfolio_sections table not found, skipping...");
    }

    try {
      backup.data.skill_progressions =
        await prisma.skill_progressions.findMany();
    } catch (e) {
      console.log("ℹ️  skill_progressions table not found, skipping...");
    }

    try {
      backup.data.contacts = await prisma.contacts.findMany();
    } catch (e) {
      console.log("ℹ️  contacts table not found, skipping...");
    }

    // Save backup
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const filename = `db-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    const filepath = path.join(backupDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

    console.log("✅ Database backup completed!");
    console.log(`📁 Backup saved to: ${filepath}`);
    console.log(`📊 Backup contains:`);
    console.log(`   - ${backup.data.blog_posts.length} blog posts`);
    console.log(`   - ${backup.data.blog_categories.length} blog categories`);
    console.log(`   - ${backup.data.projects.length} projects`);
    console.log(`   - ${backup.data.skills.length} skills`);
    console.log(
      `   - ${backup.data.academic_programs.length} academic programs`,
    );
    console.log(`   - ${backup.data.courses.length} courses`);
    console.log(
      `   - ${backup.data.course_assessments.length} course assessments`,
    );
    console.log(`   - ${backup.data.site_settings.length} site settings`);
    console.log(`   - ${backup.data.demo_requests.length} demo requests`);

    return filepath;
  } catch (error) {
    console.error("❌ Backup failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run backup if called directly
backupDatabase().catch(console.error);

export { backupDatabase };
