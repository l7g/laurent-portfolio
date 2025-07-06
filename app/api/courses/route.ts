import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const courses = await prisma.courses.findMany({
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
      orderBy: [{ year: "asc" }, { semester: "asc" }, { sortOrder: "asc" }],
    });

    // Ensure all arrays are properly initialized
    const normalizedCourses = courses.map((course) => ({
      ...course,
      objectives: course.objectives || [],
      topics: course.topics || [],
      prerequisites: course.prerequisites || [],
      textbooks: course.textbooks || [],
      resources: course.resources || [],
      skillsDelivered: course.skillsDelivered || [],
      assessments: course.course_assessments || [],
      blogPosts: course.blog_posts || [],
    }));

    return NextResponse.json(normalizedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const course = await prisma.courses.create({
      data: {
        id: randomUUID(),
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
        updatedAt: new Date(),
      },
      include: {
        course_assessments: true,
        blog_posts: true,
        academic_programs: true,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
