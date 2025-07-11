import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const published = searchParams.get("published");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Admin can see all series, public users only see active ones
    if (!isAdmin) {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Only show series with published posts if published=true
    if (published === "true") {
      where.blog_posts = {
        some: {
          status: "PUBLISHED",
        },
      };
    }

    // Get series with pagination
    const [series, totalCount] = await Promise.all([
      prisma.blog_series.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
          blog_posts: {
            where: published === "true" ? { status: "PUBLISHED" } : {},
            orderBy: { seriesOrder: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              coverImage: true,
              publishedAt: true,
              seriesOrder: true,
              views: true,
              likes: true,
              tags: true,
              _count: {
                select: {
                  blog_comments: true,
                },
              },
            },
          },
          _count: {
            select: {
              blog_posts: true,
            },
          },
        },
      }),
      prisma.blog_series.count({ where }),
    ]);

    // Calculate total reading time and update post counts
    const seriesWithMetadata = series.map((s) => ({
      ...s,
      totalPosts: s.blog_posts.length,
      estimatedTime: s.blog_posts.reduce((total, post) => {
        // Estimate reading time based on excerpt or use default
        const wordsPerMinute = 200;
        const excerptWords = post.excerpt
          ? post.excerpt.split(/\s+/).length
          : 50;
        const estimatedWords = excerptWords * 8; // Estimate full content is 8x the excerpt length

        return total + Math.ceil(estimatedWords / wordsPerMinute);
      }, 0),
      // Transform _count to use cleaner property names
      _count: {
        posts: s._count.blog_posts,
      },
    }));

    return NextResponse.json({
      series: seriesWithMetadata,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching blog series:", error);

    return NextResponse.json(
      { error: "Failed to fetch blog series" },
      { status: 500 },
    );
  }
}
