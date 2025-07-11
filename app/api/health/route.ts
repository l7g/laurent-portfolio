import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection with a simple query that doesn't use prepared statements
    await prisma.$executeRaw`SELECT 1`;

    // Get counts for tables that are actually created and populated by deployment
    const [userCount, settingsCount, categoryCount, skillsCount] =
      await Promise.all([
        prisma.users.count().catch(() => 0),
        prisma.site_settings.count().catch(() => 0),
        prisma.blog_categories.count().catch(() => 0),
        prisma.skills.count().catch(() => 0),
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
      connection_test: "successful",
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
