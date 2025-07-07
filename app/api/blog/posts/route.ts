import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const series = searchParams.get("series");
    const published = searchParams.get("published");
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause - handle both 'published=true' and 'status=PUBLISHED'
    const where: any = {};

    // Admin can see all posts, public users only see published
    if (isAdmin) {
      if (published === "true" || status === "PUBLISHED") {
        where.status = "PUBLISHED";
      } else if (status) {
        where.status = status as BlogStatus;
      }
      // If admin and no status specified, show all posts
    } else {
      // Public users only see published posts
      where.status = "PUBLISHED";
    }

    if (category) {
      where.blog_categories = {
        slug: category,
      };
    }

    if (series) {
      where.blog_series = {
        slug: series,
      };
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get posts with pagination
    const [posts, totalCount] = await Promise.all([
      prisma.blog_posts.findMany({
        where,
        include: {
          blog_categories: true,
          blog_series: {
            select: {
              id: true,
              title: true,
              slug: true,
              color: true,
              icon: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              blog_comments: true,
            },
          },
        },
        orderBy: [
          { blog_series: { sortOrder: "asc" } },
          { seriesOrder: "asc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.blog_posts.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Transform posts to match component expectations
    const transformedPosts = posts.map((post) => ({
      ...post,
      category: post.blog_categories, // Rename for component compatibility
      series: post.blog_series, // Include series info
      readingTime: Math.ceil(post.content.length / 1000), // Rough reading time calculation
    }));

    return NextResponse.json({
      posts: transformedPosts,
      total: totalCount,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
