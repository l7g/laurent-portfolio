import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const page = await prisma.portfolio_pages.findUnique({
      where: { id: params.id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch page",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const data = await request.json();

    // If this is set as homepage, unset others
    if (data.isHomepage) {
      await prisma.portfolio_pages.updateMany({
        where: {
          isHomepage: true,
          id: { not: params.id },
        },
        data: { isHomepage: false },
      });
    }

    const page = await prisma.portfolio_pages.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished,
        isHomepage: data.isHomepage,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error updating page:", error);

    return NextResponse.json(
      {
        error: "Failed to update page",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;

    await prisma.portfolio_pages.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);

    return NextResponse.json(
      {
        error: "Failed to delete page",
      },
      { status: 500 },
    );
  }
}
