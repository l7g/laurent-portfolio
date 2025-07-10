import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Check if slug is a UUID (post ID) or actual slug
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug,
      );

    let post;
    if (isUUID) {
      // Find by ID
      post = await prisma.blog_posts.findUnique({
        where: { id: slug },
        select: { id: true },
      });
    } else {
      // Find by slug
      post = await prisma.blog_posts.findUnique({
        where: { slug },
        select: { id: true },
      });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get approved comments for the post
    const comments = await prisma.blog_comments.findMany({
      where: {
        postId: post.id,
        isApproved: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { content, author, email, website } = await request.json();
    const { slug } = await params;

    if (!content?.trim() || !author?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Content, author, and email are required" },
        { status: 400 },
      );
    }

    // Check if slug is a UUID (post ID) or actual slug
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slug,
      );

    let post;
    if (isUUID) {
      // Find by ID
      post = await prisma.blog_posts.findUnique({
        where: { id: slug },
        select: { id: true },
      });
    } else {
      // Find by slug
      post = await prisma.blog_posts.findUnique({
        where: { slug },
        select: { id: true },
      });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Content length validation
    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment too long (max 1000 characters)" },
        { status: 400 },
      );
    }

    // Simple spam detection
    const spamWords = ["viagra", "casino", "lottery", "winner", "prize"];
    const hasSpam = spamWords.some(
      (word) =>
        content.toLowerCase().includes(word) ||
        author.toLowerCase().includes(word),
    );

    const comment = await prisma.blog_comments.create({
      data: {
        id: crypto.randomUUID(),
        content: content.trim(),
        author: author.trim(),
        email: email.trim(),
        website: website?.trim() || null,
        postId: post.id,
        isApproved: !hasSpam, // Auto-approve if no spam detected
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
