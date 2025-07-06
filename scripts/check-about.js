import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAboutSection() {
  try {
    console.log("🔍 Checking database connection...");
    console.log(
      "Connected to database:",
      process.env.DATABASE_URL?.slice(0, 50) + "...",
    );

    const aboutSection = await prisma.portfolio_sections.findFirst({
      where: { name: "about" },
    });

    console.log("\n📋 About section data:");
    console.log("Title:", aboutSection?.title);
    console.log("Subtitle:", aboutSection?.subtitle);

    // Check if we have our skills data
    const skillsCount = await prisma.skills.count();
    console.log("\n📊 Database inventory:");
    console.log("Total skills in database:", skillsCount);

    // Check if we have our projects
    const projectsCount = await prisma.projects.count();
    console.log("Total projects in database:", projectsCount);

    // Check if we have our blog posts
    const postsCount = await prisma.blog_posts.count();
    console.log("Total blog posts in database:", postsCount);

    // Check if we have our academic data
    const academicCount = await prisma.academic_programs.count();
    console.log("Total academic programs in database:", academicCount);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAboutSection();
