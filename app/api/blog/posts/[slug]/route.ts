import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

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

    // Check if post is published or user is admin
    if (post.status !== "PUBLISHED" && !isAdmin) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    // Only increment view count in production and for non-admin users
    const isDevelopment = process.env.NODE_ENV === "development";

    if (!isDevelopment && !isAdmin) {
      await prisma.blog_posts.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    }

    // Transform the response to match expected interface
    const transformedPost = {
      ...post,
      category: post.blog_categories
        ? {
            id: post.blog_categories.id,
            name: post.blog_categories.name,
            slug: post.blog_categories.slug,
            color: post.blog_categories.color,
            icon: post.blog_categories.icon,
          }
        : null,
      author: {
        id: post.users.id,
        name: post.users.name,
        email: post.users.email,
      },
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      createdAt: post.createdAt.toISOString(),
      // Remove the raw database fields
      blog_categories: undefined,
      users: undefined,
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);

    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    // First find the post by slug to get the ID
    const existingPost = await prisma.blog_posts.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    // Update the post
    const updatedPost = await prisma.blog_posts.update({
      where: { id: existingPost.id },
      data: {
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.title && { title: body.title }),
        ...(body.excerpt && { excerpt: body.excerpt }),
        ...(body.content && { content: body.content }),
        ...(body.status && { status: body.status }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.tags && { tags: body.tags }),
        updatedAt: new Date(),
      },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}
