import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        academic_programs: {
          select: {
            id: true,
            name: true,
            degree: true,
            institution: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { semester: "asc" }, { code: "asc" }],
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}
