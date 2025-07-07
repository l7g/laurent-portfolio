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
  BookOpenIcon,
  SparklesIcon,
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
  layout?: "grid" | "list" | "masonry";
  className?: string;
  // New responsive props
  mobileLayout?: "stack" | "card";
  showViewAllButton?: boolean;
  compactMode?: boolean;
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
  mobileLayout = "card",
  showViewAllButton = true,
  compactMode = false,
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
      Technology: "primary",
      Development: "primary",
      Programming: "primary",
      "International Relations": "success",
      IR: "success",
      Politics: "success",
      Diplomacy: "success",
      Career: "warning",
      Professional: "warning",
      Personal: "secondary",
      Lifestyle: "secondary",
      Tutorial: "danger",
      Guide: "danger",
      News: "default",
      Opinion: "default",
    };
    return colorMap[categoryName] || "default";
  };

  if (loading) {
    return (
      <section className={`py-12 sm:py-16 lg:py-20 ${className}`} id="blog">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <div className="animate-pulse">
              <div className="h-8 sm:h-10 bg-gradient-to-r from-default-200 to-default-100 rounded-xl w-64 sm:w-80 mx-auto mb-4 sm:mb-6"></div>
              <div className="h-4 sm:h-6 bg-gradient-to-r from-default-200 to-default-100 rounded-lg w-72 sm:w-96 mx-auto mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gradient-to-r from-default-200 to-default-100 rounded w-48 sm:w-64 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[...Array(postCount)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-full bg-content1">
                  <CardBody className="p-6 sm:p-7 lg:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="h-5 sm:h-6 bg-gradient-to-r from-default-200 to-default-100 rounded-full w-20 sm:w-24"></div>
                      <div className="h-3 sm:h-4 bg-gradient-to-r from-default-200 to-default-100 rounded w-16 sm:w-20"></div>
                    </div>
                    <div className="h-6 sm:h-7 bg-gradient-to-r from-default-200 to-default-100 rounded-lg w-full mb-3 sm:mb-4"></div>
                    <div className="h-4 bg-gradient-to-r from-default-200 to-default-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-default-200 to-default-100 rounded w-4/5 mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-default-200 to-default-100 rounded w-3/5 mb-4"></div>
                    <div className="h-4 bg-gradient-to-r from-default-200 to-default-100 rounded w-24"></div>
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
    return (
      <section className={`py-12 sm:py-16 lg:py-20 ${className}`} id="blog">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                Blog Coming Soon
              </h2>
              <p className="text-base sm:text-lg text-default-600 mb-4 sm:mb-6 px-4 leading-relaxed">
                I'm working on some exciting articles about tech development and
                international relations.
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm text-default-500">
                <SparklesIcon className="w-4 h-4" />
                <span>Stay tuned for regular updates</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-12 sm:py-16 lg:py-20 bg-background ${className}`}
      id="blog"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          className="text-center mb-12 sm:mb-14 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Latest Content</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground px-4">
            {title} <span className="text-primary">& Thoughts</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-default-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            {subtitle}
          </p>
          {totalPosts > 0 && (
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-default-500 bg-content2 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mx-4 shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {totalPosts} articles published
                </span>
              </div>
              <span className="w-1 h-1 bg-default-400 dark:bg-default-500 rounded-full hidden sm:block"></span>
              <span className="hidden sm:inline">Regular updates</span>
            </div>
          )}
        </motion.div>

        <div
          className={`grid gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-10 lg:mb-12 ${
            layout === "grid"
              ? compactMode
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
              : layout === "masonry"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max"
                : "grid-cols-1 max-w-5xl mx-auto"
          } ${mobileLayout === "stack" ? "sm:grid-cols-1" : ""}`}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group h-full"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card className="h-full transition-all duration-300 cursor-pointer bg-content1 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 overflow-hidden group-hover:shadow-primary/20">
                  <CardBody
                    className={`${compactMode ? "p-5 sm:p-6" : "p-6 sm:p-7 lg:p-8"} h-full flex flex-col`}
                  >
                    <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3 flex-wrap">
                      {showCategories && post.category && (
                        <Chip
                          color={getCategoryColor(post.category.name) as any}
                          size="sm"
                          variant="flat"
                          className="font-medium px-3 py-1.5 text-xs sm:text-sm flex-shrink-0 dark:text-white"
                        >
                          {post.category.name}
                        </Chip>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-default-500 dark:text-default-400 flex-wrap justify-end">
                        <div className="flex items-center gap-1.5 bg-content2 px-2.5 py-1 rounded-full">
                          <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="hidden sm:inline whitespace-nowrap">
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="sm:hidden whitespace-nowrap">
                            {formatDate(post.publishedAt).split(" ")[0]}
                          </span>
                        </div>
                        {showReadTime && (
                          <div className="flex items-center gap-1.5 bg-content2 px-2.5 py-1 rounded-full">
                            <ClockIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {post.readingTime}m
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300 leading-tight text-foreground line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm sm:text-base text-default-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      {showTags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              size="sm"
                              variant="bordered"
                              className="text-xs border-default-200 dark:border-default-600 hover:border-primary dark:hover:border-primary transition-colors dark:text-default-300"
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-2 text-primary group-hover:text-primary-600 transition-colors duration-300">
                        <span className="text-sm sm:text-base font-semibold">
                          Read more
                        </span>
                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                        <ArrowRightIcon className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {showViewAllButton && (
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
                endContent={
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                }
                className="bg-content2 backdrop-blur-sm hover:bg-primary hover:text-white transition-all duration-300 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold shadow-lg hover:shadow-primary/20 touch-manipulation active:scale-95"
              >
                View All Articles
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogWidget;
