import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const demo = searchParams.get("demo");
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    const whereClause: any = {};

    // Filter by demo status (this field exists in production)
    if (demo === "true") {
      whereClause.demo = true;
      // For demos, also filter by active status by default unless explicitly set to false
      if (active !== "false") {
        whereClause.isActive = true;
      }
    } else if (demo === "false") {
      whereClause.demo = false;
    }    // Filter by active status (this field exists in production)
    if (active === "true") {
      whereClause.isActive = true;
    } else if (active === "false") {
      whereClause.isActive = false;
    }

    // Filter by category (field now added to production database)
    if (category) {
      whereClause.category = category.toUpperCase();
    }
    
    const projects = await prisma.projects.findMany({
      where: whereClause,
      orderBy: [
        { sortOrder: "asc" },
        { flagship: "desc" },
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      shortDesc,
      image,
      technologies,
      featured,
      flagship,
      isActive,
      status,
      category,
      liveUrl,
      githubUrl,
      caseStudyUrl,
      highlights,
      outcomes,
      showWipWarning,
      wipWarningText,
      wipWarningEmoji,
      detailedDescription,
      challenges,
      solutions,
      results,
      clientName,
      projectDuration,
      teamSize,
      myRole,
      role,
      year,
    } = body;

    // Validate required fields
    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existingProject = await prisma.projects.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 400 },
      );
    }

    const project = await prisma.projects.create({
      data: {
        id: randomUUID(),
        title,
        slug,
        description,
        shortDesc,
        image,
        technologies: technologies || [],
        featured: featured || false,
        flagship: flagship || false,
        isActive: isActive !== undefined ? isActive : true,
        status: status || "READY",
        category: category || "OPENSOURCE",
        liveUrl,
        githubUrl,
        caseStudyUrl,
        highlights: highlights || [],
        outcomes: outcomes || [],
        showWipWarning: showWipWarning !== undefined ? showWipWarning : true,
        wipWarningText,
        wipWarningEmoji: wipWarningEmoji || "🚧",
        detailedDescription,
        challenges,
        solutions,
        results,
        clientName,
        projectDuration,
        teamSize,
        myRole,
        role,
        year,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
