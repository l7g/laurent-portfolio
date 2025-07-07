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
import { title } from "@/components/primitives";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import RichTextEditor from "@/components/admin/rich-text-editor";

interface BlogCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface PostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metaTitle: string;
  metaDescription: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [postData, setPostData] = useState<PostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tags: [],
    status: "DRAFT",
    metaTitle: "",
    metaDescription: "",
  });

  // Define functions before hooks that use them
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/blog/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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

  // Handle authentication after all hooks
  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const handleInputChange = (field: keyof PostData, value: string) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/blog">
                <Button
                  variant="light"
                  startContent={<ArrowLeftIcon className="w-4 h-4" />}
                  className="text-default-600 hover:text-default-900"
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
                variant="bordered"
                onClick={() => handleSave("DRAFT")}
                disabled={saving}
                startContent={<CloudArrowUpIcon className="w-4 h-4" />}
              >
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                color="primary"
                onClick={() => handleSave("PUBLISHED")}
                disabled={saving}
                startContent={<EyeIcon className="w-4 h-4" />}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Post Title</h3>
                </CardHeader>
                <CardBody>
                  <Input
                    placeholder="Enter your post title..."
                    value={postData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    size="lg"
                    className="text-xl"
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Slug */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">URL Slug</h3>
                </CardHeader>
                <CardBody>
                  <Input
                    placeholder="post-url-slug"
                    value={postData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    description="Used in the post URL. Auto-generated from title."
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Excerpt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Excerpt</h3>
                </CardHeader>
                <CardBody>
                  <textarea
                    placeholder="Brief description of your post..."
                    value={postData.excerpt}
                    onChange={(e) =>
                      handleInputChange("excerpt", e.target.value)
                    }
                    rows={3}
                    className="w-full p-3 border border-default-200 rounded-lg resize-none"
                  />
                </CardBody>
              </Card>
            </motion.div>

            {/* Content Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RichTextEditor
                value={postData.content}
                onChange={(value) => handleInputChange("content", value)}
                placeholder="Start writing your amazing post..."
                minHeight="500px"
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Category</h3>
                </CardHeader>
                <CardBody>
                  <select
                    value={postData.categoryId}
                    onChange={(e) =>
                      handleInputChange("categoryId", e.target.value)
                    }
                    className="w-full p-3 border border-default-200 rounded-lg"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </CardBody>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        startContent={<TagIcon className="w-4 h-4" />}
                      />
                      <Button
                        variant="bordered"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postData.tags.map((tag) => (
                        <Chip
                          key={tag}
                          variant="flat"
                          onClose={() => handleRemoveTag(tag)}
                          className="text-xs"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                      placeholder="Meta description for search engines..."
                      value={postData.metaDescription}
                      onChange={(e) =>
                        handleInputChange("metaDescription", e.target.value)
                      }
                      rows={3}
                      className="w-full p-3 border border-default-200 rounded-lg resize-none"
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Status</h3>
                </CardHeader>
                <CardBody>
                  <select
                    value={postData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value as any)
                    }
                    className="w-full p-3 border border-default-200 rounded-lg"
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
