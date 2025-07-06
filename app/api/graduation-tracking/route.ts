import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get graduation tracking info
export async function GET() {
  try {
    const program = await prisma.academic_programs.findFirst({
      select: {
        id: true,
        degree: true,
        institution: true,
        expectedEnd: true,
        actualGraduationDate: true,
        dissertationStarted: true,
        dissertationTitle: true,
        dissertationDeadline: true,
        dissertationSubmitted: true,
        dissertationSubmissionDate: true,
        status: true,
        totalYears: true,
        currentYear: true,
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Academic program not found" },
        { status: 404 },
      );
    }

    // Calculate graduation status
    const now = new Date();
    const expectedEnd = new Date(program.expectedEnd);
    const actualGraduation = program.actualGraduationDate
      ? new Date(program.actualGraduationDate)
      : null;

    let graduationStatus = "in_progress";
    if (actualGraduation && actualGraduation <= now) {
      graduationStatus = "graduated";
    } else if (now > expectedEnd) {
      graduationStatus = "overdue";
    }

    return NextResponse.json({
      ...program,
      graduationStatus,
      hasGraduated: actualGraduation && actualGraduation <= now,
      isDissertationPhase: program.dissertationStarted,
    });
  } catch (error) {
    console.error("Error fetching graduation info:", error);
    return NextResponse.json(
      { error: "Failed to fetch graduation info" },
      { status: 500 },
    );
  }
}

// Update graduation tracking
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      actualGraduationDate,
      dissertationStarted,
      dissertationTitle,
      dissertationDeadline,
      dissertationSubmitted,
      dissertationSubmissionDate,
    } = data;

    // Build update object
    const updateData: any = {};

    if (actualGraduationDate !== undefined) {
      updateData.actualGraduationDate = actualGraduationDate
        ? new Date(actualGraduationDate)
        : null;

      // If graduation date is set and in the past, mark as completed
      if (
        actualGraduationDate &&
        new Date(actualGraduationDate) <= new Date()
      ) {
        updateData.status = "COMPLETED";
      }
    }

    if (dissertationStarted !== undefined)
      updateData.dissertationStarted = dissertationStarted;
    if (dissertationTitle !== undefined)
      updateData.dissertationTitle = dissertationTitle;
    if (dissertationDeadline !== undefined) {
      updateData.dissertationDeadline = dissertationDeadline
        ? new Date(dissertationDeadline)
        : null;
    }
    if (dissertationSubmitted !== undefined)
      updateData.dissertationSubmitted = dissertationSubmitted;
    if (dissertationSubmissionDate !== undefined) {
      updateData.dissertationSubmissionDate = dissertationSubmissionDate
        ? new Date(dissertationSubmissionDate)
        : null;
    }

    const updatedProgram = await prisma.academic_programs.updateMany({
      data: updateData,
    });

    return NextResponse.json({
      message: "Graduation tracking updated successfully",
      updated: updatedProgram.count,
    });
  } catch (error) {
    console.error("Error updating graduation tracking:", error);
    return NextResponse.json(
      { error: "Failed to update graduation tracking" },
      { status: 500 },
    );
  }
}
