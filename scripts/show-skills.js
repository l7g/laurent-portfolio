const { PrismaClient } = require("@prisma/client");

async function showSkills() {
  const prisma = new PrismaClient();
  try {
    const skills = await prisma.skill.findMany();
    console.log("Current skills:");
    skills.forEach((s) => console.log(`- ${s.name} (${s.category})`));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

showSkills();
