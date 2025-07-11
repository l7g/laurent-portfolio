import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Report a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Find the comment
    const comment = await prisma.blog_comments.findUnique({
      where: { id },
      select: { id: true, content: true, author: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // For now, we'll just log the report
    // In a real system, you might want to:
    // - Create a reports table
    // - Send notification to admins
    // - Auto-hide comment after X reports
    console.log(
      `Comment reported: ${comment.id} by ${comment.author}: "${comment.content}"`,
    );

    // You could extend this to create a report record:
    // await prisma.comment_reports.create({
    //   data: {
    //     commentId: id,
    //     reportedAt: new Date(),
    //     // Add more fields as needed
    //   },
    // });

    return NextResponse.json({ message: "Comment reported successfully" });
  } catch (error) {
    console.error("Error reporting comment:", error);
    return NextResponse.json(
      { error: "Failed to report comment" },
      { status: 500 },
    );
  }
}
