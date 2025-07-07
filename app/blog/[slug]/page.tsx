import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogPostContent from "@/components/blog/blog-post-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await prisma.blog_posts.findUnique({
      where: { slug },
      include: {
        users: {
          select: {
            name: true,
          },
        },
        blog_categories: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The blog post you're looking for doesn't exist.",
      };
    }

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || "";
    const publishedTime = post.publishedAt?.toISOString();
    const modifiedTime = post.updatedAt.toISOString();

    return {
      title,
      description,
      keywords: post.tags.join(", "),
      authors: [{ name: post.users.name || "Anonymous" }],
      category: post.blog_categories.name,
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime,
        modifiedTime,
        authors: [post.users.name || "Anonymous"],
        tags: post.tags,
        images: post.coverImage
          ? [
              {
                url: post.coverImage,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.coverImage ? [post.coverImage] : [],
      },
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "Read our latest blog post.",
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
