import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { isPublic: true },
      select: {
        key: true,
        value: true,
        type: true,
      },
    });

    // Convert to key-value object for easier access
    const settingsObject = settings.reduce(
      (acc, setting) => {
        let value = setting.value;

        // Parse JSON if type is json
        if (setting.type === "json") {
          try {
            value = JSON.parse(setting.value);
          } catch (e) {
            console.warn(`Failed to parse JSON for setting ${setting.key}:`, e);
          }
        }

        acc[setting.key] = value;
        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, type = "text", description, isPublic = false } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 },
      );
    }

    // Convert value to string for storage
    const stringValue = type === "json" ? JSON.stringify(value) : String(value);

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
        description,
        isPublic,
      },
      create: {
        key,
        value: stringValue,
        type,
        description,
        isPublic,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Failed to update site setting:", error);
    return NextResponse.json(
      { error: "Failed to update site setting" },
      { status: 500 },
    );
  }
}
