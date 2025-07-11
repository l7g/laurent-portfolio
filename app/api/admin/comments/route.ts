import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "pending", "approved", "all"
    const postId = searchParams.get("postId");

    // Build query filters
    const where: any = {};

    if (status === "pending") {
      where.isApproved = false;
    } else if (status === "approved") {
      where.isApproved = true;
    }

    if (postId) {
      where.postId = postId;
    }

    // Get comments with post information
    const comments = await prisma.blog_comments.findMany({
      where,
      include: {
        blog_posts: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get summary stats
    const stats = await prisma.blog_comments.groupBy({
      by: ["isApproved"],
      _count: {
        id: true,
      },
    });

    const summary = {
      total: stats.reduce((sum, stat) => sum + stat._count.id, 0),
      approved: stats.find((s) => s.isApproved === true)?._count.id || 0,
      pending: stats.find((s) => s.isApproved === false)?._count.id || 0,
    };

    return NextResponse.json({
      comments,
      summary,
    });
  } catch (error) {
    console.error("Error fetching admin comments:", error);

    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId, action } = await request.json();

    if (!commentId || !action) {
      return NextResponse.json(
        { error: "Comment ID and action are required" },
        { status: 400 },
      );
    }

    let updateData: any = {};

    switch (action) {
      case "approve":
        updateData.isApproved = true;
        break;
      case "reject":
        updateData.isApproved = false;
        break;
      case "delete":
        // For delete, we'll actually delete the comment
        await prisma.blog_comments.delete({
          where: { id: commentId },
        });

        return NextResponse.json({ success: true, action: "deleted" });
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: approve, reject, or delete" },
          { status: 400 },
        );
    }

    const updatedComment = await prisma.blog_comments.update({
      where: { id: commentId },
      data: updateData,
      include: {
        blog_posts: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      action,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);

    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 },
    );
  }
}
