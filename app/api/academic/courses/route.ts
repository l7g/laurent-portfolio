import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    // For admin dashboard, require authentication
    const { searchParams } = new URL(request.url);
    const adminOnly = searchParams.get("admin") === "true";

    if (adminOnly && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
