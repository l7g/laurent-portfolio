import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const course = await prisma.courses.findUnique({
      where: { id: params.id },
      include: {
        course_assessments: true,
        blog_posts: {
          where: {
            status: "PUBLISHED",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            publishedAt: true,
            status: true,
          },
        },
        academic_programs: {
          select: {
            id: true,
            name: true,
            degree: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const {
      code,
      title,
      description,
      credits,
      programId,
      year,
      semester,
      objectives,
      topics,
      prerequisites,
      status,
      startDate,
      endDate,
      grade,
      instructor,
      instructorBio,
      officeHours,
      syllabus,
      textbooks,
      resources,
      isPublic,
      featured,
      sortOrder,
      skillsDelivered,
    } = body;

    const course = await prisma.courses.update({
      where: { id: params.id },
      data: {
        code,
        title,
        description,
        credits,
        programId,
        year,
        semester,
        objectives: objectives || [],
        topics: topics || [],
        prerequisites: prerequisites || [],
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        grade,
        instructor,
        instructorBio,
        officeHours,
        syllabus,
        textbooks: textbooks || [],
        resources: resources || [],
        skillsDelivered: skillsDelivered || [],
        isPublic: isPublic ?? true,
        featured: featured ?? false,
        sortOrder: sortOrder || 0,
        // Note: skillsDelivered is now in the Prisma schema
      },
      include: {
        course_assessments: true,
        blog_posts: true,
        academic_programs: true,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const body = await request.json();

    const course = await prisma.courses.update({
      where: { id: params.id },
      data: body,
      include: {
        course_assessments: true,
        blog_posts: true,
        academic_programs: true,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    await prisma.courses.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
