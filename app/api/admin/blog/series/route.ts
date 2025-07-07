import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await prisma.blog_series.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
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

    const data = await request.json();
    const {
      title,
      slug,
      description,
      coverImage,
      color,
      icon,
      difficulty,
      tags,
      metaTitle,
      metaDescription,
    } = data;

    // Check if slug already exists
    const existingSeries = await prisma.blog_series.findUnique({
      where: { slug },
    });

    if (existingSeries) {
      return NextResponse.json(
        { error: "Series with this slug already exists" },
        { status: 400 },
      );
    }

    // Get the highest sort order
    const lastSeries = await prisma.blog_series.findFirst({
      orderBy: { sortOrder: "desc" },
    });

    const series = await prisma.blog_series.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug,
        description,
        coverImage,
        color: color || "#3B82F6",
        icon,
        difficulty,
        tags: tags || [],
        metaTitle,
        metaDescription,
        authorId: session.user.id,
        sortOrder: (lastSeries?.sortOrder || 0) + 1,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error creating blog series:", error);
    return NextResponse.json(
      { error: "Failed to create blog series" },
      { status: 500 },
    );
  }
}
