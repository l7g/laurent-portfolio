const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanupDuplicates() {
  try {
    console.log("Checking for duplicate academic programs...");

    const programs = await prisma.academic_programs.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(
      "Found programs:",
      programs.map((p) => ({ id: p.id, name: p.name, degree: p.degree })),
    );

    // Keep the first one, remove duplicates
    const seen = new Map();
    const toDelete = [];

    for (const program of programs) {
      const key = `${program.name}|${program.degree}`;
      if (seen.has(key)) {
        toDelete.push(program.id);
      } else {
        seen.set(key, program.id);
      }
    }

    if (toDelete.length > 0) {
      console.log("Deleting duplicate program IDs:", toDelete);
      await prisma.academic_programs.deleteMany({
        where: { id: { in: toDelete } },
      });
      console.log("✅ Duplicates removed");
    } else {
      console.log("No duplicates found");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
