import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Toggle like on a blog post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { action } = await request.json(); // 'like' or 'unlike'
    const session = await getServerSession(authOptions);

    // Find the post
    const post = await prisma.blog_posts.findUnique({
      where: { slug },
      select: { id: true, likes: true, status: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if post is published (unless user is admin)
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin && post.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Calculate new like count based on action
    let newLikeCount;

    if (action === "unlike") {
      // Prevent negative likes
      newLikeCount = Math.max(0, post.likes - 1);
    } else {
      // Default to like action
      newLikeCount = post.likes + 1;
    }

    const updatedPost = await prisma.blog_posts.update({
      where: { id: post.id },
      data: {
        likes: newLikeCount,
      },
      select: { likes: true },
    });

    return NextResponse.json({
      likes: updatedPost.likes,
      action: action || "like",
    });
  } catch (error) {
    console.error("Error handling like:", error);

    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 },
    );
  }
}
