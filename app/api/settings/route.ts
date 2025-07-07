import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.site_settings.findMany({
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
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const setting = await prisma.site_settings.upsert({
      where: { key },
      update: {
        value,
        type,
        description,
        isPublic,
        updatedAt: new Date(),
      },
      create: {
        id: randomUUID(),
        key,
        value,
        type,
        description,
        isPublic,
        updatedAt: new Date(),
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const id = searchParams.get("id");

    if (!key && !id) {
      return NextResponse.json(
        { error: "Key or ID is required" },
        { status: 400 },
      );
    }

    let setting;
    try {
      if (key) {
        setting = await prisma.site_settings.delete({
          where: { key },
        });
      } else if (id) {
        setting = await prisma.site_settings.delete({
          where: { id },
        });
      }
    } catch (error: any) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error: `Setting not found with ${key ? "key" : "id"}: ${key || id}`,
          },
          { status: 404 },
        );
      }
      throw error;
    }

    return NextResponse.json({ data: setting });
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { error: "Failed to delete setting" },
      { status: 500 },
    );
  }
}
