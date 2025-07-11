import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/skills/[id] - Get single skill
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const skill = await prisma.skills.findUnique({
      where: { id: params.id },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Failed to fetch skill:", error);

    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 },
    );
  }
}

// PUT /api/skills/[id] - Update skill
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    const body = await request.json();
    const { name, category, level, icon, color, isActive, sortOrder } = body;

    // Check if skill exists
    const existingSkill = await prisma.skills.findUnique({
      where: { id: params.id },
    });

    if (!existingSkill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const skill = await prisma.skills.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(level !== undefined && { level }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Failed to update skill:", error);

    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 },
    );
  }
}

// DELETE /api/skills/[id] - Delete skill
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    // Check if skill exists
    const existingSkill = await prisma.skills.findUnique({
      where: { id: params.id },
    });

    if (!existingSkill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    await prisma.skills.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Failed to delete skill:", error);

    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 },
    );
  }
}
