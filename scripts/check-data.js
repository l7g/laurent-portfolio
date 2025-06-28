const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkData() {
  try {
    const projects = await prisma.project.findMany();
    const skills = await prisma.skill.findMany();
    const settings = await prisma.siteSetting.findMany();

    console.log(`\n📊 Database Status:`);
    console.log(`Projects: ${projects.length}`);
    console.log(`Skills: ${skills.length}`);
    console.log(`Site Settings: ${settings.length}`);

    if (projects.length > 0) {
      console.log(`\n📂 Projects:`);
      projects.forEach((p) => console.log(`- ${p.title} (${p.status})`));
    }

    if (skills.length > 0) {
      console.log(`\n🔧 Skills:`);
      skills.forEach((s) => console.log(`- ${s.name} (${s.category})`));
    }
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
