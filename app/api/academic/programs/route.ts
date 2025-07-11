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

    const programs = await prisma.academic_programs.findMany({
      include: {
        skill_progressions: {
          include: {
            skills: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching academic programs:", error);

    return NextResponse.json(
      { error: "Failed to fetch academic programs" },
      { status: 500 },
    );
  }
}
