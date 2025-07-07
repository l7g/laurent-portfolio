import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const programs = await prisma.academic_programs.findMany({
      include: {
        courses: {
          orderBy: [{ year: "asc" }, { semester: "asc" }],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      degree,
      institution,
      accreditation,
      description,
      startDate,
      expectedEnd,
      currentYear,
      totalYears,
      mode,
      status,
    } = body;

    const program = await prisma.academic_programs.create({
      data: {
        id: randomUUID(),
        name,
        degree,
        institution,
        accreditation,
        description,
        startDate: new Date(startDate),
        expectedEnd: new Date(expectedEnd),
        currentYear,
        totalYears,
        mode,
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating academic program:", error);
    return NextResponse.json(
      { error: "Failed to create academic program" },
      { status: 500 },
    );
  }
}
