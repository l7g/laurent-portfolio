import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateacademic_programs() {
  try {
    // Update the academic program to 3 years with proper graduation date
    const program = await prisma.academic_programs.updateMany({
      data: {
        totalYears: 3,
        expectedEnd: new Date(2028, 5, 30), // June 30th, 2028 (end of last semester)
      },
    });

    console.log("Academic program updated successfully!");
    console.log(`Updated ${program.count} programs`);
    console.log(
      "Expected graduation updated to June 30th, 2028 (end of last semester)",
    );
  } catch (error) {
    console.error("Error updating academic program:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateacademic_programs();
