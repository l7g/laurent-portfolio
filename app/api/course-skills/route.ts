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

    // Categorize skills and calculate levels based on course completion
    const skillsMap = new Map();

    courses.forEach((course) => {
      course.skillsDelivered.forEach((skill) => {
        if (!skillsMap.has(skill)) {
          skillsMap.set(skill, {
            name: skill,
            level: 0,
            maxLevel: 0,
            courses: [],
            category: categorizeSkill(skill),
          });
        }

        const skillData = skillsMap.get(skill);
        skillData.courses.push(course);
        skillData.maxLevel += 20; // Each course can contribute up to 20 points

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
    const skills = Array.from(skillsMap.values()).map((skill) => ({
      ...skill,
      level:
        Math.min(100, Math.floor((skill.level / skill.maxLevel) * 100)) || 0,
    }));

    // Group skills by category
    const skillsByCategory = skills.reduce(
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
      skills,
      skillsByCategory,
      totalSkills: skills.length,
      completedCourses: courses.filter((c) => c.status === "COMPLETED").length,
      inProgressCourses: courses.filter((c) => c.status === "IN_PROGRESS")
        .length,
    });
  } catch (error) {
    console.error("Error fetching course skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch course skills" },
      { status: 500 },
    );
  }
}

function categorizeSkill(skill: string): string {
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

  if (irSkills.includes(skill)) return "International Relations";
  if (academicSkills.includes(skill)) return "Academic Skills";
  if (communicationSkills.includes(skill)) return "Language & Communication";
  if (analyticalSkills.includes(skill)) return "Analytical Skills";

  return "Other";
}

function getGradeMultiplier(grade: string): number {
  const gradeMultipliers: Record<string, number> = {
    "A+": 1.0,
    A: 0.95,
    "A-": 0.9,
    "B+": 0.85,
    B: 0.8,
    "B-": 0.75,
    "C+": 0.7,
    C: 0.65,
    "C-": 0.6,
    D: 0.5,
    F: 0.3,
    Pass: 0.8,
    Fail: 0.3,
    Incomplete: 0.5,
  };

  return gradeMultipliers[grade] || 0.8;
}
