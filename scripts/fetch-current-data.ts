import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchCurrentData() {
  try {
    console.log("=== FETCHING CURRENT DATABASE DATA ===");

    // Get academic programs
    const programs = await prisma.academic_programs.findMany();
    console.log("\n=== ACADEMIC PROGRAMS ===");
    console.log(JSON.stringify(programs, null, 2));

    // Get courses
    const courses = await prisma.courses.findMany();
    console.log("\n=== COURSES ===");
    console.log(`Found ${courses.length} courses`);
    courses.forEach((course) => {
      console.log(
        `- ${course.code}: ${course.title} (Year ${course.year}, ${course.semester})`,
      );
    });

    // Get skills
    const skills = await prisma.skills.findMany();
    console.log("\n=== SKILLS ===");
    console.log(`Found ${skills.length} skills`);
    skills.forEach((skill) => {
      console.log(`- ${skill.name} (${skill.category}, Level ${skill.level})`);
    });

    // Get skill progressions
    const progressions = await prisma.skill_progressions.findMany({
      include: {
        skills: true,
        academic_programs: true,
      },
    });
    console.log("\n=== SKILL PROGRESSIONS ===");
    console.log(`Found ${progressions.length} skill progressions`);
    progressions.forEach((prog) => {
      console.log(
        `- ${prog.skills.name}: ${prog.currentLevel}/${prog.targetLevel} (Academic: ${prog.isAcademicSkill})`,
      );
    });

    // Get site settings
    const settings = await prisma.site_settings.findMany({
      orderBy: { key: "asc" },
    });
    console.log("\n=== SITE SETTINGS ===");
    console.log(`Found ${settings.length} settings`);
    settings.forEach((setting) => {
      console.log(`- ${setting.key}: ${setting.type}`);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchCurrentData();
