import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    // Get some basic counts to verify data exists
    const [projectCount, blogCount, categoryCount, userCount] =
      await Promise.all([
        prisma.projects.count(),
        prisma.blog_posts.count(),
        prisma.blog_categories.count(),
        prisma.users.count(),
      ]);

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      data: {
        projects: projectCount,
        blogPosts: blogCount,
        categories: categoryCount,
        users: userCount,
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
