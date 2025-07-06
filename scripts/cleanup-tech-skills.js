import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDuplicateTechSkills() {
  console.log("🧹 Cleaning up duplicate technical skills...");

  try {
    // Get all skills and group by name to find duplicates
    const allSkills = await prisma.skills.findMany({
      orderBy: [{ name: "asc" }],
    });

    const skillGroups = {};
    allSkills.forEach((skill) => {
      if (!skillGroups[skill.name]) {
        skillGroups[skill.name] = [];
      }
      skillGroups[skill.name].push(skill);
    });

    let duplicatesRemoved = 0;

    // For each skill name, keep only the first one and delete the rest
    for (const [skillName, skills] of Object.entries(skillGroups)) {
      if (skills.length > 1) {
        console.log(`Found ${skills.length} duplicates for "${skillName}"`);

        // Keep the first one, delete the rest
        const toKeep = skills[0];
        const toDelete = skills.slice(1);

        for (const skill of toDelete) {
          await prisma.skills.delete({
            where: { id: skill.id },
          });
          duplicatesRemoved++;
          console.log(
            `  ✅ Removed duplicate "${skillName}" (${skill.category})`,
          );
        }

        console.log(`  ✅ Kept "${skillName}" (${toKeep.category})`);
      }
    }

    console.log(
      `🎉 Cleanup completed! Removed ${duplicatesRemoved} duplicate skills.`,
    );

    // Show final count
    const finalCount = await prisma.skills.count();
    console.log(`📊 Total skills remaining: ${finalCount}`);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateTechSkills();
