import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanUpacademic_programs() {
  try {
    // Remove the mode field completely or set it to null
    const program = await prisma.academic_programs.updateMany({
      data: {
        mode: null, // This will hide the mode field from display
      },
    });

    console.log("Academic program mode cleaned up successfully!");
    console.log(`Updated ${program.count} programs`);

    // Let's also check what we have now
    const programs = await prisma.academic_programs.findMany();
    console.log("Current academic programs:");
    programs.forEach((p) => {
      console.log(`- ${p.degree} at ${p.institution}`);
      console.log(`  Mode: ${p.mode || "Not specified"}`);
      console.log(`  Status: ${p.status}`);
    });
  } catch (error) {
    console.error("Error cleaning up academic program:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanUpacademic_programs();
