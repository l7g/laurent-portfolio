"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  readingTime: number;
  category: {
    name: string;
    color: string;
  };
  tags: string[];
}

interface BlogWidgetProps {
  title?: string;
  subtitle?: string;
  postCount?: number;
  showCategories?: boolean;
  showReadTime?: boolean;
  showTags?: boolean;
  layout?: "grid" | "list";
  className?: string;
}

const BlogWidget = ({
  title = "Latest Insights",
  subtitle = "Tech development meets international relations",
  postCount = 3,
  showCategories = true,
  showReadTime = true,
  showTags = false,
  layout = "grid",
  className = "",
}: BlogWidgetProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const response = await fetch(
          `/api/blog/posts?limit=${postCount}&published=true`,
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
          setTotalPosts(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, [postCount]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap: { [key: string]: string } = {
      Tech: "primary",
      Development: "primary",
      "International Relations": "success",
      IR: "success",
      Career: "warning",
      Personal: "secondary",
    };
    return colorMap[categoryName] || "default";
  };

  if (loading) {
    return (
      <section className={`py-16 ${className}`} id="blog">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-default-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-default-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(postCount)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <CardBody className="p-6">
                    <div className="h-4 bg-default-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-default-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-default-200 rounded w-2/3"></div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts.length) {
    return null; // Don't show widget if no posts
  }

  return (
    <section className={`py-16 bg-default-50/50 ${className}`} id="blog">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title} <span className="text-primary">& Thoughts</span>
          </h2>
          <p className="text-lg text-default-600 max-w-2xl mx-auto mb-4">
            {subtitle}
          </p>
          {totalPosts > 0 && (
            <div className="flex items-center justify-center gap-4 text-sm text-default-500">
              <span>{totalPosts} articles published</span>
              <span className="w-1 h-1 bg-default-400 rounded-full"></span>
              <span>Regular updates</span>
            </div>
          )}
        </motion.div>

        <div
          className={`grid gap-6 mb-8 ${layout === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "max-w-4xl mx-auto"}`}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {showCategories && post.category && (
                        <Chip
                          color={getCategoryColor(post.category.name) as any}
                          size="sm"
                          variant="flat"
                        >
                          {post.category.name}
                        </Chip>
                      )}
                      <div className="flex items-center gap-3 text-xs text-default-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </div>
                        {showReadTime && (
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {post.readingTime}m read
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-default-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {showTags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            size="sm"
                            variant="bordered"
                            className="text-xs"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    )}

                    <Button
                      variant="light"
                      color="primary"
                      size="sm"
                      endContent={<ArrowRightIcon className="w-3 h-3" />}
                      className="p-0 h-auto font-medium"
                    >
                      Read more
                    </Button>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Link href="/blog">
            <Button
              color="primary"
              variant="bordered"
              size="lg"
              endContent={<ArrowRightIcon className="w-4 h-4" />}
            >
              View All Articles
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogWidget;
