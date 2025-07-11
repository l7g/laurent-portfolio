import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// GET - Fetch related articles for a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    // First, find the post by slug to get its ID
    const currentPost = await prisma.blog_posts.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get all related articles (both directions)
    const relations = await prisma.blog_post_relations.findMany({
      where: {
        OR: [
          { sourcePostId: currentPost.id },
          { targetPostId: currentPost.id },
        ],
      },
    });

    // Get the IDs of related posts
    const relatedPostIds = relations.map((relation) =>
      relation.sourcePostId === currentPost.id
        ? relation.targetPostId
        : relation.sourcePostId,
    );

    // Fetch the actual post data for related posts
    const relatedPostsData = await prisma.blog_posts.findMany({
      where: {
        id: { in: relatedPostIds },
      },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Extract related posts and filter based on admin status
    const relatedPosts = relatedPostsData
      .map((relatedPost) => {
        const relation = relations.find(
          (r) =>
            r.sourcePostId === relatedPost.id ||
            r.targetPostId === relatedPost.id,
        );

        return {
          id: relatedPost.id,
          title: relatedPost.title,
          slug: relatedPost.slug,
          excerpt: relatedPost.excerpt,
          status: relatedPost.status,
          coverImage: relatedPost.coverImage,
          category: relatedPost.blog_categories,
          author: relatedPost.users,
          publishedAt: relatedPost.publishedAt,
          relationType: relation?.relationType || "related",
          relationId: relation?.id,
        };
      })
      .filter((post) => {
        // Filter based on admin status - only show published posts to non-admin users
        return isAdmin || post.status === "PUBLISHED";
      });

    return NextResponse.json(relatedPosts);
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch related articles" },
      { status: 500 },
    );
  }
}

// POST - Add a related article
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const { targetPostId, relationType = "related" } = await request.json();

    // First, find the source post by slug
    const sourcePost = await prisma.blog_posts.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!sourcePost) {
      return NextResponse.json(
        { error: "Source post not found" },
        { status: 404 },
      );
    }

    // Validate that target post exists
    const targetPost = await prisma.blog_posts.findUnique({
      where: { id: targetPostId },
    });

    if (!targetPost) {
      return NextResponse.json(
        { error: "Target post not found" },
        { status: 404 },
      );
    }

    // Prevent self-referencing
    if (sourcePost.id === targetPostId) {
      return NextResponse.json(
        { error: "Cannot relate a post to itself" },
        { status: 400 },
      );
    }

    // Check if relation already exists (in either direction)
    const existingRelation = await prisma.blog_post_relations.findFirst({
      where: {
        OR: [
          { sourcePostId: sourcePost.id, targetPostId },
          { sourcePostId: targetPostId, targetPostId: sourcePost.id },
        ],
      },
    });

    if (existingRelation) {
      return NextResponse.json(
        { error: "Relation already exists" },
        { status: 400 },
      );
    }

    // Create the relation
    const relation = await prisma.blog_post_relations.create({
      data: {
        id: crypto.randomUUID(),
        sourcePostId: sourcePost.id,
        targetPostId: targetPostId,
        relationType: relationType,
        createdBy: session.user.id,
        createdAt: new Date(),
      },
    });

    // Fetch the target post separately for the response
    const relatedTargetPost = await prisma.blog_posts.findUnique({
      where: { id: targetPostId },
      include: {
        blog_categories: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!relatedTargetPost) {
      return NextResponse.json(
        { error: "Target post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: relatedTargetPost.id,
      title: relatedTargetPost.title,
      slug: relatedTargetPost.slug,
      excerpt: relatedTargetPost.excerpt,
      status: relatedTargetPost.status,
      coverImage: relatedTargetPost.coverImage,
      category: relatedTargetPost.blog_categories,
      author: relatedTargetPost.users,
      publishedAt: relatedTargetPost.publishedAt,
      relationType: relation.relationType,
      relationId: relation.id,
    });
  } catch (error) {
    console.error("Error adding related article:", error);
    return NextResponse.json(
      { error: "Failed to add related article" },
      { status: 500 },
    );
  }
}

// DELETE - Remove a related article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { relationId } = await request.json();

    await prisma.blog_post_relations.delete({
      where: { id: relationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing related article:", error);
    return NextResponse.json(
      { error: "Failed to remove related article" },
      { status: 500 },
    );
  }
}
