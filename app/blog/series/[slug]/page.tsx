"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  BookOpenIcon,
  PlayIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { title, subtitle } from "@/components/primitives";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
  seriesOrder?: number;
  tags: string[];
  views: number;
  publishedAt: string;
  author: {
    id: string;
    name: string;
  };
  _count: {
    comments: number;
  };
  readingTime: number;
}

interface BlogSeries {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  color: string;
  icon?: string;
  difficulty?: string;
  tags: string[];
  totalPosts: number;
  estimatedTime: number;
  users: {
    id: string;
    name: string;
  };
  blog_posts: BlogPost[];
  createdAt: string;
  updatedAt: string;
}

export default function SeriesPage() {
  const params = useParams();
  const [series, setSeries] = useState<BlogSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeries();
  }, [params.slug]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/blog/series/${params.slug}?published=true`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("Series not found");
        } else {
          setError("Failed to fetch series");
        }

        return;
      }

      const data = await response.json();

      setSeries(data);
    } catch (error) {
      console.error("Failed to fetch series:", error);
      setError("Failed to fetch series");
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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "danger";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="py-20 px-4 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-content2 rounded w-1/4" />
            <div className="space-y-4">
              <div className="h-12 bg-content2 rounded w-3/4" />
              <div className="h-4 bg-content2 rounded w-1/2" />
              <div className="h-32 bg-content2 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-content2 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
        <div className="py-20 px-4 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Series Not Found</h1>
          <p className="text-default-600 mb-8">{error}</p>
          <Link href="/blog">
            <Button
              color="primary"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
            >
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!series) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button
              className="mb-6"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
              variant="flat"
            >
              Back to Blog
            </Button>
          </Link>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {series.icon && <span className="text-2xl">{series.icon}</span>}
              <h1 className={title({ size: "lg" })}>{series.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar name={series.users.name} size="sm" />
                <span className="text-default-600">{series.users.name}</span>
              </div>

              {series.difficulty && (
                <Chip
                  color={getDifficultyColor(series.difficulty)}
                  size="sm"
                  variant="flat"
                >
                  {series.difficulty}
                </Chip>
              )}

              <Chip color="primary" size="sm" variant="flat">
                {series.totalPosts} posts
              </Chip>

              <div className="flex items-center gap-1 text-sm text-default-600">
                <ClockIcon className="w-4 h-4" />
                {series.estimatedTime} min read
              </div>
            </div>

            {series.description && (
              <p className={subtitle({ class: "mb-6" })}>
                {series.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {series.tags.map((tag) => (
                <Chip
                  key={tag}
                  size="sm"
                  startContent={<TagIcon className="w-3 h-3" />}
                  variant="bordered"
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts List */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <BookOpenIcon className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Posts in this Series</h2>
          </div>

          <div className="space-y-4">
            {series.blog_posts.map((post, index) => (
              <motion.div
                key={post.id}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 group">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Order Number */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: series.color }}
                        >
                          {post.seriesOrder || index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors mb-2">
                              {post.title}
                            </h3>
                            <p className="text-default-600 text-sm line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                          <Chip
                            size="sm"
                            style={{
                              backgroundColor: `${post.category.color}20`,
                              color: post.category.color,
                            }}
                            variant="flat"
                          >
                            {post.category.icon && (
                              <span className="mr-1">{post.category.icon}</span>
                            )}
                            {post.category.name || "Uncategorized"}
                          </Chip>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-default-500">
                            <div className="flex items-center gap-1">
                              <CalendarDaysIcon className="w-4 h-4" />
                              {formatDate(post.publishedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <EyeIcon className="w-4 h-4" />
                              {post.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <ChatBubbleLeftIcon className="w-4 h-4" />
                              {post._count.comments}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {post.readingTime} min
                            </div>
                          </div>

                          <Link href={`/blog/${post.slug}`}>
                            <Button
                              color="primary"
                              endContent={<PlayIcon className="w-4 h-4" />}
                              size="sm"
                              variant="flat"
                            >
                              Read Post
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {series.blog_posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-default-600">
                Posts will be added to this series soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
