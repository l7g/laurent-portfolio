import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/sections/[id] - Get single section
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const section = await prisma.portfolioSection.findUnique({
      where: { id: params.id },
    });

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Failed to fetch section:", error);
    return NextResponse.json(
      { error: "Failed to fetch section" },
      { status: 500 },
    );
  }
}

// PUT /api/sections/[id] - Update section
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
    const {
      displayName,
      sectionType,
      title,
      subtitle,
      description,
      content,
      settings,
      isActive,
      sortOrder,
    } = body;

    // Check if section exists
    const existingSection = await prisma.portfolioSection.findUnique({
      where: { id: params.id },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const section = await prisma.portfolioSection.update({
      where: { id: params.id },
      data: {
        ...(displayName && {
          displayName,
          name: displayName.toLowerCase().replace(/\s+/g, "-"),
        }),
        ...(sectionType && { sectionType }),
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(settings !== undefined && { settings }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Failed to update section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 },
    );
  }
}

// DELETE /api/sections/[id] - Delete section
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

    // Check if section exists
    const existingSection = await prisma.portfolioSection.findUnique({
      where: { id: params.id },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    await prisma.portfolioSection.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Failed to delete section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 },
    );
  }
}
