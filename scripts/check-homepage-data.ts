import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkHomepageData() {
  try {
    console.log("=== CHECKING HOMEPAGE DATA ===");

    // Check blog posts
    const blogPosts = await prisma.blog_posts.findMany({
      include: {
        blog_categories: true,
        users: true,
      },
      take: 5,
    });
    console.log(`\n📝 Blog Posts: ${blogPosts.length} found`);
    blogPosts.forEach((post) => {
      console.log(`- ${post.title} (${post.status})`);
    });

    // Check academic program
    const academicProgram = await prisma.academic_programs.findFirst({
      include: {
        courses: true,
      },
    });
    console.log(
      `\n🎓 Academic Program: ${academicProgram ? "Found" : "Not found"}`,
    );
    if (academicProgram) {
      console.log(`- ${academicProgram.name}`);
      console.log(`- Courses: ${academicProgram.courses.length}`);
    }

    // Check portfolio sections
    const sections = await prisma.portfolio_sections.findMany({
      where: {
        OR: [
          { name: "blog" },
          { name: "education-skills" },
          { name: "education" },
        ],
      },
    });
    console.log(`\n📄 Portfolio Sections: ${sections.length} found`);
    sections.forEach((section) => {
      console.log(
        `- ${section.name}: ${section.isActive ? "Active" : "Inactive"}`,
      );
    });

    // Check skills
    const skills = await prisma.skills.findMany({
      where: { isActive: true },
      take: 5,
    });
    console.log(`\n💪 Skills: ${skills.length} active`);
  } catch (error) {
    console.error("Error checking homepage data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHomepageData();
