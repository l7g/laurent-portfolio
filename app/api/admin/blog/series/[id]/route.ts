import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await prisma.blog_series.findUnique({
      where: { id: params.id },
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

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching blog series:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog series" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
      estimatedTime,
      tags,
      metaTitle,
      metaDescription,
    } = data;

    // Check if series exists
    const existingSeries = await prisma.blog_series.findUnique({
      where: { id: params.id },
    });

    if (!existingSeries) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    // Check if slug already exists (excluding current series)
    if (slug !== existingSeries.slug) {
      const slugExists = await prisma.blog_series.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Series with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const series = await prisma.blog_series.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        description,
        coverImage,
        color: color || "#3B82F6",
        icon,
        difficulty,
        estimatedTime: estimatedTime || null,
        tags: tags || [],
        metaTitle,
        metaDescription,
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

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error updating blog series:", error);
    return NextResponse.json(
      { error: "Failed to update blog series" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if series exists
    const existingSeries = await prisma.blog_series.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            blog_posts: true,
          },
        },
      },
    });

    if (!existingSeries) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    // Check if series has posts
    if (existingSeries._count.blog_posts > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete series with existing posts. Please remove all posts from this series first.",
        },
        { status: 400 },
      );
    }

    await prisma.blog_series.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Series deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog series:", error);
    return NextResponse.json(
      { error: "Failed to delete blog series" },
      { status: 500 },
    );
  }
}
