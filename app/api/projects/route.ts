import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
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
      liveUrl,
      githubUrl,
      highlights,
      detailedDescription,
      challenges,
      solutions,
      results,
      clientName,
      projectDuration,
      teamSize,
      myRole,
    } = body;

    // Validate required fields
    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
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
        liveUrl,
        githubUrl,
        highlights: highlights || [],
        detailedDescription,
        challenges,
        solutions,
        results,
        clientName,
        projectDuration,
        teamSize,
        myRole,
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
