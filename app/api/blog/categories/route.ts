import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.blog_categories.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            blog_posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    // Transform the response to use cleaner property names
    const transformedCategories = categories.map((category) => ({
      ...category,
      _count: {
        posts: category._count.blog_posts,
      },
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Error fetching blog categories:", error);

    return NextResponse.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 },
    );
  }
}
