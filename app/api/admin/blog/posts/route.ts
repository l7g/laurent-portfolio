import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.blog_posts.findMany({
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
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      status: post.status,
      category: {
        id: post.blog_categories.id,
        name: post.blog_categories.name,
        color: post.blog_categories.color,
        icon: post.blog_categories.icon,
      },
      tags: post.tags,
      views: post.views,
      likes: post.likes,
      publishedAt: post.publishedAt?.toISOString() || null,
      updatedAt: post.updatedAt.toISOString(),
      author: {
        id: post.users.id,
        name: post.users.name || "",
        email: post.users.email || "",
      },
      _count: {
        comments: post._count.blog_comments,
      },
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      tags,
      status,
      metaTitle,
      metaDescription,
    } = data;

    // Generate slug if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingPost = await prisma.blog_posts.findUnique({
      where: { slug: finalSlug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 },
      );
    }

    const post = await prisma.blog_posts.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug: finalSlug,
        excerpt,
        content,
        categoryId,
        tags,
        status,
        metaTitle,
        metaDescription,
        authorId: session.user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
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

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
