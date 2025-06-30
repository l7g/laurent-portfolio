import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        isPublic: true,
      },
      select: {
        key: true,
        value: true,
        type: true,
      },
      orderBy: {
        key: "asc",
      },
    });

    // Convert to key-value object for easier consumption
    const settingsMap = settings.reduce(
      (acc, setting) => {
        let value: any = setting.value;

        // Parse value based on type
        if (setting.type === "boolean") {
          value = setting.value === "true";
        } else if (setting.type === "number") {
          value = parseFloat(setting.value);
        } else if (setting.type === "json") {
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
        }

        acc[setting.key] = value;
        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json(
      { data: settingsMap },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch public settings" },
      { status: 500 },
    );
  }
}
