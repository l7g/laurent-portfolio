import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    // Get counts for tables that are actually created and populated by deployment
    const [userCount, settingsCount, categoryCount, skillsCount] =
      await Promise.all([
        prisma.users.count(),
        prisma.site_settings.count(),
        prisma.blog_categories.count(),
        prisma.skills.count(),
      ]);

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      data: {
        users: userCount,
        siteSettings: settingsCount,
        blogCategories: categoryCount,
        skills: skillsCount,
      },
      connection_test: result,
    });
  } catch (error: any) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          code: error.code,
          type: error.constructor.name,
        },
      },
      { status: 500 },
    );
  }
}
