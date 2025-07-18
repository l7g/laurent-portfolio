import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await params;
    const setting = await prisma.site_settings.findUnique({
      where: { key },
    });

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json({ data: setting });
  } catch (error) {
    console.error("Error fetching setting:", error);

    return NextResponse.json(
      { error: "Failed to fetch setting" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await params;
    const { value, type, description, isPublic } = await request.json();

    if (value === undefined) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
    }

    // Use upsert to either update existing or create new setting
    const setting = await prisma.site_settings.upsert({
      where: { key },
      update: {
        value,
        type: type || "text",
        description,
        isPublic: isPublic !== undefined ? isPublic : false,
        updatedAt: new Date(),
      },
      create: {
        id: `setting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        key,
        value,
        type: type || "text",
        description: description || `Setting for ${key}`,
        isPublic: isPublic !== undefined ? isPublic : false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data: setting });
  } catch (error) {
    console.error("Error updating setting:", error);

    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await params;

    await prisma.site_settings.delete({
      where: { key },
    });

    return NextResponse.json({ message: "Setting deleted successfully" });
  } catch (error) {
    console.error("Error deleting setting:", error);

    return NextResponse.json(
      { error: "Failed to delete setting" },
      { status: 500 },
    );
  }
}
