import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate that user ID exists in session
    if (!session.user?.id) {
      return NextResponse.json(
        { error: "Invalid session. Please log in again." },
        { status: 401 },
      );
    }

    const {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      seriesId,
      seriesOrder,
      tags,
      status = "DRAFT",
      metaTitle,
      metaDescription,
      coverImage,
    } = await request.json();

    // Validate required fields
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 },
      );
    }

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
        { error: "A post with this slug already exists" },
        { status: 409 },
      );
    }

    // Use the already validated session.user.id directly
    const authorId = session.user.id;

    // Create the post
    const post = await prisma.blog_posts.create({
      data: {
        id: randomUUID(),
        title,
        slug: finalSlug,
        excerpt,
        content,
        status,
        categoryId,
        seriesId: seriesId || null,
        seriesOrder: seriesOrder || null,
        tags: tags || [],
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        coverImage,
        authorId: authorId,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        createdAt: new Date(),
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
        blog_series: {
          select: {
            id: true,
            title: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate that user ID exists in session
    if (!session.user?.id) {
      return NextResponse.json(
        { error: "Invalid session. Please log in again." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, totalCount] = await Promise.all([
      prisma.blog_posts.findMany({
        where,
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
          // blog_series: {
          //   select: {
          //     id: true,
          //     title: true,
          //     slug: true,
          //     color: true,
          //     icon: true,
          //   },
          // },
          _count: {
            select: {
              blog_comments: true,
            },
          },
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.blog_posts.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Transform posts to match frontend expectations
    const transformedPosts = posts.map((post) => ({
      ...post,
      author: post.users, // Transform users to author
      category: post.blog_categories, // Transform blog_categories to category
    }));

    return NextResponse.json({
      posts: transformedPosts,
      total: totalCount,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
