import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the original post
    const originalPost = await prisma.blog_posts.findUnique({
      where: { id: params.id },
    });

    if (!originalPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create a unique slug for the duplicate
    const baseSlug = originalPost.slug + "-copy";
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (
      await prisma.blog_posts.findUnique({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the duplicate post
    const duplicatePost = await prisma.blog_posts.create({
      data: {
        id: crypto.randomUUID(),
        title: originalPost.title + " (Copy)",
        slug: uniqueSlug,
        excerpt: originalPost.excerpt,
        content: originalPost.content,
        categoryId: originalPost.categoryId,
        tags: originalPost.tags,
        status: "DRAFT", // Always create duplicates as drafts
        metaTitle: originalPost.metaTitle,
        metaDescription: originalPost.metaDescription,
        authorId: session.user.id,
        publishedAt: null,
        updatedAt: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        blog_categories: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
        _count: {
          select: {
            blog_comments: true,
          },
        },
      },
    });

    return NextResponse.json(duplicatePost);
  } catch (error) {
    console.error("Error duplicating post:", error);
    return NextResponse.json(
      { error: "Failed to duplicate post" },
      { status: 500 },
    );
  }
}
