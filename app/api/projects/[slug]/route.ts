import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to determine if the param is an ID (UUID) or slug
function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(str);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const params = await context.params;
    const identifier = params.slug;

    // Determine if we're looking up by ID or slug
    const whereClause = isUUID(identifier)
      ? { id: identifier }
      : { slug: identifier, isActive: true };

    const project = await prisma.projects.findUnique({
      where: whereClause,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/[slug] - Update project (admin only, ID required)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const identifier = params.slug;

    // For admin operations, we prefer ID but can work with slug
    const body = await request.json();

    const project = await prisma.projects.update({
      where: isUUID(identifier) ? { id: identifier } : { slug: identifier },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to update project:", error);

    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[slug] - Delete project (admin only, ID required)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const identifier = params.slug;

    await prisma.projects.delete({
      where: isUUID(identifier) ? { id: identifier } : { slug: identifier },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);

    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
