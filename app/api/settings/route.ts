import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: {
        key: "asc",
      },
    });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      key,
      value,
      type = "text",
      description,
      isPublic = false,
    } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 },
      );
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value,
        type,
        description,
        isPublic,
        updatedAt: new Date(),
      },
      create: {
        key,
        value,
        type,
        description,
        isPublic,
      },
    });

    return NextResponse.json({ data: setting });
  } catch (error) {
    console.error("Error saving setting:", error);
    return NextResponse.json(
      { error: "Failed to save setting" },
      { status: 500 },
    );
  }
}
