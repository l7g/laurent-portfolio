import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.academicProgram.findMany({
      include: {
        progressions: {
          include: {
            skill: true,
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
