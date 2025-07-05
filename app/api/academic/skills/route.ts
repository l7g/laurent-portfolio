import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all skills that have academic progressions
    const academicSkills = await prisma.skillProgression.findMany({
      where: {
        isAcademicSkill: true,
      },
      include: {
        skill: true,
        program: true,
      },
      orderBy: {
        skill: {
          name: "asc",
        },
      },
    });

    // Transform to match expected format
    const skills = academicSkills.map((progression) => ({
      id: progression.skill.id,
      name: progression.skill.name,
      category: progression.skill.category,
      level: progression.skill.level,
      currentLevel: progression.currentLevel,
      targetLevel: progression.targetLevel,
      year1Target: progression.year1Target,
      year2Target: progression.year2Target,
      year3Target: progression.year3Target,
      year4Target: progression.year4Target,
      icon: progression.skill.icon,
      color: progression.skill.color,
      isActive: progression.skill.isActive,
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
    const program = await prisma.academicProgram.findUnique({
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

    const progression = await prisma.skillProgression.findFirst({
      where: {
        skillId,
        programId,
      },
    });

    if (progression) {
      const updated = await prisma.skillProgression.update({
        where: { id: progression.id },
        data: {
          currentLevel,
          lastUpdated: new Date(),
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.skillProgression.create({
        data: {
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
