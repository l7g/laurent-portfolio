import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CourseStatus } from "@prisma/client";

// Update course progress (status and grade)
export async function PUT(request: NextRequest) {
  try {
    const { courseId, status, grade } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses: CourseStatus[] = [
      "UPCOMING",
      "IN_PROGRESS",
      "COMPLETED",
      "DEFERRED",
      "WITHDRAWN",
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid course status" },
        { status: 400 },
      );
    }

    // Update course
    const updatedCourse = await prisma.courses.update({
      where: { id: courseId },
      data: {
        ...(status && { status }),
        ...(grade && { grade }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
    return NextResponse.json(
      { error: "Failed to update course progress" },
      { status: 500 },
    );
  }
}

// Get course progress summary
export async function GET() {
  try {
    const courses = await prisma.courses.findMany({
      select: {
        id: true,
        code: true,
        title: true,
        year: true,
        semester: true,
        status: true,
        grade: true,
        credits: true,
        skillsDelivered: true,
      },
      orderBy: [{ year: "asc" }, { semester: "asc" }, { code: "asc" }],
    });

    // Calculate progress statistics
    const totalCourses = courses.length;
    const completedCourses = courses.filter(
      (c) => c.status === "COMPLETED",
    ).length;
    const inProgressCourses = courses.filter(
      (c) => c.status === "IN_PROGRESS",
    ).length;
    const upcomingCourses = courses.filter(
      (c) => c.status === "UPCOMING",
    ).length;
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const completedCredits = courses
      .filter((c) => c.status === "COMPLETED")
      .reduce((sum, c) => sum + c.credits, 0);

    // Calculate GPA for completed courses with grades
    const coursesWithGrades = courses.filter(
      (c) => c.status === "COMPLETED" && c.grade,
    );
    let gpa = 0;
    if (coursesWithGrades.length > 0) {
      const totalGradePoints = coursesWithGrades.reduce((sum, course) => {
        const gradePoints = getGradePoints(course.grade || "");
        return sum + gradePoints * course.credits;
      }, 0);
      const totalGradeCredits = coursesWithGrades.reduce(
        (sum, c) => sum + c.credits,
        0,
      );
      gpa = totalGradePoints / totalGradeCredits;
    }

    // Group courses by year and semester
    const coursesByYear = courses.reduce(
      (acc, course) => {
        const year = course.year;
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(course);
        return acc;
      },
      {} as { [key: number]: typeof courses },
    );

    return NextResponse.json({
      summary: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        upcomingCourses,
        totalCredits,
        completedCredits,
        gpa: Math.round(gpa * 100) / 100,
        completionRate: Math.round((completedCourses / totalCourses) * 100),
      },
      courses,
      coursesByYear,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch course progress" },
      { status: 500 },
    );
  }
}

function getGradePoints(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
    Pass: 3.0,
    Fail: 0.0,
  };

  return gradeMap[grade.toUpperCase()] || 0;
}
