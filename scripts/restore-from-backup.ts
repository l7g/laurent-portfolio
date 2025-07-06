import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function restoreFromBackup() {
  try {
    console.log("Starting restore from backup...");

    // Read the backup file
    const backupPath =
      "C:\\Users\\laure\\Desktop\\Projs\\Portfoliov2\\portfolio\\backups\\db-backup-2025-07-05T23-19-10-616Z.json";
    const backupData = JSON.parse(readFileSync(backupPath, "utf-8"));

    console.log(
      "Backup data loaded, found collections:",
      Object.keys(backupData),
    );

    // Restore in correct order (respecting foreign key constraints)

    // First, restore users (no dependencies)
    if (backupData.users && backupData.users.length > 0) {
      console.log(`Restoring ${backupData.users.length} users...`);
      for (const user of backupData.users) {
        await prisma.users.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        });
      }
    }

    // Restore blog_categories (no dependencies)
    if (backupData.blog_categories && backupData.blog_categories.length > 0) {
      console.log(
        `Restoring ${backupData.blog_categories.length} blog categories...`,
      );
      for (const category of backupData.blog_categories) {
        await prisma.blog_categories.upsert({
          where: { id: category.id },
          update: category,
          create: category,
        });
      }
    }

    // Restore courses (no dependencies)
    if (backupData.courses && backupData.courses.length > 0) {
      console.log(`Restoring ${backupData.courses.length} courses...`);
      for (const course of backupData.courses) {
        await prisma.courses.upsert({
          where: { id: course.id },
          update: course,
          create: course,
        });
      }
    }

    // Restore course_assessments (depends on courses)
    if (
      backupData.course_assessments &&
      backupData.course_assessments.length > 0
    ) {
      console.log(
        `Restoring ${backupData.course_assessments.length} course assessments...`,
      );
      for (const assessment of backupData.course_assessments) {
        await prisma.course_assessments.upsert({
          where: { id: assessment.id },
          update: assessment,
          create: assessment,
        });
      }
    }

    // Restore academic_programs (no dependencies)
    if (
      backupData.academic_programs &&
      backupData.academic_programs.length > 0
    ) {
      console.log(
        `Restoring ${backupData.academic_programs.length} academic programs...`,
      );
      for (const program of backupData.academic_programs) {
        await prisma.academic_programs.upsert({
          where: { id: program.id },
          update: program,
          create: program,
        });
      }
    }

    // Restore skills (no dependencies)
    if (backupData.skills && backupData.skills.length > 0) {
      console.log(`Restoring ${backupData.skills.length} skills...`);
      for (const skill of backupData.skills) {
        await prisma.skills.upsert({
          where: { id: skill.id },
          update: skill,
          create: skill,
        });
      }
    }

    // Restore projects (no dependencies)
    if (backupData.projects && backupData.projects.length > 0) {
      console.log(`Restoring ${backupData.projects.length} projects...`);
      for (const project of backupData.projects) {
        await prisma.projects.upsert({
          where: { id: project.id },
          update: project,
          create: project,
        });
      }
    }

    // Restore blog_posts (depends on blog_categories and courses)
    if (backupData.blog_posts && backupData.blog_posts.length > 0) {
      console.log(`Restoring ${backupData.blog_posts.length} blog posts...`);
      for (const post of backupData.blog_posts) {
        await prisma.blog_posts.upsert({
          where: { id: post.id },
          update: post,
          create: post,
        });
      }
    }

    // Restore skill_progression (depends on skills)
    if (
      backupData.skill_progression &&
      backupData.skill_progression.length > 0
    ) {
      console.log(
        `Restoring ${backupData.skill_progression.length} skill progression records...`,
      );
      for (const progression of backupData.skill_progression) {
        await prisma.skill_progressions.upsert({
          where: { id: progression.id },
          update: progression,
          create: progression,
        });
      }
    }

    // Restore contacts (no dependencies)
    if (backupData.contacts && backupData.contacts.length > 0) {
      console.log(`Restoring ${backupData.contacts.length} contacts...`);
      for (const contact of backupData.contacts) {
        await prisma.contacts.upsert({
          where: { id: contact.id },
          update: contact,
          create: contact,
        });
      }
    }

    // Restore demo_requests (no dependencies)
    if (backupData.demo_requests && backupData.demo_requests.length > 0) {
      console.log(
        `Restoring ${backupData.demo_requests.length} demo requests...`,
      );
      for (const request of backupData.demo_requests) {
        await prisma.demo_requests.upsert({
          where: { id: request.id },
          update: request,
          create: request,
        });
      }
    }

    // Restore site_settings (no dependencies)
    if (backupData.site_settings && backupData.site_settings.length > 0) {
      console.log(
        `Restoring ${backupData.site_settings.length} site settings...`,
      );
      for (const setting of backupData.site_settings) {
        await prisma.site_settings.upsert({
          where: { id: setting.id },
          update: setting,
          create: setting,
        });
      }
    }

    // Restore portfolio_sections (no dependencies)
    if (
      backupData.portfolio_sections &&
      backupData.portfolio_sections.length > 0
    ) {
      console.log(
        `Restoring ${backupData.portfolio_sections.length} portfolio sections...`,
      );
      for (const section of backupData.portfolio_sections) {
        await prisma.portfolio_sections.upsert({
          where: { id: section.id },
          update: section,
          create: section,
        });
      }
    }

    // Restore portfolio_pages (no dependencies)
    if (backupData.portfolio_pages && backupData.portfolio_pages.length > 0) {
      console.log(
        `Restoring ${backupData.portfolio_pages.length} portfolio pages...`,
      );
      for (const page of backupData.portfolio_pages) {
        await prisma.portfolio_pages.upsert({
          where: { id: page.id },
          update: page,
          create: page,
        });
      }
    }

    // Restore blog_comments (depends on blog_posts)
    if (backupData.blog_comments && backupData.blog_comments.length > 0) {
      console.log(
        `Restoring ${backupData.blog_comments.length} blog comments...`,
      );
      for (const comment of backupData.blog_comments) {
        await prisma.blog_comments.upsert({
          where: { id: comment.id },
          update: comment,
          create: comment,
        });
      }
    }

    console.log("✅ Restore completed successfully!");
  } catch (error) {
    console.error("❌ Restore failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreFromBackup();
