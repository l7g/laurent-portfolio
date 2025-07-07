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

interface BlogSeries {
  id: string;
  title: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  seriesId?: string;
  seriesOrder?: number;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  category: BlogCategory;
  series?: BlogSeries;
}

export default function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
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
  const fetchData = async () => {
    try {
      setLoading(true);
      const [postResponse, categoriesResponse, seriesResponse] =
        await Promise.all([
          fetch(`/api/admin/blog/posts/${params.id}`),
          fetch("/api/admin/blog/categories"),
          fetch("/api/admin/blog/series"),
        ]);

      if (postResponse.ok && categoriesResponse.ok && seriesResponse.ok) {
        const [postData, categoriesData, seriesData] = await Promise.all([
          postResponse.json(),
          categoriesResponse.json(),
          seriesResponse.json(),
        ]);

        setPost(postData);
        setCategories(categoriesData);
        setSeries(seriesData);

        // Set form data
        setPostData({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt || "",
          content: postData.content,
          categoryId: postData.categoryId,
          seriesId: postData.seriesId || "",
          seriesOrder: postData.seriesOrder || 1,
          tags: postData.tags || [],
          status: postData.status,
          metaTitle: postData.metaTitle || "",
          metaDescription: postData.metaDescription || "",
        });
      } else {
        console.error("Failed to fetch data");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  };

  // All hooks must be at the top level
  useEffect(() => {
    fetchData();
  }, [params.id]);

  // Handle authentication after all hooks
  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin/login");
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

  const handleSave = async (status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    if (!postData.title || !postData.content || !postData.categoryId) {
      alert("Please fill in title, content, and category");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: "PUT",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-default-300 rounded w-1/4"></div>
            <div className="h-32 bg-default-300 rounded"></div>
            <div className="h-96 bg-default-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-default-600">Post not found</p>
            <Button as={Link} href="/admin/blog" className="mt-4">
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button as={Link} href="/admin/blog" variant="light" isIconOnly>
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <div>
                <h1 className={title({ size: "lg" })}>Edit Blog Post</h1>
                <p className="text-default-600 mt-2">
                  Edit and update your blog post content
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                as={Link}
                href={`/blog/${post.slug}`}
                variant="bordered"
                startContent={<EyeIcon className="w-4 h-4" />}
              >
                Preview
              </Button>
              <Button
                variant="bordered"
                onClick={() => handleSave("DRAFT")}
                isLoading={saving}
              >
                Save Draft
              </Button>
              <Button
                color="primary"
                onClick={() => handleSave("PUBLISHED")}
                isLoading={saving}
                startContent={<CloudArrowUpIcon className="w-4 h-4" />}
              >
                {post.status === "PUBLISHED" ? "Update" : "Publish"}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Post Content</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Title"
                    placeholder="Enter post title"
                    value={postData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                  />
                  <Input
                    label="URL Slug"
                    placeholder="post-url-slug"
                    value={postData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Excerpt"
                    placeholder="Brief description of the post"
                    value={postData.excerpt}
                    onChange={(e) =>
                      handleInputChange("excerpt", e.target.value)
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content
                    </label>
                    <RichTextEditor
                      value={postData.content}
                      onChange={(value) => handleInputChange("content", value)}
                      placeholder="Write your post content here..."
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* SEO Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">SEO Settings</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Meta Title"
                    placeholder="SEO-optimized title"
                    value={postData.metaTitle}
                    onChange={(e) =>
                      handleInputChange("metaTitle", e.target.value)
                    }
                  />
                  <Input
                    label="Meta Description"
                    placeholder="SEO description for search engines"
                    value={postData.metaDescription}
                    onChange={(e) =>
                      handleInputChange("metaDescription", e.target.value)
                    }
                  />
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Settings</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      value={postData.status}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                        )
                      }
                      className="w-full px-3 py-2 bg-default-100 border border-default-200 rounded-lg"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={postData.categoryId}
                      onChange={(e) =>
                        handleInputChange("categoryId", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-default-100 border border-default-200 rounded-lg"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Series (Optional)
                    </label>
                    <select
                      value={postData.seriesId}
                      onChange={(e) =>
                        handleInputChange("seriesId", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-default-100 border border-default-200 rounded-lg"
                    >
                      <option value="">No series</option>
                      {series.map((seriesItem) => (
                        <option key={seriesItem.id} value={seriesItem.id}>
                          {seriesItem.icon} {seriesItem.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {postData.seriesId && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Series Order
                      </label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={postData.seriesOrder.toString()}
                        onChange={(e) =>
                          handleInputChange("seriesOrder", e.target.value)
                        }
                        min="1"
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Tags</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {postData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant="flat"
                        onClose={() => handleRemoveTag(tag)}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      startContent={<TagIcon className="w-4 h-4" />}
                    />
                    <Button
                      variant="bordered"
                      onClick={handleAddTag}
                      isDisabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
