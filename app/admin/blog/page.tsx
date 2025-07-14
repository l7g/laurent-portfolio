"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured?: boolean;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  series?: {
    id: string;
    title: string;
    slug: string;
    color: string;
    icon: string;
  } | null;
  seriesOrder?: number | null;
  tags: string[];
  views: number;
  likes: number;
  publishedAt: string | null;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    comments: number;
  };
}

interface BlogCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const statusColors = {
  DRAFT: "warning",
  PUBLISHED: "success",
  ARCHIVED: "default",
} as const;

export default function BlogAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Define functions before hooks that use them
  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/blog/posts"),
        fetch("/api/admin/blog/categories"),
      ]);

      if (postsResponse.ok && categoriesResponse.ok) {
        const [postsData, categoriesData] = await Promise.all([
          postsResponse.json(),
          categoriesResponse.json(),
        ]);

        // Fix: extract posts array from the response object
        setPosts(postsData.posts || []);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // All hooks must be at the top level
  useEffect(() => {
    fetchData();
  }, []);

  // Handle authentication after all hooks
  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user?.role !== "ADMIN") {
    router.push("/admin/login");

    return null;
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/admin/blog/posts/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.id === id ? { ...post, status: status as any } : post,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to duplicate post:", error);
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/posts/${post.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !post.featured,
        }),
      });

      if (response.ok) {
        // Update local state
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id ? { ...p, featured: !post.featured } : p,
          ),
        );
      } else {
        console.error("Failed to toggle featured status");
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || post.category.id === categoryFilter;
    const matchesFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && post.featured) ||
      (featuredFilter === "not-featured" && !post.featured);

    return matchesSearch && matchesStatus && matchesCategory && matchesFeatured;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-default-300 rounded w-1/4" />
            <div className="h-12 bg-default-300 rounded" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-default-300 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-default-500 mb-2">
                <span>Admin Dashboard</span>
                <span>/</span>
                <span className="text-primary font-medium">
                  Blog Management
                </span>
              </div>
              <h1 className={title({ size: "lg" })}>Blog Management</h1>
              <p className="text-default-600 mt-2">
                Manage your blog posts, categories, and series
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                as={Link}
                className="w-full sm:w-auto"
                href="/admin/blog/series"
                startContent={<BookOpenIcon className="w-4 h-4" />}
                variant="bordered"
              >
                Series
              </Button>
              <Button
                className="w-full sm:w-auto"
                color="warning"
                variant="bordered"
                startContent={<span>⭐</span>}
                onClick={() =>
                  setFeaturedFilter(
                    featuredFilter === "featured" ? "all" : "featured",
                  )
                }
              >
                {featuredFilter === "featured" ? "Show All" : "Featured Only"}
              </Button>
              <Button
                as={Link}
                className="w-full sm:w-auto"
                color="secondary"
                href="/blog"
                target="_blank"
                startContent={<EyeIcon className="w-4 h-4" />}
                variant="bordered"
              >
                Preview Magazine
              </Button>
              <Button
                as={Link}
                className="w-full sm:w-auto"
                href="/admin/blog/categories"
                startContent={<FunnelIcon className="w-4 h-4" />}
                variant="bordered"
              >
                Categories
              </Button>
              <Button
                as={Link}
                className="w-full sm:w-auto"
                color="primary"
                href="/admin/blog/new"
                startContent={<PlusIcon className="w-4 h-4" />}
              >
                New Post
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardBody className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Input
                  className="w-full sm:max-w-sm"
                  placeholder="Search posts..."
                  startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <select
                    className="px-3 py-2 bg-default-100 border border-default-200 rounded-lg w-full sm:w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <select
                    className="px-3 py-2 bg-default-100 border border-default-200 rounded-lg w-full sm:w-auto"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-2 bg-default-100 border border-default-200 rounded-lg w-full sm:w-auto"
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value)}
                  >
                    <option value="all">All Posts</option>
                    <option value="featured">⭐ Featured</option>
                    <option value="not-featured">Not Featured</option>
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Total Posts</p>
                    <p className="text-xl font-bold">{posts.length}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <EyeIcon className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Published</p>
                    <p className="text-xl font-bold">
                      {posts.filter((p) => p.status === "PUBLISHED").length}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <PencilIcon className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Drafts</p>
                    <p className="text-xl font-bold">
                      {posts.filter((p) => p.status === "DRAFT").length}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <span className="text-orange-500 text-lg">⭐</span>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Featured</p>
                    <p className="text-xl font-bold">
                      {posts.filter((p) => p.featured).length}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>

        {/* Posts Table */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <h2 className="text-xl font-semibold">Posts</h2>
                <p className="text-default-600">
                  {filteredPosts.length} of {posts.length} posts
                </p>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-default-50">
                    <tr>
                      <th className="text-left p-3 sm:p-4 font-medium">
                        Title
                      </th>
                      <th className="text-left p-3 sm:p-4 font-medium hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-left p-3 sm:p-4 font-medium">
                        Status
                      </th>
                      <th className="text-left p-3 sm:p-4 font-medium hidden lg:table-cell">
                        Stats
                      </th>
                      <th className="text-left p-3 sm:p-4 font-medium hidden md:table-cell">
                        Updated
                      </th>
                      <th className="text-left p-3 sm:p-4 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr
                        key={post.id}
                        className={`border-b border-default-200 hover:bg-default-50/50 ${
                          post.featured
                            ? "bg-orange-50/30 border-orange-200/50"
                            : ""
                        }`}
                      >
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="w-8 h-8 flex-shrink-0"
                              name={post.author.name}
                              size="sm"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">
                                  {post.title}
                                </p>
                                {post.featured && (
                                  <span
                                    className="text-orange-500 text-sm"
                                    title="Featured"
                                  >
                                    ⭐
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-default-600 truncate sm:hidden">
                                {post.category.name}
                              </p>
                              <p className="text-sm text-default-600 truncate max-w-xs hidden sm:block">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 hidden sm:table-cell">
                          <div className="space-y-1">
                            <Chip
                              size="sm"
                              style={{
                                backgroundColor: `${post.category.color}20`,
                                color: post.category.color,
                              }}
                              variant="flat"
                            >
                              {post.category.icon && (
                                <span className="mr-1">
                                  {post.category.icon}
                                </span>
                              )}
                              {post.category.name || "Uncategorized"}
                            </Chip>
                            {post.series && (
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
                                {post.series.title || "Series"} #
                                {post.seriesOrder}
                              </Chip>
                            )}
                          </div>
                        </td>
                        <td className="p-3 sm:p-4">
                          <Chip
                            color={statusColors[post.status]}
                            size="sm"
                            variant="flat"
                          >
                            {post.status.toLowerCase()}
                          </Chip>
                        </td>
                        <td className="p-3 sm:p-4 hidden lg:table-cell">
                          <div className="flex gap-4 text-sm text-default-600">
                            <span>{post.views} views</span>
                            <span>{post.likes} likes</span>
                            <span>{post._count.comments} comments</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 hidden md:table-cell">
                          <div className="text-sm">
                            <p>{formatDate(post.updatedAt)}</p>
                            {post.publishedAt && (
                              <p className="text-default-500">
                                Published {formatDate(post.publishedAt)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-1">
                            <Button
                              isIconOnly
                              as={Link}
                              href={`/blog/${post.slug}`}
                              size="sm"
                              title="View"
                              variant="light"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              isIconOnly
                              as={Link}
                              href={`/admin/blog/edit/${post.id}`}
                              size="sm"
                              title="Edit"
                              variant="light"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              title={
                                post.featured
                                  ? "Remove from Featured"
                                  : "Mark as Featured"
                              }
                              variant="light"
                              className={
                                post.featured
                                  ? "text-orange-500"
                                  : "text-default-400"
                              }
                              onClick={() => toggleFeatured(post)}
                            >
                              <span className="text-base">⭐</span>
                            </Button>
                            <div className="hidden sm:flex items-center gap-1">
                              <Button
                                isIconOnly
                                size="sm"
                                title="Duplicate"
                                variant="light"
                                onClick={() => handleDuplicate(post.id)}
                              >
                                <DocumentDuplicateIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                title="Archive"
                                variant="light"
                                onClick={() =>
                                  handleStatusChange(post.id, "ARCHIVED")
                                }
                              >
                                <ArchiveBoxIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                title="Delete"
                                variant="light"
                                onClick={() => handleDelete(post.id)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
