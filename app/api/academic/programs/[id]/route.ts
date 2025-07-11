import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/academic/programs/[id] - Get single program
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const program = await prisma.academic_programs.findUnique({
      where: { id: params.id },
      include: {
        skill_progressions: {
          include: {
            skills: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error("Failed to fetch program:", error);

    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 },
    );
  }
}

// PATCH /api/academic/programs/[id] - Update program
export async function PATCH(
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

    const program = await prisma.academic_programs.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error("Failed to update program:", error);

    return NextResponse.json(
      { error: "Failed to update program" },
      { status: 500 },
    );
  }
}

// DELETE /api/academic/programs/[id] - Delete program
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

    await prisma.academic_programs.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete program:", error);

    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 },
    );
  }
}
