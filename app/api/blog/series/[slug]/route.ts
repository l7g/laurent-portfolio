import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    // Get series with posts
    const series = await prisma.blog_series.findUnique({
      where: { slug },
      include: {
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        blog_posts: {
          where: published === "true" ? { status: "PUBLISHED" } : {},
          orderBy: [{ seriesOrder: "asc" }, { publishedAt: "desc" }],
          include: {
            blog_categories: true,
            users: {
              select: {
                id: true,
                name: true,
              },
            },
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
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    // Transform posts to match component expectations
    const transformedPosts = series.blog_posts.map((post) => ({
      ...post,
      category: post.blog_categories, // Rename for component compatibility
      readingTime: Math.ceil(post.content.split(/\s+/).length / 200), // More accurate reading time calculation (200 words per minute)
    }));

    // Calculate total reading time
    const totalReadingTime = transformedPosts.reduce((total, post) => {
      const wordsPerMinute = 200;
      const words = post.content.split(/\s+/).length;
      return total + Math.ceil(words / wordsPerMinute);
    }, 0);

    const seriesWithMetadata = {
      ...series,
      blog_posts: transformedPosts,
      totalPosts: series.blog_posts.length,
      estimatedTime: totalReadingTime,
    };

    return NextResponse.json(seriesWithMetadata);
  } catch (error) {
    console.error("Error fetching blog series:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog series" },
      { status: 500 },
    );
  }
}
