import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all courses with their skills
    const courses = await prisma.courses.findMany({
      where: {
        isPublic: true,
        status: {
          in: ["IN_PROGRESS", "COMPLETED"],
        },
      },
      select: {
        id: true,
        title: true,
        code: true,
        year: true,
        semester: true,
        status: true,
        skillsDelivered: true,
        grade: true,
        credits: true,
      },
      orderBy: [
        { status: "desc" }, // Completed courses first
        { year: "asc" },
        { semester: "asc" },
      ],
    });

    // Also get all academic skills with their progressions
    const academicSkills = await prisma.skill_progressions.findMany({
      where: {
        isAcademicSkill: true,
      },
      include: {
        skills: true,
        academic_programs: true,
      },
      orderBy: {
        skills: {
          name: "asc",
        },
      },
    });

    // Count frequency of each skill across courses
    const skillFrequency = new Map();
    const skillsMap = new Map();

    courses.forEach((course) => {
      course.skillsDelivered.forEach((skill) => {
        const frequency = skillFrequency.get(skill) || 0;

        skillFrequency.set(skill, frequency + 1);

        if (!skillsMap.has(skill)) {
          skillsMap.set(skill, {
            name: skill,
            level: 0,
            maxLevel: 0,
            courses: [],
            category: categorizeSkill(skill),
            frequency: 0,
          });
        }

        const skillData = skillsMap.get(skill);

        skillData.courses.push(course);
        skillData.maxLevel += 20; // Each course can contribute up to 20 points
        skillData.frequency = frequency + 1;

        // Calculate current level based on course status and grade
        if (course.status === "COMPLETED") {
          let courseContribution = 20;

          // Adjust contribution based on grade
          if (course.grade) {
            const gradeMultiplier = getGradeMultiplier(course.grade);

            courseContribution = Math.floor(
              courseContribution * gradeMultiplier,
            );
          }

          skillData.level += courseContribution;
        } else if (course.status === "IN_PROGRESS") {
          // In progress courses contribute 50% of their potential
          skillData.level += 10;
        }
      });
    });

    // Convert map to array and normalize levels to 0-100 scale
    const allSkills = Array.from(skillsMap.values()).map((skill) => ({
      ...skill,
      level:
        Math.min(100, Math.floor((skill.level / skill.maxLevel) * 100)) || 0,
    }));

    // Filter academic skills only
    const academicSkillsFromCourses = allSkills.filter(
      (skill) => skill.category === "Academic Skills",
    );

    // Sort by frequency (most relevant first) and then by level
    const mostRelevantSkills = academicSkillsFromCourses
      .sort((a, b) => {
        if (a.frequency !== b.frequency) {
          return b.frequency - a.frequency; // Higher frequency first
        }

        return b.level - a.level; // Higher level first
      })
      .slice(0, 8); // Take top 8 most relevant skills

    // Combine with progression data
    const skillsWithProgression = mostRelevantSkills.map((skill) => {
      const progression = academicSkills.find(
        (p) => p.skills.name === skill.name,
      );

      return {
        ...skill,
        progression: progression || null,
        currentLevel: progression?.currentLevel || skill.level,
        targetLevel: progression?.targetLevel || 90,
        year1Target: progression?.year1Target || null,
        year2Target: progression?.year2Target || null,
        year3Target: progression?.year3Target || null,
        year4Target: progression?.year4Target || null,
        icon: progression?.skills.icon || "📚",
        color: progression?.skills.color || "#10B981",
      };
    });

    // Group skills by category
    const skillsByCategory = allSkills.reduce(
      (acc, skill) => {
        const category = skill.category;

        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);

        return acc;
      },
      {} as Record<string, any[]>,
    );

    return NextResponse.json({
      mostRelevantSkills: skillsWithProgression,
      allSkills,
      skillsByCategory,
      totalSkills: allSkills.length,
      completedCourses: courses.filter((c) => c.status === "COMPLETED").length,
      inProgressCourses: courses.filter((c) => c.status === "IN_PROGRESS")
        .length,
    });
  } catch (error) {
    console.error("Error fetching relevant academic skills:", error);

    return NextResponse.json(
      { error: "Failed to fetch relevant academic skills" },
      { status: 500 },
    );
  }
}

// Helper function to get grade multiplier
function getGradeMultiplier(grade: string): number {
  const gradeMultipliers: { [key: string]: number } = {
    "A+": 1.1,
    A: 1.0,
    "A-": 0.95,
    "B+": 0.9,
    B: 0.85,
    "B-": 0.8,
    "C+": 0.75,
    C: 0.7,
    "C-": 0.65,
    D: 0.6,
    F: 0.0,
    Pass: 0.85,
    Fail: 0.0,
    Incomplete: 0.0,
  };

  return gradeMultipliers[grade] || 0.85;
}

// Helper function to categorize skills
function categorizeSkill(skill: string): string {
  // Academic skills
  const academicSkills = [
    "Research Methods",
    "Critical Thinking",
    "Academic Writing",
    "Data Analysis",
    "Literature Review",
    "Citation & Referencing",
    "Presentation Skills",
    "Essay Writing",
    "Report Writing",
    "Thesis Development",
    "Peer Review",
    "Time Management",
    "Information Literacy",
    "Argumentation",
    "Synthesis",
    "International Political Theory",
    "Diplomatic Analysis",
    "Global Political Economy",
    "Political Philosophy",
    "Comparative Government",
    "International Law",
    "Conflict Resolution",
    "Policy Analysis",
    "Strategic Analysis",
    "Cross-Cultural Communication",
    "Economic Theory",
    "Statistical Analysis",
    "Qualitative Research",
    "Quantitative Research",
    "Historical Analysis",
  ];

  // International Relations skills
  const irSkills = [
    "Diplomatic Theory",
    "International Law",
    "Global Governance",
    "Conflict Resolution",
    "International Security",
    "Economic Diplomacy",
    "Foreign Policy Analysis",
    "International Organizations",
    "Comparative Politics",
    "Regional Studies",
    "Geopolitics",
    "International Trade",
    "Human Rights",
    "Peace Studies",
    "Development Studies",
  ];

  // Communication skills
  const communicationSkills = [
    "English Proficiency",
    "Professional Communication",
    "Public Speaking",
    "Debate",
    "Negotiation",
    "Cross-cultural Communication",
    "Media Communication",
    "Technical Writing",
    "Journalism",
    "Translation",
    "Interpretation",
  ];

  // Analytical skills
  const analyticalSkills = [
    "Statistical Analysis",
    "Quantitative Methods",
    "Qualitative Analysis",
    "Policy Analysis",
    "Risk Assessment",
    "Scenario Planning",
    "Comparative Analysis",
    "Case Study Analysis",
    "SWOT Analysis",
    "Decision Making",
    "Problem Solving",
  ];

  if (academicSkills.includes(skill)) return "Academic Skills";
  if (irSkills.includes(skill)) return "International Relations";
  if (communicationSkills.includes(skill)) return "Language & Communication";
  if (analyticalSkills.includes(skill)) return "Analytical Skills";

  return "Other";
}
