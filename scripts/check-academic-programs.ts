import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkacademic_programss() {
  try {
    const programs = await prisma.academic_programs.findMany();
    console.log("Academic Programs in database:");
    console.log(JSON.stringify(programs, null, 2));

    if (programs.length > 1) {
      console.log("\nFound multiple programs. Removing duplicates...");

      // Keep the first one, delete the rest
      const toDelete = programs.slice(1);
      for (const program of toDelete) {
        await prisma.academic_programs.delete({
          where: { id: program.id },
        });
        console.log(`Deleted duplicate program with ID: ${program.id}`);
      }

      console.log("Duplicates removed successfully!");
    }
  } catch (error) {
    console.error("Error checking academic programs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkacademic_programss();
