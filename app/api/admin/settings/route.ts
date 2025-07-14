import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { siteConfig } from "@/config/site";

// GET - Fetch current settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return settings from site config for now
    const settings = {
      name: siteConfig.name,
      description: siteConfig.description,
      mission: siteConfig.mission,
      vision: siteConfig.vision,
      contactEmail: siteConfig.emailConfig.contactEmail,
      githubUrl: siteConfig.links.github,
      linkedinUrl: siteConfig.links.linkedin,
      cvFileName: "Laurent_Cv.pdf", // From the navMenuItems
      emailSignature: siteConfig.emailConfig.signature,
      responseTime: siteConfig.emailConfig.responseTime,
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// POST - Update settings (for now, just return success)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // For now, just return the updated settings
    // TODO: Implement actual persistence to database or file
    console.log("Settings update request:", body);

    return NextResponse.json({
      ...body,
      message:
        "Settings updated successfully (Note: Changes are temporary until database integration is complete)",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
