"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Tab, Tabs } from "@heroui/tabs";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
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
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery, page]);

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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      params.append("page", page.toString());
      params.append("limit", "9");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={title({ size: "lg" })}>Blog & Insights</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Sharing my journey in tech development and international relations
          </p>
        </motion.div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 pb-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
              className="w-full"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs
          selectedKey={selectedCategory}
          onSelectionChange={(key: any) => setSelectedCategory(key.toString())}
          className="w-full"
          variant="underlined"
          color="primary"
        >
          <Tab
            key="all"
            title={
              <div className="flex items-center gap-2">
                <span>🔥</span>
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
                  <Chip size="sm" variant="flat" className="ml-1">
                    {category._count.posts}
                  </Chip>
                </div>
              }
            />
          ))}
        </Tabs>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-80">
                <CardBody className="p-0">
                  <div className="animate-pulse">
                    <div className="h-48 bg-default-300 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-default-300 rounded w-3/4"></div>
                      <div className="h-3 bg-default-300 rounded w-1/2"></div>
                      <div className="h-3 bg-default-300 rounded w-full"></div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
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
                        <div className="flex items-center gap-2 text-small text-default-500">
                          <CalendarDaysIcon className="w-4 h-4" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <p className="text-default-600 text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

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
                      {post.tags.length > 3 && (
                        <Chip size="sm" variant="bordered" className="text-xs">
                          +{post.tags.length - 3} more
                        </Chip>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-small text-default-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                          {post._count.comments}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {getReadingTime(post.excerpt || "")} min
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="mt-4 block">
                      <Button
                        color="primary"
                        variant="flat"
                        className="w-full"
                        size="sm"
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-default-600">
              {searchQuery
                ? "Try a different search term"
                : "Check back later for new content"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
