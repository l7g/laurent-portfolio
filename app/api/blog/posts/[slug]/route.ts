import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const post = await prisma.blog_posts.findUnique({
      where: { slug },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        blog_comments: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            blog_comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    // Increment view count
    await prisma.blog_posts.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}
