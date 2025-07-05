import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎓 Seeding academic progression data...");

  // Create the BSc International Relations program
  const irProgram = await prisma.academicProgram.upsert({
    where: { id: "ir-program-2025" },
    update: {},
    create: {
      id: "ir-program-2025",
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

  // Define International Relations skills that will be developed
  const irSkills = [
    {
      name: "International Political Theory",
      category: "OTHER",
      icon: "🌍",
      color: "#10B981",
      year1Target: 25,
      year2Target: 50,
      year3Target: 75,
      year4Target: 90,
    },
    {
      name: "Diplomatic Analysis",
      category: "OTHER",
      icon: "🤝",
      color: "#3B82F6",
      year1Target: 20,
      year2Target: 45,
      year3Target: 70,
      year4Target: 85,
    },
    {
      name: "Global Political Economy",
      category: "OTHER",
      icon: "💼",
      color: "#8B5CF6",
      year1Target: 15,
      year2Target: 40,
      year3Target: 65,
      year4Target: 85,
    },
    {
      name: "Research Methods (Political Science)",
      category: "OTHER",
      icon: "📊",
      color: "#F59E0B",
      year1Target: 30,
      year2Target: 55,
      year3Target: 80,
      year4Target: 95,
    },
    {
      name: "Critical Thinking & Analysis",
      category: "OTHER",
      icon: "🧠",
      color: "#EF4444",
      year1Target: 35,
      year2Target: 60,
      year3Target: 80,
      year4Target: 95,
    },
    {
      name: "Cross-Cultural Communication",
      category: "OTHER",
      icon: "🗣️",
      color: "#06B6D4",
      year1Target: 25,
      year2Target: 50,
      year3Target: 75,
      year4Target: 90,
    },
    {
      name: "Policy Analysis",
      category: "OTHER",
      icon: "📋",
      color: "#84CC16",
      year1Target: 10,
      year2Target: 35,
      year3Target: 65,
      year4Target: 85,
    },
    {
      name: "International Law Understanding",
      category: "OTHER",
      icon: "⚖️",
      color: "#6366F1",
      year1Target: 15,
      year2Target: 40,
      year3Target: 70,
      year4Target: 85,
    },
  ];

  // Create or update IR skills
  for (const skillData of irSkills) {
    const skill = await prisma.skill.upsert({
      where: { name: skillData.name },
      update: {
        category: skillData.category as any,
        icon: skillData.icon,
        color: skillData.color,
        level: 5, // Initial level
        isActive: true,
      },
      create: {
        name: skillData.name,
        category: skillData.category as any,
        level: 5, // Initial level
        icon: skillData.icon,
        color: skillData.color,
        isActive: true,
        sortOrder: 0,
      },
    });

    // Create skill progression for this skill
    await prisma.skillProgression.upsert({
      where: {
        skillId_programId: {
          skillId: skill.id,
          programId: irProgram.id,
        },
      },
      update: {},
      create: {
        skillId: skill.id,
        programId: irProgram.id,
        currentLevel: 5,
        targetLevel: skillData.year4Target,
        year1Target: skillData.year1Target,
        year2Target: skillData.year2Target,
        year3Target: skillData.year3Target,
        year4Target: skillData.year4Target,
        autoUpdate: true,
        isAcademicSkill: true,
        isTechnicalSkill: false,
      },
    });
  }

  // Update existing technical skills to show they'll be enhanced by combining with IR knowledge
  const techSkills = [
    {
      name: "Full-Stack Development",
      year1Target: 85,
      year2Target: 90,
      year3Target: 95,
      year4Target: 98,
    },
    {
      name: "Data Analysis",
      year1Target: 70,
      year2Target: 80,
      year3Target: 90,
      year4Target: 95,
    },
    {
      name: "Project Management",
      year1Target: 60,
      year2Target: 75,
      year3Target: 85,
      year4Target: 90,
    },
  ];

  for (const skillData of techSkills) {
    const skill = await prisma.skill.findFirst({
      where: { name: { contains: skillData.name } },
    });

    if (skill) {
      await prisma.skillProgression.upsert({
        where: {
          skillId_programId: {
            skillId: skill.id,
            programId: irProgram.id,
          },
        },
        update: {},
        create: {
          skillId: skill.id,
          programId: irProgram.id,
          currentLevel: skill.level,
          targetLevel: skillData.year4Target,
          year1Target: skillData.year1Target,
          year2Target: skillData.year2Target,
          year3Target: skillData.year3Target,
          year4Target: skillData.year4Target,
          autoUpdate: true,
          isAcademicSkill: false,
          isTechnicalSkill: true,
        },
      });
    }
  }

  console.log("✅ Academic progression seeding completed!");
  console.log(`🎓 Created BSc International Relations program`);
  console.log(
    `📚 Set up skill progressions for ${irSkills.length} new IR skills`,
  );
  console.log(`💻 Enhanced ${techSkills.length} existing technical skills`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding academic progression:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
