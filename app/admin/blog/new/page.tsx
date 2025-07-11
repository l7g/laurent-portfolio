"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  EyeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { title } from "@/components/primitives";
import RichTextEditor from "@/components/admin/rich-text-editor";
import CategorySelector from "@/components/admin/category-selector";
import SeriesSelector from "@/components/admin/series-selector";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  description?: string;
}

interface BlogSeries {
  id: string;
  title: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  difficulty?: string;
  _count: {
    blog_posts: number;
  };
}

interface PostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  seriesId: string;
  seriesOrder: number;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metaTitle: string;
  metaDescription: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [postData, setPostData] = useState<PostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    seriesId: "",
    seriesOrder: 1,
    tags: [],
    status: "DRAFT",
    metaTitle: "",
    metaDescription: "",
  });

  // Define functions before hooks that use them
  const fetchCategories = async () => {
    try {
      const [categoriesResponse, seriesResponse] = await Promise.all([
        fetch("/api/admin/blog/categories"),
        fetch("/api/admin/blog/series"),
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();

        setCategories(categoriesData);
      }

      if (seriesResponse.ok) {
        const seriesData = await seriesResponse.json();

        setSeries(seriesData);
      }
    } catch (error) {
      console.error("Failed to fetch categories and series:", error);
    }
  };

  const createNewCategory = async (categoryData: Omit<BlogCategory, "id">) => {
    try {
      const response = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...categoryData,
          isActive: true,
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();

        setCategories((prev) => [...prev, newCategory]);

        return newCategory;
      } else {
        throw new Error("Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  const createNewSeries = async (
    seriesData: Omit<BlogSeries, "id" | "_count">,
  ) => {
    try {
      const response = await fetch("/api/admin/blog/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...seriesData,
          isActive: true,
          tags: [],
        }),
      });

      if (response.ok) {
        const newSeries = await response.json();
        const seriesWithCount = { ...newSeries, _count: { blog_posts: 0 } };

        setSeries((prev) => [...prev, seriesWithCount]);

        return seriesWithCount;
      } else {
        throw new Error("Failed to create series");
      }
    } catch (error) {
      console.error("Error creating series:", error);
      throw error;
    }
  };

  // All hooks must be at the top level
  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (postData.title && !postData.slug) {
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      setPostData((prev) => ({ ...prev, slug }));
    }
  }, [postData.title]);

  // Auto-calculate series order when series is selected
  useEffect(() => {
    if (postData.seriesId) {
      const selectedSeries = series.find((s) => s.id === postData.seriesId);

      if (selectedSeries && postData.seriesOrder === 1) {
        // Set the next order number in the series
        setPostData((prev) => ({
          ...prev,
          seriesOrder: selectedSeries._count.blog_posts + 1,
        }));
      }
    }
  }, [postData.seriesId, series]);

  // Handle authentication after all hooks
  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user?.role !== "ADMIN") {
    router.push("/admin/login");

    return null;
  }

  const handleInputChange = (field: keyof PostData, value: string) => {
    if (field === "seriesOrder") {
      setPostData((prev) => ({ ...prev, [field]: parseInt(value) || 1 }));
    } else {
      setPostData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!postData.title || !postData.content || !postData.categoryId) {
      alert("Please fill in title, content, and category");

      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/blog/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postData,
          status,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        router.push(`/admin/blog`);
      } else {
        const error = await response.json();

        alert(error.error || "Failed to save post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/blog">
                <Button
                  className="text-default-600 hover:text-default-900"
                  startContent={<ArrowLeftIcon className="w-4 h-4" />}
                  variant="light"
                >
                  Back to Blog
                </Button>
              </Link>
              <div>
                <h1 className={title({ size: "lg" })}>New Blog Post</h1>
                <p className="text-default-600 mt-2">
                  Create engaging content for your readers
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={saving}
                startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                variant="bordered"
                onClick={() => handleSave("DRAFT")}
              >
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                color="primary"
                disabled={saving}
                startContent={<EyeIcon className="w-4 h-4" />}
                onClick={() => handleSave("PUBLISHED")}
              >
                {saving ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Post Title</h3>
                </CardHeader>
                <CardBody>
                  <Input
                    className="text-xl"
                    placeholder="Enter your post title..."
                    size="lg"
                    value={postData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Slug */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">URL Slug</h3>
                </CardHeader>
                <CardBody>
                  <Input
                    description="Used in the post URL. Auto-generated from title."
                    placeholder="post-url-slug"
                    value={postData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Excerpt */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Excerpt</h3>
                </CardHeader>
                <CardBody>
                  <textarea
                    className="w-full p-3 border border-default-200 rounded-lg resize-none"
                    placeholder="Brief description of your post..."
                    rows={3}
                    value={postData.excerpt}
                    onChange={(e) =>
                      handleInputChange("excerpt", e.target.value)
                    }
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Content Editor */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RichTextEditor
                minHeight="500px"
                placeholder="Start writing your amazing post..."
                value={postData.content}
                onChange={(value) => handleInputChange("content", value)}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Category</h3>
                </CardHeader>
                <CardBody>
                  <CategorySelector
                    categories={categories}
                    value={postData.categoryId}
                    onChange={(value: string) =>
                      handleInputChange("categoryId", value)
                    }
                    onCreateCategory={createNewCategory}
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Series */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Series (Optional)</h3>
                  <p className="text-sm text-default-600">
                    Add this post to a series for organized content
                  </p>
                </CardHeader>
                <CardBody className="space-y-4">
                  <SeriesSelector
                    series={series}
                    value={postData.seriesId}
                    onChange={(value: string) =>
                      handleInputChange("seriesId", value)
                    }
                    onCreateSeries={createNewSeries}
                  />

                  {postData.seriesId && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Series Order
                      </label>
                      <Input
                        description="Position of this post within the series"
                        min="1"
                        placeholder="Order in series"
                        type="number"
                        value={postData.seriesOrder.toString()}
                        onChange={(e) =>
                          handleInputChange("seriesOrder", e.target.value)
                        }
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Tags</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        startContent={<TagIcon className="w-4 h-4" />}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button
                        disabled={!tagInput.trim()}
                        variant="bordered"
                        onClick={handleAddTag}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postData.tags.map((tag) => (
                        <Chip
                          key={tag}
                          className="text-xs"
                          variant="flat"
                          onClose={() => handleRemoveTag(tag)}
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* SEO */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">SEO Settings</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <Input
                      label="Meta Title"
                      placeholder="SEO title for search engines"
                      value={postData.metaTitle}
                      onChange={(e) =>
                        handleInputChange("metaTitle", e.target.value)
                      }
                    />
                    <textarea
                      className="w-full p-3 border border-default-200 rounded-lg resize-none"
                      placeholder="Meta description for search engines..."
                      rows={3}
                      value={postData.metaDescription}
                      onChange={(e) =>
                        handleInputChange("metaDescription", e.target.value)
                      }
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Status */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Status</h3>
                </CardHeader>
                <CardBody>
                  <select
                    className="w-full p-3 border border-default-200 rounded-lg"
                    value={postData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value as any)
                    }
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
