import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function cleanupDuplicateAcademicSkills() {
  console.log("🧹 Cleaning up duplicate academic skills...");

  try {
    // Delete all existing academic skills and progressions
    await prisma.skill_progressions.deleteMany({
      where: {
        isAcademicSkill: true,
      },
    });

    // Delete skills that were created for academic purposes (have progressions)
    const academicSkills = await prisma.skills.findMany({
      where: {
        OR: [
          { name: "International Political Theory" },
          { name: "Diplomatic Analysis" },
          { name: "Global Political Economy" },
        ],
      },
    });

    for (const skill of academicSkills) {
      await prisma.skills.delete({
        where: { id: skill.id },
      });
    }

    console.log(
      `✅ Cleaned up ${academicSkills.length} duplicate academic skills`,
    );

    // Now recreate the clean academic skills
    const program = await prisma.academic_programs.findFirst();

    if (!program) {
      console.log("❌ No academic program found");
      return;
    }

    const academicSkillsData = [
      {
        name: "International Political Theory",
        category: "ACADEMIC",
        level: 10,
        icon: "🏛️",
        color: "#10B981",
        currentLevel: 10,
        targetLevel: 90,
      },
      {
        name: "Diplomatic Analysis",
        category: "ACADEMIC",
        level: 8,
        icon: "🤝",
        color: "#3B82F6",
        currentLevel: 8,
        targetLevel: 90,
      },
      {
        name: "Global Political Economy",
        category: "ACADEMIC",
        level: 5,
        icon: "💼",
        color: "#8B5CF6",
        currentLevel: 5,
        targetLevel: 90,
      },
    ];

    for (const skillData of academicSkillsData) {
      const skill = await prisma.skills.create({
        data: {
          id: randomUUID(),
          name: skillData.name,
          category: skillData.category,
          level: skillData.level,
          icon: skillData.icon,
          color: skillData.color,
          isActive: true,
          sortOrder: 0,
        },
      });

      await prisma.skill_progressions.create({
        data: {
          id: randomUUID(),
          skillId: skill.id,
          programId: program.id,
          currentLevel: skillData.currentLevel,
          targetLevel: skillData.targetLevel,
          year1Target: 25,
          year2Target: 50,
          year3Target: 75,
          year4Target: 90,
          autoUpdate: true,
          isAcademicSkill: true,
          isTechnicalSkill: false,
        },
      });

      console.log(`✅ Created clean academic skill: ${skillData.name}`);
    }

    console.log("🎉 Academic skills cleanup completed!");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateAcademicSkills();
