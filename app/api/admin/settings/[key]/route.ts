import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ key: string }> },
) {
  try {
    const params = await context.params;
    const data = await request.json();

    const setting = await prisma.site_settings.upsert({
      where: { key: params.key },
      update: {
        value: data.value,
      },
      create: {
        id: randomUUID(),
        key: params.key,
        value: data.value,
        type: "json",
        description: `Updated ${params.key}`,
        isPublic: true,
        updatedAt: new Date(),
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
