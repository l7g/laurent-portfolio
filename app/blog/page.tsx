"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  EyeIcon,
  ClockIcon,
  BookOpenIcon,
  FireIcon,
  RectangleStackIcon,
  TagIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { title, subtitle } from "@/components/primitives";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
  series?: {
    id: string;
    title: string;
    slug: string;
    color: string;
    icon?: string;
  };
  seriesOrder?: number;
  tags: string[];
  views: number;
  readingTime: number;
  publishedAt: string;
  _count: {
    comments: number;
  };
}

interface BlogSeries {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  color: string;
  icon?: string;
  difficulty?: string;
  _count: {
    posts: number;
  };
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  _count: {
    posts: number;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"posts" | "series">("posts");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchSeries();
  }, []);

  useEffect(() => {
    if (viewMode === "posts") {
      fetchPosts();
    }
  }, [selectedCategory, selectedSeries, searchQuery, page, viewMode]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/blog/categories");

      if (response.ok) {
        const data = await response.json();

        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchSeries = async () => {
    try {
      setSeriesLoading(true);
      const response = await fetch("/api/blog/series?published=true");

      if (response.ok) {
        const data = await response.json();

        setSeries(data.series);
      }
    } catch (error) {
      console.error("Failed to fetch series:", error);
    } finally {
      setSeriesLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (selectedSeries !== "all") {
        params.append("series", selectedSeries);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      params.append("page", page.toString());
      params.append("limit", "12");

      const response = await fetch(`/api/blog/posts?${params}`);

      if (response.ok) {
        const data = await response.json();

        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return minutes;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
        <div className="w-full text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <SparklesIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Blog & Insights
              </span>
            </div>
            <h1 className={title({ size: "lg", className: "mb-6" })}>
              Thoughts, Stories & Ideas
            </h1>
            <p className={subtitle({ className: "text-lg" })}>
              Sharing my journey in tech development, international relations,
              and everything in between
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Search and Navigation */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex-1">
                <Input
                  className="w-full"
                  placeholder="Search articles..."
                  size="lg"
                  startContent={
                    <MagnifyingGlassIcon className="w-5 h-5 text-default-400" />
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  color={viewMode === "posts" ? "primary" : "default"}
                  size="lg"
                  startContent={<BookOpenIcon className="w-5 h-5" />}
                  variant={viewMode === "posts" ? "solid" : "bordered"}
                  onClick={() => setViewMode("posts")}
                >
                  Articles
                </Button>
                <Button
                  color={viewMode === "series" ? "primary" : "default"}
                  size="lg"
                  startContent={<RectangleStackIcon className="w-5 h-5" />}
                  variant={viewMode === "series" ? "solid" : "bordered"}
                  onClick={() => setViewMode("series")}
                >
                  Series
                </Button>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence mode="wait">
              {viewMode === "posts" && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                >
                  {/* Category Filters */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4 text-default-600 uppercase tracking-wide">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        color={
                          selectedCategory === "all" ? "primary" : "default"
                        }
                        size="sm"
                        startContent={<FireIcon className="w-4 h-4" />}
                        variant={selectedCategory === "all" ? "solid" : "flat"}
                        onClick={() => setSelectedCategory("all")}
                      >
                        All Posts
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          className={
                            selectedCategory === category.slug
                              ? ""
                              : "hover:scale-105"
                          }
                          color={
                            selectedCategory === category.slug
                              ? "primary"
                              : "default"
                          }
                          size="sm"
                          startContent={
                            category.icon ? (
                              <span>{category.icon}</span>
                            ) : (
                              <TagIcon className="w-4 h-4" />
                            )
                          }
                          style={{
                            backgroundColor:
                              selectedCategory === category.slug
                                ? category.color
                                : undefined,
                          }}
                          variant={
                            selectedCategory === category.slug
                              ? "solid"
                              : "flat"
                          }
                          onClick={() => setSelectedCategory(category.slug)}
                        >
                          {category.name || "Uncategorized"} (
                          {category._count?.posts || 0})
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Series Filters */}
                  {series.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-4 text-default-600 uppercase tracking-wide">
                        Series
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          color={
                            selectedSeries === "all" ? "primary" : "default"
                          }
                          size="sm"
                          startContent={
                            <RectangleStackIcon className="w-4 h-4" />
                          }
                          variant={selectedSeries === "all" ? "solid" : "flat"}
                          onClick={() => setSelectedSeries("all")}
                        >
                          All Series
                        </Button>
                        {series.map((s) => (
                          <Button
                            key={s.id}
                            className={
                              selectedSeries === s.slug ? "" : "hover:scale-105"
                            }
                            color={
                              selectedSeries === s.slug ? "primary" : "default"
                            }
                            size="sm"
                            startContent={
                              s.icon ? (
                                <span>{s.icon}</span>
                              ) : (
                                <RectangleStackIcon className="w-4 h-4" />
                              )
                            }
                            style={{
                              backgroundColor:
                                selectedSeries === s.slug ? s.color : undefined,
                            }}
                            variant={
                              selectedSeries === s.slug ? "solid" : "flat"
                            }
                            onClick={() => setSelectedSeries(s.slug)}
                          >
                            {s.title || "Untitled Series"} (
                            {s._count?.posts || 0})
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Area */}
          <div className="mb-12">
            <AnimatePresence mode="wait">
              {viewMode === "series" ? (
                <motion.div
                  key="series"
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <RectangleStackIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-bold">Article Series</h2>
                  </div>

                  {seriesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="h-80">
                          <CardBody className="p-6">
                            <div className="animate-pulse space-y-4">
                              <div className="h-6 bg-default-300 rounded w-3/4" />
                              <div className="h-4 bg-default-300 rounded w-1/2" />
                              <div className="h-20 bg-default-300 rounded" />
                              <div className="h-4 bg-default-300 rounded w-2/3" />
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {series.map((s, index) => (
                        <motion.div
                          key={s.id}
                          animate={{ opacity: 1, y: 0 }}
                          initial={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Link
                            className="block h-full"
                            href={`/blog/series/${s.slug}`}
                          >
                            <Card className="h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                              <CardBody className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                  {s.icon && (
                                    <div className="text-3xl">{s.icon}</div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Chip
                                        size="sm"
                                        style={{
                                          backgroundColor: s.color,
                                          color: "white",
                                        }}
                                      >
                                        Series
                                      </Chip>
                                      {s.difficulty && (
                                        <Chip size="sm" variant="flat">
                                          {s.difficulty}
                                        </Chip>
                                      )}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                      {s.title}
                                    </h3>
                                  </div>
                                </div>

                                <p className="text-default-600 mb-4 line-clamp-3">
                                  {s.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-default-200">
                                  <div className="flex items-center gap-2 text-sm text-default-500">
                                    <BookOpenIcon className="w-4 h-4" />
                                    <span>{s._count.posts} articles</span>
                                  </div>
                                  <div className="text-xs text-default-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View series →
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="posts"
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <BookOpenIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-bold">
                      {selectedSeries !== "all"
                        ? `${series.find((s) => s.slug === selectedSeries)?.title || "Series"} Articles`
                        : "Latest Articles"}
                    </h2>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {[...Array(9)].map((_, i) => (
                        <Card key={i} className="h-96">
                          <CardBody className="p-6">
                            <div className="animate-pulse space-y-4">
                              <div className="h-6 bg-default-300 rounded w-3/4" />
                              <div className="h-4 bg-default-300 rounded w-1/2" />
                              <div className="h-20 bg-default-300 rounded" />
                              <div className="h-4 bg-default-300 rounded w-2/3" />
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {posts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          animate={{ opacity: 1, y: 0 }}
                          initial={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Link
                            className="block h-full"
                            href={`/blog/${post.slug}`}
                          >
                            <Card className="h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    <Chip
                                      size="sm"
                                      style={{
                                        backgroundColor: `${post.category.color}20`,
                                        color: post.category.color,
                                      }}
                                    >
                                      {post.category.icon && (
                                        <span className="mr-1">
                                          {post.category.icon}
                                        </span>
                                      )}
                                      {post.category.name || "Uncategorized"}
                                    </Chip>
                                    {post.status === "DRAFT" && (
                                      <Chip
                                        color="warning"
                                        size="sm"
                                        variant="bordered"
                                      >
                                        📝 Draft
                                      </Chip>
                                    )}
                                    {post.status === "ARCHIVED" && (
                                      <Chip
                                        color="default"
                                        size="sm"
                                        variant="bordered"
                                      >
                                        📦 Archived
                                      </Chip>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-default-500">
                                    <CalendarDaysIcon className="w-3 h-3" />
                                    {formatDate(post.publishedAt)}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardBody className="pt-0">
                                {post.series && (
                                  <div className="mb-3">
                                    <div className="flex items-center gap-2">
                                      <Chip
                                        size="sm"
                                        style={{
                                          borderColor: post.series.color,
                                          color: post.series.color,
                                        }}
                                        variant="bordered"
                                      >
                                        {post.series.icon && (
                                          <span className="mr-1">
                                            {post.series.icon}
                                          </span>
                                        )}
                                        {post.series.title || "Series"}
                                      </Chip>
                                      {post.seriesOrder && (
                                        <span
                                          className="w-5 h-5 text-xs text-white rounded-full flex items-center justify-center font-bold"
                                          style={{
                                            backgroundColor: post.series.color,
                                          }}
                                        >
                                          {post.seriesOrder}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>

                                <p className="text-default-600 line-clamp-3 mb-4">
                                  {post.excerpt}
                                </p>

                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-4">
                                    {post.tags
                                      .slice(0, 3)
                                      .map((tag, tagIndex) => (
                                        <span
                                          key={tagIndex}
                                          className="text-xs bg-default-100 text-default-600 px-2 py-1 rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    {post.tags.length > 3 && (
                                      <span className="text-xs text-default-500 px-2 py-1">
                                        +{post.tags.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-default-200 mt-auto">
                                  <div className="flex items-center gap-4 text-sm text-default-500">
                                    <div className="flex items-center gap-1">
                                      <EyeIcon className="w-4 h-4" />
                                      {post.views}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <ClockIcon className="w-4 h-4" />
                                      {post.readingTime} min
                                    </div>
                                  </div>
                                  <div className="text-xs text-default-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to read →
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {!loading && posts.length === 0 && (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-6">📝</div>
                      <h3 className="text-2xl font-bold mb-4">
                        No articles found
                      </h3>
                      <p className="text-default-600 mb-8">
                        {searchQuery
                          ? "Try adjusting your search terms or filters"
                          : "Check back later for new content"}
                      </p>
                      {searchQuery && (
                        <Button
                          color="primary"
                          variant="flat"
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                            setSelectedSeries("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
