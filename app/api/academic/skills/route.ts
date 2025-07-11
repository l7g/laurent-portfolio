import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all skills that have academic progressions
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

    // Transform to match expected format
    const skills = academicSkills.map((progression) => ({
      id: progression.skills.id,
      name: progression.skills.name,
      category: progression.skills.category,
      level: progression.skills.level,
      currentLevel: progression.currentLevel,
      targetLevel: progression.targetLevel,
      year1Target: progression.year1Target,
      year2Target: progression.year2Target,
      year3Target: progression.year3Target,
      year4Target: progression.year4Target,
      icon: progression.skills.icon,
      color: progression.skills.color,
      isActive: progression.skills.isActive,
      progression: progression,
    }));

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching academic skills:", error);

    return NextResponse.json(
      { error: "Failed to fetch academic skills" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { skillId, programId, currentLevel } = await request.json();

    // Calculate expected level based on current year of the program
    const program = await prisma.academic_programs.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Calculate progression based on current year
    const monthsSinceStart = Math.floor(
      (Date.now() - program.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    const yearProgress = Math.min(monthsSinceStart / 12, program.totalYears);

    const progression = await prisma.skill_progressions.findFirst({
      where: {
        skillId,
        programId,
      },
    });

    if (progression) {
      const updated = await prisma.skill_progressions.update({
        where: { id: progression.id },
        data: {
          currentLevel,
          lastUpdated: new Date(),
        },
      });

      return NextResponse.json(updated);
    } else {
      const created = await prisma.skill_progressions.create({
        data: {
          id: randomUUID(),
          skillId,
          programId,
          currentLevel,
          targetLevel: 90,
          autoUpdate: true,
          isAcademicSkill: true,
        },
      });

      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Error updating skill progression:", error);

    return NextResponse.json(
      { error: "Failed to update skill progression" },
      { status: 500 },
    );
  }
}
