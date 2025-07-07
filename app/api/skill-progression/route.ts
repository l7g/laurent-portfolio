import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all courses to calculate skill progression
    const courses = await prisma.courses.findMany({
      select: {
        id: true,
        title: true,
        year: true,
        status: true,
        skillsDelivered: true,
        grade: true,
      },
    });

    // Get current academic year
    const getCurrentAcademicYear = () => {
      const now = new Date();
      const startYear = 2025;
      const currentYear = now.getFullYear();
      const month = now.getMonth();

      let academicYear = currentYear - startYear + 1;
      if (month < 8) {
        academicYear -= 1;
      }

      return Math.max(1, Math.min(academicYear, 4));
    };

    const currentYear = getCurrentAcademicYear();

    // Calculate skill progression based on completed courses
    const skill_progressions: {
      [key: string]: { level: number; category: string; description: string };
    } = {};

    courses.forEach((course) => {
      if (course.skillsDelivered && course.skillsDelivered.length > 0) {
        const courseWeight =
          course.status === "COMPLETED"
            ? 1
            : course.status === "IN_PROGRESS"
              ? 0.5
              : 0.2;

        // Additional weight for grades
        let gradeMultiplier = 1;
        if (course.grade) {
          const grade = course.grade.toUpperCase();
          if (grade.includes("A")) gradeMultiplier = 1.2;
          else if (grade.includes("B")) gradeMultiplier = 1.1;
          else if (grade.includes("C")) gradeMultiplier = 1.0;
          else if (grade.includes("D")) gradeMultiplier = 0.9;
        }

        course.skillsDelivered.forEach((skill: string) => {
          if (!skill_progressions[skill]) {
            skill_progressions[skill] = {
              level: 0,
              category: categorizeSkill(skill),
              description: getSkillDescription(skill),
            };
          }

          // Add weighted skill points
          const skillPoints = 15 * courseWeight * gradeMultiplier;
          skill_progressions[skill].level = Math.min(
            100,
            skill_progressions[skill].level + skillPoints,
          );
        });
      }
    });

    // Apply year-based progression (skills develop over time)
    Object.keys(skill_progressions).forEach((skill) => {
      const yearMultiplier = Math.min(currentYear * 0.1, 0.4); // Up to 40% bonus based on year
      skill_progressions[skill].level = Math.min(
        100,
        skill_progressions[skill].level * (1 + yearMultiplier),
      );
    });

    return NextResponse.json(skill_progressions);
  } catch (error) {
    console.error("Error calculating skill progression:", error);
    return NextResponse.json(
      { error: "Failed to calculate skill progression" },
      { status: 500 },
    );
  }
}

function categorizeSkill(skill: string): string {
  const skill_lower = skill.toLowerCase();

  if (
    skill_lower.includes("research") ||
    skill_lower.includes("analysis") ||
    skill_lower.includes("critical")
  ) {
    return "Academic Skills";
  }

  if (
    skill_lower.includes("international") ||
    skill_lower.includes("global") ||
    skill_lower.includes("political") ||
    skill_lower.includes("diplomatic") ||
    skill_lower.includes("law") ||
    skill_lower.includes("security")
  ) {
    return "International Relations";
  }

  if (
    skill_lower.includes("writing") ||
    skill_lower.includes("communication") ||
    skill_lower.includes("presentation")
  ) {
    return "Communication Skills";
  }

  if (
    skill_lower.includes("economic") ||
    skill_lower.includes("financial") ||
    skill_lower.includes("quantitative") ||
    skill_lower.includes("data")
  ) {
    return "Analytical Skills";
  }

  if (
    skill_lower.includes("language") ||
    skill_lower.includes("cultural") ||
    skill_lower.includes("intercultural")
  ) {
    return "Cultural & Language Skills";
  }

  return "Academic Skills";
}

function getSkillDescription(skill: string): string {
  const descriptions: { [key: string]: string } = {
    "Critical Analysis":
      "Ability to evaluate information objectively and make reasoned judgments",
    "Research Methods":
      "Systematic approach to investigating and analyzing academic sources",
    "Global Awareness":
      "Understanding of international issues and cross-cultural perspectives",
    "Political Theory":
      "Knowledge of political systems, ideologies, and theoretical frameworks",
    "Comparative Analysis":
      "Skills in comparing different systems, policies, or approaches",
    "Political Science":
      "Understanding of political processes, institutions, and behavior",
    "Institutional Analysis":
      "Ability to examine and evaluate organizational structures and functions",
    "Economic Analysis":
      "Skills in analyzing economic trends, policies, and market dynamics",
    "Quantitative Methods":
      "Proficiency in statistical analysis and data interpretation",
    "Financial Literacy":
      "Understanding of financial systems, markets, and economic principles",
    "Data Interpretation":
      "Ability to analyze and draw conclusions from complex datasets",
    "Historical Analysis":
      "Skills in examining historical events and their contemporary relevance",
    "Writing Skills": "Proficiency in academic and professional writing",
    "Security Analysis":
      "Understanding of security challenges and strategic thinking",
    "Risk Assessment":
      "Ability to evaluate and manage potential risks and threats",
    "Strategic Thinking":
      "Capacity for long-term planning and strategic decision-making",
    "Policy Analysis":
      "Skills in evaluating and developing public policy solutions",
    "Legal Analysis":
      "Understanding of legal principles and case study examination",
    "International Law":
      "Knowledge of international legal frameworks and treaties",
    "Case Study Analysis":
      "Ability to examine and learn from real-world examples",
    "Legal Writing":
      "Proficiency in legal documentation and argument construction",
  };

  return descriptions[skill] || `Advanced knowledge and skills in ${skill}`;
}
