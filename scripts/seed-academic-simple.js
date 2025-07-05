import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎓 Seeding academic progression (simplified)...");

  // Create the BSc International Relations program
  const irProgram = await prisma.academicProgram.create({
    data: {
      name: "BSc International Relations",
      degree: "Bachelor of Science (BSc) in International Relations",
      institution: "University of London",
      accreditation:
        "Academic direction from the London School of Economics and Political Science (LSE)",
      description:
        "Studying how diverse forces, actors and events shape our global community, gaining communication and problem-solving skills to help bridge cultural gaps and address contemporary global challenges.",
      startDate: new Date("2025-01-01"),
      expectedEnd: new Date("2028-12-31"),
      currentYear: 1,
      totalYears: 4,
      mode: "Online with local teaching centre support",
      status: "ACTIVE",
    },
  });

  console.log("✅ Created academic program:", irProgram.name);

  // Create some sample IR skills
  const irSkills = [
    {
      name: "International Political Theory",
      category: "OTHER",
      level: 10,
      icon: "🌍",
      color: "#10B981",
    },
    {
      name: "Diplomatic Analysis",
      category: "OTHER",
      level: 8,
      icon: "🤝",
      color: "#3B82F6",
    },
    {
      name: "Global Political Economy",
      category: "OTHER",
      level: 5,
      icon: "💼",
      color: "#8B5CF6",
    },
  ];

  for (const skillData of irSkills) {
    const skill = await prisma.skill.create({
      data: {
        ...skillData,
        isActive: true,
        sortOrder: 0,
      },
    });

    // Create skill progression
    await prisma.skillProgression.create({
      data: {
        skillId: skill.id,
        programId: irProgram.id,
        currentLevel: skill.level,
        targetLevel: 90,
        year1Target: 25,
        year2Target: 50,
        year3Target: 75,
        year4Target: 90,
        autoUpdate: true,
        isAcademicSkill: true,
        isTechnicalSkill: false,
      },
    });

    console.log("✅ Created skill:", skill.name);
  }

  console.log("🎉 Academic progression seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
