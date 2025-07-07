import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.blog_posts.findUnique({
      where: { id },
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
            difficulty: true,
            _count: {
              select: {
                blog_posts: true,
              },
            },
          },
        },
        _count: {
          select: {
            blog_comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const updateData: any = { ...data, updatedAt: new Date() };

    // If status is being changed to PUBLISHED and publishedAt is null, set it
    if (data.status === "PUBLISHED") {
      const currentPost = await prisma.blog_posts.findUnique({
        where: { id: params.id },
        select: { publishedAt: true },
      });

      if (!currentPost?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blog_posts.update({
      where: { id: params.id },
      data: updateData,
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
            difficulty: true,
            _count: {
              select: {
                blog_posts: true,
              },
            },
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
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
      seriesId,
      seriesOrder,
      tags,
      status,
      metaTitle,
      metaDescription,
    } = data;

    // Check if post exists
    const existingPost = await prisma.blog_posts.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if slug already exists (excluding current post)
    if (slug !== existingPost.slug) {
      const slugExists = await prisma.blog_posts.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Post with this slug already exists" },
          { status: 400 },
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      tags: tags || [],
      status,
      metaTitle,
      metaDescription,
      updatedAt: new Date(),
    };

    // Handle series assignment
    if (seriesId && seriesId !== "") {
      updateData.seriesId = seriesId;
      updateData.seriesOrder = seriesOrder || 1;
    } else {
      updateData.seriesId = null;
      updateData.seriesOrder = null;
    }

    // Set publishedAt if status is PUBLISHED and it wasn't published before
    if (status === "PUBLISHED" && existingPost.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    const post = await prisma.blog_posts.update({
      where: { id: params.id },
      data: updateData,
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
            difficulty: true,
            _count: {
              select: {
                blog_posts: true,
              },
            },
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
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete associated comments first (if CASCADE is not working)
    await prisma.blog_comments.deleteMany({
      where: { postId: params.id },
    });

    // Delete the post
    await prisma.blog_posts.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
