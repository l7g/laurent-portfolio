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
import RelatedArticlesManager from "@/components/admin/related-articles-manager";

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
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  return <EditBlogPostClient id={resolvedParams.id} />;
}

function EditBlogPostClient({ id }: { id: string }) {
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
          sortOrder: categories.length,
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
          sortOrder: series.length,
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postResponse, categoriesResponse, seriesResponse] =
        await Promise.all([
          fetch(`/api/admin/blog/posts/${id}`),
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
    if (id) {
      fetchData();
    }
  }, [id]);

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

  const handleSave = async (status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    if (!postData.title || !postData.content || !postData.categoryId) {
      alert("Please fill in title, content, and category");

      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
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
            <div className="h-8 bg-default-300 rounded w-1/4" />
            <div className="h-32 bg-default-300 rounded" />
            <div className="h-96 bg-default-300 rounded" />
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
            <Button as={Link} className="mt-4" href="/admin/blog">
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
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button isIconOnly as={Link} href="/admin/blog" variant="light">
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
                startContent={<EyeIcon className="w-4 h-4" />}
                variant="bordered"
              >
                Preview
              </Button>
              <Button
                isLoading={saving}
                variant="bordered"
                onClick={() => handleSave("DRAFT")}
              >
                Save Draft
              </Button>
              <Button
                color="primary"
                isLoading={saving}
                startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                onClick={() => handleSave("PUBLISHED")}
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
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Post Content</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    isRequired
                    label="Title"
                    placeholder="Enter post title"
                    value={postData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                  <Input
                    isRequired
                    label="URL Slug"
                    placeholder="post-url-slug"
                    value={postData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
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
                      placeholder="Write your post content here..."
                      value={postData.content}
                      onChange={(value) => handleInputChange("content", value)}
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* SEO Settings */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
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
            {/* Status Settings */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
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
                      className="w-full px-3 py-2 bg-default-100 border border-default-200 rounded-lg"
                      value={postData.status}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                        )
                      }
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Category */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
              transition={{ duration: 0.5, delay: 0.5 }}
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
                        min="1"
                        placeholder="1"
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
                      startContent={<TagIcon className="w-4 h-4" />}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      isDisabled={!tagInput.trim()}
                      variant="bordered"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Related Articles */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <RelatedArticlesManager
                postSlug={postData.slug}
                postTitle={postData.title}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
