import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } },
) {
  try {
    const data = await request.json();

    const setting = await prisma.siteSetting.upsert({
      where: { key: params.key },
      update: {
        value: data.value,
      },
      create: {
        key: params.key,
        value: data.value,
        type: "json",
        description: `Updated ${params.key}`,
        isPublic: true,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
