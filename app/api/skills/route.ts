import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/skills - Get all skills (with admin filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    // Check if this is an admin request
    const { searchParams } = new URL(request.url);
    const adminOnly = searchParams.get("admin") === "true";

    if (adminOnly && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build where clause - public users only see active skills
    const where: any = {};

    if (!isAdmin) {
      where.isActive = true;
    }

    const skills = await prisma.skills.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Failed to fetch skills:", error);

    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 },
    );
  }
}

// POST /api/skills - Create new skill
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, level, icon, color, isActive, sortOrder } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 },
      );
    }

    const skill = await prisma.skills.create({
      data: {
        id: randomUUID(),
        name,
        category,
        level: level || 1,
        icon,
        color,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Failed to create skill:", error);

    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 },
    );
  }
}
