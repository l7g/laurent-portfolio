import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const pages = await prisma.portfolio_pages.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch pages",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // If this is set as homepage, unset others
    if (data.isHomepage) {
      await prisma.portfolio_pages.updateMany({
        where: { isHomepage: true },
        data: { isHomepage: false },
      });
    }

    const page = await prisma.portfolio_pages.create({
      data: {
        id: randomUUID(),
        slug: data.slug,
        title: data.title,
        description: data.description,
        content: data.content || {},
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished || false,
        isHomepage: data.isHomepage || false,
        sortOrder: data.sortOrder || 0,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      {
        error: "Failed to create page",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
