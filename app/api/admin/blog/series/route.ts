import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await prisma.blog_series.findMany({
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        _count: {
          select: {
            blog_posts: true,
          },
        },
      },
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching blog series:", error);

    return NextResponse.json(
      { error: "Failed to fetch blog series" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      slug,
      description,
      color = "#8B5CF6",
      icon = "📚",
      difficulty = "Beginner",
      isActive = true,
      tags = [],
      metaTitle,
      metaDescription,
      coverImage,
      estimatedTime,
    } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate slug if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingSeries = await prisma.blog_series.findUnique({
      where: { slug: finalSlug },
    });

    if (existingSeries) {
      return NextResponse.json(
        { error: "A series with this slug already exists" },
        { status: 409 },
      );
    }

    // Calculate the next sortOrder by finding the maximum current sortOrder
    const maxSortOrder = await prisma.blog_series.aggregate({
      _max: {
        sortOrder: true,
      },
    });

    const nextSortOrder = (maxSortOrder._max.sortOrder || 0) + 1;

    const series = await prisma.blog_series.create({
      data: {
        id: randomUUID(),
        title,
        slug: finalSlug,
        description,
        color,
        icon,
        difficulty,
        sortOrder: nextSortOrder,
        isActive,
        tags,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
        coverImage,
        estimatedTime,
        authorId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            blog_posts: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    console.error("Error creating blog series:", error);

    return NextResponse.json(
      { error: "Failed to create blog series" },
      { status: 500 },
    );
  }
}
