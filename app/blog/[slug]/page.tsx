"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
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
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { title, subtitle } from "@/components/primitives";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
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

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

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

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // TODO: Implement actual like functionality with API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-default-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-default-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-default-300 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-default-300 rounded w-full"
                ></div>
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/blog">
            <Button
              variant="light"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
              className="text-default-600 hover:text-default-900"
            >
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Post Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Chip
                size="sm"
                variant="flat"
                style={{
                  backgroundColor: `${post.category.color}20`,
                  color: post.category.color,
                }}
              >
                <span className="mr-1">{post.category.icon}</span>
                {post.category.name}
              </Chip>
            </div>

            <h1 className={title({ size: "lg" })}>{post.title}</h1>

            <p className={subtitle({ class: "text-lg" })}>{post.excerpt}</p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-small text-default-500">
              <div className="flex items-center gap-2">
                <Avatar size="sm" name={post.author.name} className="w-6 h-6" />
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
                  size="sm"
                  variant="bordered"
                  className="text-xs"
                >
                  #{tag}
                </Chip>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant={liked ? "solid" : "bordered"}
              color="danger"
              startContent={
                liked ? (
                  <HeartIconSolid className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )
              }
              onClick={handleLike}
              className="gap-2"
            >
              {likeCount}
            </Button>
            <Button
              variant="bordered"
              startContent={<ShareIcon className="w-4 h-4" />}
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Comments ({post._count.comments})
              </h3>
            </CardHeader>
            <CardBody>
              <div className="text-center py-8 text-default-500">
                <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>
                  Comments coming soon! In the meantime, feel free to reach out
                  through the contact form.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
