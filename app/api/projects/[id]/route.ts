import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// PUT /api/projects/[id] - Update project
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // If slug is being changed, check if new slug already exists
    if (slug && slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Project with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(image !== undefined && { image }),
        ...(technologies && { technologies }),
        ...(featured !== undefined && { featured }),
        ...(flagship !== undefined && { flagship }),
        ...(isActive !== undefined && { isActive }),
        ...(status && { status }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(highlights && { highlights }),
        ...(detailedDescription !== undefined && { detailedDescription }),
        ...(challenges !== undefined && { challenges }),
        ...(solutions !== undefined && { solutions }),
        ...(results !== undefined && { results }),
        ...(clientName !== undefined && { clientName }),
        ...(projectDuration !== undefined && { projectDuration }),
        ...(teamSize !== undefined && { teamSize }),
        ...(myRole !== undefined && { myRole }),
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

// DELETE /api/projects/[id] - Delete project
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
