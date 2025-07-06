import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🎓 Seeding academic progression data...");

  // Create the BSc International Relations program (reflecting current DB state)
  const irProgram = await prisma.academic_programs.upsert({
    where: { id: "cmcpuhvxx0000mj2gyoc9pgdn" }, // Use actual ID from DB
    update: {},
    create: {
      id: "cmcpuhvxx0000mj2gyoc9pgdn",
      name: "BSc (Hons) International Relations",
      degree: "BSc (Hons) International Relations",
      institution: "University of London",
      accreditation:
        "Academic direction from the London School of Economics and Political Science (LSE)",
      description:
        "An Honours Bachelor of Science degree in International Relations, providing comprehensive understanding of global politics, international law, economics, and diplomatic relations. The Honours designation indicates advanced academic study including independent research and dissertation components.",
      startDate: new Date("2025-01-01"), // Current start date from DB
      expectedEnd: new Date("2028-06-30"), // Current expected end from DB
      currentYear: 1,
      totalYears: 3,
      mode: null,
      status: "ACTIVE",
      updatedAt: new Date(),
    },
  });

  // Define the academic skills that are currently in the database
  const existingAcademicSkills = [
    {
      name: "International Political Theory",
      category: "ACADEMIC",
      icon: "🌍",
      color: "#10B981",
      level: 10,
      currentLevel: 10,
      targetLevel: 90,
    },
    {
      name: "Diplomatic Analysis",
      category: "ACADEMIC",
      icon: "�",
      color: "#3B82F6",
      level: 8,
      currentLevel: 8,
      targetLevel: 90,
    },
    {
      name: "Global Political Economy",
      category: "ACADEMIC",
      icon: "�",
      color: "#8B5CF6",
      level: 5,
      currentLevel: 5,
      targetLevel: 90,
    },
  ];

  // Ensure the existing academic skills are properly set up
  for (const skillData of existingAcademicSkills) {
    // Try to find existing skill by name
    let skill = await prisma.skills.findFirst({
      where: { name: skillData.name },
    });

    if (skill) {
      // Update existing skill
      skill = await prisma.skills.update({
        where: { id: skill.id },
        data: {
          category: skillData.category as any,
          icon: skillData.icon,
          color: skillData.color,
          level: skillData.level,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new skill
      skill = await prisma.skills.create({
        data: {
          id: randomUUID(),
          name: skillData.name,
          category: skillData.category as any,
          level: skillData.level,
          icon: skillData.icon,
          color: skillData.color,
          isActive: true,
          sortOrder: 0,
          updatedAt: new Date(),
        },
      });
    }

    // Ensure skill progression exists for this skill
    const existingProgression = await prisma.skill_progressions.findFirst({
      where: {
        skillId: skill.id,
        programId: irProgram.id,
      },
    });

    if (!existingProgression) {
      await prisma.skill_progressions.create({
        data: {
          id: randomUUID(),
          skillId: skill.id,
          programId: irProgram.id,
          currentLevel: skillData.currentLevel,
          targetLevel: skillData.targetLevel,
          autoUpdate: true,
          isAcademicSkill: true,
          isTechnicalSkill: false,
        },
      });
    }
  }

  console.log("✅ Academic progression seeding completed!");
  console.log(`🎓 Updated BSc International Relations program`);
  console.log(
    `📚 Ensured skill progressions for ${existingAcademicSkills.length} existing academic skills`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding academic progression:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
