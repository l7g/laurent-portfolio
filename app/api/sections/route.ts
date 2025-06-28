import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/sections - Get all sections
export async function GET() {
  try {
    const sections = await prisma.portfolioSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error("Failed to fetch sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 },
    );
  }
}

// POST /api/sections - Create new section
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      sectionType,
      displayName,
      title,
      subtitle,
      description,
      content,
      settings,
      isActive,
      sortOrder,
    } = body;

    // Validate required fields
    if (!sectionType || !displayName) {
      return NextResponse.json(
        { error: "Section type and display name are required" },
        { status: 400 },
      );
    }

    // If no sortOrder is specified, put it at the end
    let sectionSortOrder = sortOrder;
    if (sectionSortOrder === undefined) {
      const lastSection = await prisma.portfolioSection.findFirst({
        orderBy: { sortOrder: "desc" },
      });
      sectionSortOrder = (lastSection?.sortOrder || 0) + 1;
    }

    const section = await prisma.portfolioSection.create({
      data: {
        name: displayName.toLowerCase().replace(/\s+/g, "-"), // Generate internal name
        displayName,
        sectionType,
        title,
        subtitle,
        description,
        content: content || {},
        settings: settings || {},
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sectionSortOrder,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Failed to create section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 },
    );
  }
}
