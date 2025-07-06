"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  EyeIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowRightIcon,
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
  readTime: number;
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={
                    <MagnifyingGlassIcon className="w-5 h-5 text-default-400" />
                  }
                  size="lg"
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant={viewMode === "posts" ? "solid" : "bordered"}
                  color={viewMode === "posts" ? "primary" : "default"}
                  onClick={() => setViewMode("posts")}
                  startContent={<BookOpenIcon className="w-5 h-5" />}
                  size="lg"
                >
                  Articles
                </Button>
                <Button
                  variant={viewMode === "series" ? "solid" : "bordered"}
                  color={viewMode === "series" ? "primary" : "default"}
                  onClick={() => setViewMode("series")}
                  startContent={<RectangleStackIcon className="w-5 h-5" />}
                  size="lg"
                >
                  Series
                </Button>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence mode="wait">
              {viewMode === "posts" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Category Filters */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4 text-default-600 uppercase tracking-wide">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant={selectedCategory === "all" ? "solid" : "flat"}
                        color={
                          selectedCategory === "all" ? "primary" : "default"
                        }
                        onClick={() => setSelectedCategory("all")}
                        startContent={<FireIcon className="w-4 h-4" />}
                        size="sm"
                      >
                        All Posts
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={
                            selectedCategory === category.slug
                              ? "solid"
                              : "flat"
                          }
                          color={
                            selectedCategory === category.slug
                              ? "primary"
                              : "default"
                          }
                          onClick={() => setSelectedCategory(category.slug)}
                          startContent={<span>{category.icon}</span>}
                          size="sm"
                          className={
                            selectedCategory === category.slug
                              ? ""
                              : "hover:scale-105"
                          }
                          style={{
                            backgroundColor:
                              selectedCategory === category.slug
                                ? category.color
                                : undefined,
                          }}
                        >
                          {category.name}
                          <Chip size="sm" className="ml-2" variant="flat">
                            {category._count.posts}
                          </Chip>
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
                          variant={selectedSeries === "all" ? "solid" : "flat"}
                          color={
                            selectedSeries === "all" ? "primary" : "default"
                          }
                          onClick={() => setSelectedSeries("all")}
                          startContent={
                            <RectangleStackIcon className="w-4 h-4" />
                          }
                          size="sm"
                        >
                          All Series
                        </Button>
                        {series.map((s) => (
                          <Button
                            key={s.id}
                            variant={
                              selectedSeries === s.slug ? "solid" : "flat"
                            }
                            color={
                              selectedSeries === s.slug ? "primary" : "default"
                            }
                            onClick={() => setSelectedSeries(s.slug)}
                            startContent={
                              s.icon ? (
                                <span>{s.icon}</span>
                              ) : (
                                <RectangleStackIcon className="w-4 h-4" />
                              )
                            }
                            size="sm"
                            className={
                              selectedSeries === s.slug ? "" : "hover:scale-105"
                            }
                            style={{
                              backgroundColor:
                                selectedSeries === s.slug ? s.color : undefined,
                            }}
                          >
                            {s.title}
                            <Chip size="sm" className="ml-2" variant="flat">
                              {s._count.posts}
                            </Chip>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                              <div className="h-6 bg-default-300 rounded w-3/4"></div>
                              <div className="h-4 bg-default-300 rounded w-1/2"></div>
                              <div className="h-20 bg-default-300 rounded"></div>
                              <div className="h-4 bg-default-300 rounded w-2/3"></div>
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
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
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
                                <Button
                                  as={Link}
                                  href={`/blog/series/${s.slug}`}
                                  variant="flat"
                                  color="primary"
                                  size="sm"
                                  endContent={
                                    <ArrowRightIcon className="w-4 h-4" />
                                  }
                                >
                                  View Series
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                              <div className="h-6 bg-default-300 rounded w-3/4"></div>
                              <div className="h-4 bg-default-300 rounded w-1/2"></div>
                              <div className="h-20 bg-default-300 rounded"></div>
                              <div className="h-4 bg-default-300 rounded w-2/3"></div>
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
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between w-full">
                                <Chip
                                  size="sm"
                                  style={{
                                    backgroundColor: `${post.category.color}20`,
                                    color: post.category.color,
                                  }}
                                >
                                  <span className="mr-1">
                                    {post.category.icon}
                                  </span>
                                  {post.category.name}
                                </Chip>
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
                                      variant="bordered"
                                      style={{
                                        borderColor: post.series.color,
                                        color: post.series.color,
                                      }}
                                    >
                                      {post.series.icon && (
                                        <span className="mr-1">
                                          {post.series.icon}
                                        </span>
                                      )}
                                      {post.series.title}
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
                                    {post.readTime} min
                                  </div>
                                </div>
                                <Button
                                  as={Link}
                                  href={`/blog/${post.slug}`}
                                  variant="flat"
                                  color="primary"
                                  size="sm"
                                  endContent={
                                    <ArrowRightIcon className="w-4 h-4" />
                                  }
                                >
                                  Read
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
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
                          variant="flat"
                          color="primary"
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
