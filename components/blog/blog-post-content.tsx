"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { title, subtitle } from "@/components/primitives";
import CommentsSystem from "@/components/blog/comments-system";
import SocialShare from "@/components/blog/social-share";
import { canUsePreferences } from "@/lib/consent";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
  tags: string[];
  views: number;
  likes: number;
  publishedAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  comments: any[];
  _count: {
    comments: number;
  };
  metaTitle?: string;
  metaDescription?: string;
}

interface BlogPostContentProps {
  slug: string;
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  // Check localStorage for like status when post is loaded
  useEffect(() => {
    if (post?.id && canUsePreferences()) {
      const hasLiked = localStorage.getItem(`liked_post_${post.id}`) === "true";

      setLiked(hasLiked);
    }
  }, [post?.id]);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${slug}`);

      if (response.ok) {
        const data = await response.json();

        setPost(data);
        setLikeCount(data.likes);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return minutes;
  };

  const handleLike = async () => {
    if (!post) return;

    // Check if user has consented to preferences
    if (!canUsePreferences()) {
      alert(
        "Please accept preferences in the cookie banner to use the like feature.",
      );

      return;
    }

    const action = liked ? "unlike" : "like";
    const previousLiked = liked;
    const previousCount = likeCount;

    try {
      // Optimistically update UI
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

      // Update localStorage immediately
      localStorage.setItem(`liked_post_${post.id}`, (!liked).toString());

      // Add rate limiting - prevent spam clicking
      const lastLikeTime = localStorage.getItem("lastLikeTime");
      const now = Date.now();
      const rateLimitMs = 300; // 300ms rate limit (more reasonable than 1000ms)

      // Safely parse the last like time and check rate limit
      if (lastLikeTime) {
        const lastTime = parseInt(lastLikeTime, 10);

        if (!isNaN(lastTime) && now - lastTime < rateLimitMs) {
          // Too fast, revert and ignore
          setLiked(previousLiked);
          setLikeCount(previousCount);
          localStorage.setItem(
            `liked_post_${post.id}`,
            previousLiked.toString(),
          );

          return;
        }
      }
      localStorage.setItem("lastLikeTime", now.toString());

      // Call API to update server count
      const response = await fetch(`/api/blog/posts/${post.slug}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();

        setLikeCount(data.likes);
      } else {
        // Revert optimistic update on error
        setLiked(previousLiked);
        setLikeCount(previousCount);
        localStorage.setItem(`liked_post_${post.id}`, previousLiked.toString());
        console.error("Failed to save like");
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(previousLiked);
      setLikeCount(previousCount);
      localStorage.setItem(`liked_post_${post.id}`, previousLiked.toString());
      console.error("Error saving like:", error);
    }
  };

  // Utility function to clear all like data (for privacy/debugging)
  const clearAllLikes = () => {
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith("liked_post_") || key === "lastLikeTime") {
        localStorage.removeItem(key);
      }
    });
    console.log("All like data cleared from localStorage");
  };

  // Make it available in browser console for users who want to clear their data
  useEffect(() => {
    (window as any).clearAllLikes = clearAllLikes;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-default-300 rounded w-3/4 mb-4" />
            <div className="h-4 bg-default-300 rounded w-1/2 mb-8" />
            <div className="h-64 bg-default-300 rounded mb-8" />
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-default-300 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <p className="text-default-600 mb-4">
            The blog post you're looking for doesn't exist.
          </p>
          <Link href="/blog">
            <Button color="primary" variant="flat">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/blog">
            <Button
              className="text-default-600 hover:text-default-900"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
              variant="light"
            >
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Post Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {post.category && (
                <Chip
                  size="sm"
                  style={{
                    backgroundColor: `${post.category.color}20`,
                    color: post.category.color,
                  }}
                  variant="flat"
                >
                  <span className="mr-1">{post.category.icon}</span>
                  {post.category.name}
                </Chip>
              )}
              {post.status === "DRAFT" && (
                <Chip color="warning" size="sm" variant="bordered">
                  📝 Draft - Only visible to admin
                </Chip>
              )}
              {post.status === "ARCHIVED" && (
                <Chip color="default" size="sm" variant="bordered">
                  📦 Archived - Only visible to admin
                </Chip>
              )}
            </div>

            <h1 className={title({ size: "lg" })}>{post.title}</h1>

            <p className={subtitle({ class: "text-lg" })}>{post.excerpt}</p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-small text-default-500">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6" name={post.author.name} size="sm" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {getReadingTime(post.content)} min read
              </div>
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                {post.views} views
              </div>
              <div className="flex items-center gap-1">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                {post._count.comments} comments
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  className="text-xs"
                  size="sm"
                  variant="bordered"
                >
                  #{tag}
                </Chip>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Post Content */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardBody className="p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }: any) => (
                      <h1 className="text-3xl font-bold mb-4 text-foreground">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }: any) => (
                      <h2 className="text-2xl font-semibold mb-3 text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }: any) => (
                      <h3 className="text-xl font-semibold mb-3 text-foreground">
                        {children}
                      </h3>
                    ),
                    p: ({ children }: any) => (
                      <p className="mb-4 text-foreground/90 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }: any) => (
                      <ul className="list-disc list-inside mb-4 text-foreground/90">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }: any) => (
                      <ol className="list-decimal list-inside mb-4 text-foreground/90">
                        {children}
                      </ol>
                    ),
                    code: ({ children }: any) => (
                      <code className="bg-default-100 px-2 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }: any) => (
                      <pre className="bg-default-100 p-4 rounded-lg overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }: any) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/80 mb-4">
                        {children}
                      </blockquote>
                    ),
                    img: ({ src, alt }: any) => (
                      <img
                        alt={alt}
                        className="max-w-full h-auto rounded-lg shadow-md mb-4"
                        src={src}
                      />
                    ),
                    a: ({ href, children }: any) => (
                      <a
                        className="text-primary hover:text-primary/80 underline"
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Engagement Actions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <Button
              className="gap-2"
              color="danger"
              startContent={
                liked ? (
                  <HeartIconSolid className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )
              }
              title={liked ? "Unlike this post" : "Like this post"}
              variant={liked ? "solid" : "bordered"}
              onClick={handleLike}
            >
              {likeCount} {liked ? "Liked" : ""}
            </Button>
            <SocialShare
              excerpt={post.excerpt || ""}
              tags={post.tags}
              title={post.title}
              url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
            />
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CommentsSystem postId={post.id} postTitle={post.title} />
        </motion.div>
      </div>

      {/* Structured Data */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            author: {
              "@type": "Person",
              name: post.author.name,
            },
            publisher: {
              "@type": "Organization",
              name: "Laurent Gagné",
              logo: {
                "@type": "ImageObject",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.ico`,
              },
            },
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
            },
          }),
        }}
        type="application/ld+json"
      />
    </div>
  );
}
