import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Like a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Find the comment
    const comment = await prisma.blog_comments.findUnique({
      where: { id },
      select: { id: true, likes: true, isApproved: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Only allow liking approved comments
    if (!comment.isApproved) {
      return NextResponse.json(
        { error: "Comment not approved" },
        { status: 403 },
      );
    }

    // Increment like count
    const updatedComment = await prisma.blog_comments.update({
      where: { id },
      data: {
        likes: comment.likes + 1,
      },
      select: { likes: true },
    });

    return NextResponse.json({ likes: updatedComment.likes });
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 },
    );
  }
}
