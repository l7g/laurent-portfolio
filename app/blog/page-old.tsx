"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowRightIcon,
  FireIcon,
  RectangleStackIcon,
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
  publishedAt: string;
  author: {
    id: string;
    name: string;
  };
  _count: {
    comments: number;
  };
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
  estimatedTime?: number;
  users: {
    id: string;
    name: string;
  };
  blog_posts: BlogPost[];
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
      params.append("limit", "9");
      params.append("published", "true");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={title({ size: "lg" })}>Blog & Insights</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Sharing my journey in tech development and international relations
          </p>
        </motion.div>
      </section>

      {/* Navigation Controls */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="flex-1">
              <Input
                className="w-full"
                placeholder="Search posts and series..."
                startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                color={viewMode === "posts" ? "primary" : "default"}
                startContent={<BookOpenIcon className="w-4 h-4" />}
                variant={viewMode === "posts" ? "solid" : "flat"}
                onClick={() => setViewMode("posts")}
              >
                Posts
              </Button>
              <Button
                color={viewMode === "series" ? "primary" : "default"}
                startContent={<RectangleStackIcon className="w-4 h-4" />}
                variant={viewMode === "series" ? "solid" : "flat"}
                onClick={() => setViewMode("series")}
              >
                Series
              </Button>
            </div>
          </div>

          {/* Filters */}
          {viewMode === "posts" && (
            <div className="space-y-6">
              {/* Category Tabs */}
              <Tabs
                className="w-full"
                color="primary"
                selectedKey={selectedCategory}
                variant="underlined"
                onSelectionChange={(key: any) =>
                  setSelectedCategory(key.toString())
                }
              >
                <Tab
                  key="all"
                  title={
                    <div className="flex items-center gap-2">
                      <FireIcon className="w-4 h-4" />
                      <span>All Posts</span>
                    </div>
                  }
                />
                {categories.map((category) => (
                  <Tab
                    key={category.slug}
                    title={
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <Chip className="ml-1" size="sm" variant="flat">
                          {category._count.posts}
                        </Chip>
                      </div>
                    }
                  />
                ))}
              </Tabs>

              {/* Series Filter */}
              {series.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    color={selectedSeries === "all" ? "primary" : "default"}
                    size="sm"
                    variant={selectedSeries === "all" ? "solid" : "flat"}
                    onClick={() => setSelectedSeries("all")}
                  >
                    All Series
                  </Button>
                  {series.map((s) => (
                    <Button
                      key={s.slug}
                      color={selectedSeries === s.slug ? "primary" : "default"}
                      size="sm"
                      style={{
                        backgroundColor:
                          selectedSeries === s.slug ? s.color : undefined,
                      }}
                      variant={selectedSeries === s.slug ? "solid" : "flat"}
                      onClick={() => setSelectedSeries(s.slug)}
                    >
                      {s.icon && <span className="mr-1">{s.icon}</span>}
                      {s.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-full mx-auto">
          {viewMode === "series" ? (
            /* Series View */
            <div>
              <div className="flex items-center gap-2 mb-8">
                <RectangleStackIcon className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">Blog Series</h2>
              </div>

              {seriesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-auto">
                      <CardBody className="p-0">
                        <div className="animate-pulse">
                          <div className="h-48 bg-content2 rounded-t-lg" />
                          <div className="p-6 space-y-4">
                            <div className="h-6 bg-content2 rounded w-3/4" />
                            <div className="h-4 bg-content2 rounded w-1/2" />
                            <div className="h-4 bg-content2 rounded w-full" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                  {series.map((s, index) => (
                    <motion.div
                      key={s.id}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                        <CardHeader className="pb-4 px-8 pt-8">
                          <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {s.icon && (
                                  <span className="text-2xl">{s.icon}</span>
                                )}
                                <Chip
                                  size="md"
                                  style={{
                                    backgroundColor: `${s.color}20`,
                                    color: s.color,
                                  }}
                                  variant="flat"
                                >
                                  {s.totalPosts} posts
                                </Chip>
                              </div>
                              {s.difficulty && (
                                <Chip
                                  color={getDifficultyColor(s.difficulty)}
                                  size="md"
                                  variant="flat"
                                >
                                  {s.difficulty}
                                </Chip>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                              {s.title}
                            </h3>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0 px-8 pb-8 flex flex-col">
                          <p className="text-default-600 text-base line-clamp-3 mb-8 flex-grow">
                            {s.description ||
                              "A comprehensive series of posts covering various aspects of this topic."}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {s.tags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag}
                                className="text-sm"
                                size="sm"
                                variant="bordered"
                              >
                                {tag}
                              </Chip>
                            ))}
                            {s.tags.length > 3 && (
                              <Chip
                                className="text-sm"
                                size="sm"
                                variant="bordered"
                              >
                                +{s.tags.length - 3} more
                              </Chip>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-base text-default-500 mb-8">
                            <div className="flex items-center gap-2">
                              <Avatar
                                className="w-6 h-6"
                                name={s.users.name}
                                size="sm"
                              />
                              <span>{s.users.name}</span>
                            </div>
                            {s.estimatedTime && (
                              <div className="flex items-center gap-2">
                                <ClockIcon className="w-5 h-5" />
                                {s.estimatedTime} min
                              </div>
                            )}
                          </div>

                          <Divider className="mb-8" />

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2 text-base text-default-600">
                              <BookOpenIcon className="w-5 h-5" />
                              <span>Recent Posts:</span>
                            </div>
                            {s.blog_posts.slice(0, 2).map((post) => (
                              <div key={post.id} className="pl-8 text-base">
                                <Link
                                  className="text-default-600 hover:text-primary transition-colors line-clamp-1"
                                  href={`/blog/${post.slug}`}
                                >
                                  {post.seriesOrder && (
                                    <span className="text-sm text-default-400 mr-3">
                                      {post.seriesOrder}.
                                    </span>
                                  )}
                                  {post.title}
                                </Link>
                              </div>
                            ))}
                          </div>

                          <Link href={`/blog/series/${s.slug}`}>
                            <Button
                              className="w-full"
                              color="primary"
                              endContent={
                                <ArrowRightIcon className="w-5 h-5" />
                              }
                              size="lg"
                              variant="flat"
                            >
                              View Series
                            </Button>
                          </Link>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {!seriesLoading && series.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">📚</div>
                  <h3 className="text-2xl font-semibold mb-4">
                    No series available yet
                  </h3>
                  <p className="text-lg text-default-600">
                    Series will be added as content grows. Check back later!
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Posts View */
            <div>
              <div className="flex items-center gap-2 mb-8">
                <BookOpenIcon className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">
                  {selectedSeries !== "all"
                    ? `Posts in ${series.find((s) => s.slug === selectedSeries)?.title || "Series"}`
                    : "Latest Posts"}
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="h-auto">
                      <CardBody className="p-0">
                        <div className="animate-pulse">
                          <div className="h-48 bg-content2 rounded-t-lg" />
                          <div className="p-6 space-y-4">
                            <div className="h-6 bg-content2 rounded w-3/4" />
                            <div className="h-4 bg-content2 rounded w-1/2" />
                            <div className="h-4 bg-content2 rounded w-full" />
                            <div className="h-4 bg-content2 rounded w-2/3" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                        <CardHeader className="pb-4 px-8 pt-8">
                          <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center justify-between">
                              <Chip
                                size="md"
                                style={{
                                  backgroundColor: `${post.category.color}20`,
                                  color: post.category.color,
                                }}
                                variant="flat"
                              >
                                <span className="mr-2">
                                  {post.category.icon}
                                </span>
                                {post.category.name}
                              </Chip>
                              <div className="flex items-center gap-2 text-base text-default-500">
                                <CalendarDaysIcon className="w-5 h-5" />
                                {formatDate(post.publishedAt)}
                              </div>
                            </div>

                            {post.series && (
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <Chip
                                    size="md"
                                    style={{
                                      borderColor: post.series.color,
                                      color: post.series.color,
                                    }}
                                    variant="bordered"
                                  >
                                    {post.series.icon && (
                                      <span className="mr-2">
                                        {post.series.icon}
                                      </span>
                                    )}
                                    {post.series.title}
                                  </Chip>
                                  {post.seriesOrder && (
                                    <span
                                      className="absolute -top-2 -right-2 w-6 h-6 text-sm text-white rounded-full flex items-center justify-center font-bold"
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

                            <h3 className="text-2xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0 px-8 pb-8 flex flex-col">
                          <p className="text-default-600 text-base line-clamp-3 mb-8 flex-grow">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag}
                                className="text-sm"
                                size="sm"
                                variant="bordered"
                              >
                                {tag}
                              </Chip>
                            ))}
                            {post.tags.length > 3 && (
                              <Chip
                                className="text-sm"
                                size="sm"
                                variant="bordered"
                              >
                                +{post.tags.length - 3} more
                              </Chip>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-base text-default-500 mb-8">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <EyeIcon className="w-5 h-5" />
                                {post.views}
                              </div>
                              <div className="flex items-center gap-2">
                                <ChatBubbleLeftIcon className="w-5 h-5" />
                                {post._count.comments}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-5 h-5" />
                              {getReadingTime(post.excerpt || "")} min
                            </div>
                          </div>

                          <Link href={`/blog/${post.slug}`}>
                            <Button
                              className="w-full"
                              color="primary"
                              endContent={
                                <ArrowRightIcon className="w-5 h-5" />
                              }
                              size="lg"
                              variant="flat"
                            >
                              Read More
                            </Button>
                          </Link>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && posts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">📝</div>
                  <h3 className="text-2xl font-semibold mb-4">
                    No posts found
                  </h3>
                  <p className="text-lg text-default-600">
                    {searchQuery
                      ? "Try a different search term"
                      : "Check back later for new content"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
