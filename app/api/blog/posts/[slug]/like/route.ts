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

    // For now, we'll increment the like count
    // In a more sophisticated system, you'd track individual user likes
    const updatedPost = await prisma.blog_posts.update({
      where: { id: post.id },
      data: {
        likes: post.likes + 1,
      },
      select: { likes: true },
    });

    return NextResponse.json({ likes: updatedPost.likes });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 },
    );
  }
}
