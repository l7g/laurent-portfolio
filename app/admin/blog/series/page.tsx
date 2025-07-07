"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  TagIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { title } from "@/components/primitives";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BlogSeries {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  color: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  authorId: string;
  totalPosts: number;
  estimatedTime?: number;
  difficulty?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    blog_posts: number;
  };
  users: {
    id: string;
    name: string;
    email: string;
  };
}

interface SeriesFormData {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  color: string;
  icon: string;
  difficulty: string;
  estimatedTime: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}

const difficultyOptions = [
  { value: "beginner", label: "Beginner", color: "#10B981" },
  { value: "intermediate", label: "Intermediate", color: "#F59E0B" },
  { value: "advanced", label: "Advanced", color: "#EF4444" },
  { value: "expert", label: "Expert", color: "#8B5CF6" },
];

const colorOptions = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

export default function SeriesManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSeries, setEditingSeries] = useState<BlogSeries | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState<SeriesFormData>({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    color: "#3B82F6",
    icon: "📚",
    difficulty: "beginner",
    estimatedTime: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
  });

  // Define functions before hooks that use them
  const fetchSeries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/blog/series");
      if (response.ok) {
        const data = await response.json();
        setSeries(data);
      }
    } catch (error) {
      console.error("Failed to fetch series:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      coverImage: "",
      color: "#3B82F6",
      icon: "📚",
      difficulty: "beginner",
      estimatedTime: "",
      tags: [],
      metaTitle: "",
      metaDescription: "",
    });
    setEditingSeries(null);
    setTagInput("");
  };

  // All hooks must be at the top level
  useEffect(() => {
    fetchSeries();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !editingSeries) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, editingSeries]);

  // Handle authentication after all hooks
  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user?.role !== "ADMIN") {
    router.push("/admin/login");
    return null;
  }

  const handleInputChange = (field: keyof SeriesFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
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

  const handleEdit = (seriesItem: BlogSeries) => {
    setEditingSeries(seriesItem);
    setFormData({
      title: seriesItem.title,
      slug: seriesItem.slug,
      description: seriesItem.description || "",
      coverImage: seriesItem.coverImage || "",
      color: seriesItem.color,
      icon: seriesItem.icon || "📚",
      difficulty: seriesItem.difficulty || "beginner",
      estimatedTime: seriesItem.estimatedTime?.toString() || "",
      tags: seriesItem.tags || [],
      metaTitle: seriesItem.metaTitle || "",
      metaDescription: seriesItem.metaDescription || "",
    });
    onOpen();
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      alert("Please fill in title and slug");
      return;
    }

    setSaving(true);
    try {
      const url = editingSeries
        ? `/api/admin/blog/series/${editingSeries.id}`
        : "/api/admin/blog/series";

      const method = editingSeries ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          estimatedTime: formData.estimatedTime
            ? parseInt(formData.estimatedTime)
            : null,
        }),
      });

      if (response.ok) {
        await fetchSeries();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save series");
      }
    } catch (error) {
      console.error("Error saving series:", error);
      alert("Failed to save series");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this series? This action cannot be undone.",
      )
    ) {
      try {
        const response = await fetch(`/api/admin/blog/series/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setSeries(series.filter((s) => s.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete series:", error);
      }
    }
  };

  const filteredSeries = series.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
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
            <div className="h-8 bg-default-300 rounded w-1/4"></div>
            <div className="h-12 bg-default-300 rounded"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-default-300 rounded"></div>
            ))}
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
                <h1 className={title({ size: "lg" })}>Series Management</h1>
                <p className="text-default-600 mt-2">
                  Create and manage blog series to organize your content
                </p>
              </div>
            </div>
            <Button
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={() => {
                resetForm();
                onOpen();
              }}
            >
              New Series
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Input
            placeholder="Search series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
            className="max-w-sm"
          />
        </motion.div>

        {/* Series Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSeries.map((seriesItem) => (
            <Card
              key={seriesItem.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: seriesItem.color }}
                    >
                      {seriesItem.icon || "📚"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {seriesItem.title}
                      </h3>
                      <p className="text-sm text-default-600">
                        {seriesItem.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onClick={() => handleEdit(seriesItem)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onClick={() => handleDelete(seriesItem.id)}
                      color="danger"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-2">
                <div className="space-y-3">
                  {seriesItem.description && (
                    <p className="text-sm text-default-700 line-clamp-2">
                      {seriesItem.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-default-600">
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="w-4 h-4" />
                      {seriesItem._count.blog_posts} posts
                    </div>
                    {seriesItem.estimatedTime && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {seriesItem.estimatedTime}min
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {seriesItem.difficulty && (
                      <Chip
                        size="sm"
                        variant="flat"
                        style={{
                          backgroundColor: `${difficultyOptions.find((d) => d.value === seriesItem.difficulty)?.color}20`,
                          color: difficultyOptions.find(
                            (d) => d.value === seriesItem.difficulty,
                          )?.color,
                        }}
                      >
                        <AcademicCapIcon className="w-3 h-3 mr-1" />
                        {seriesItem.difficulty}
                      </Chip>
                    )}
                    {seriesItem.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag} size="sm" variant="bordered">
                        {tag}
                      </Chip>
                    ))}
                    {seriesItem.tags.length > 2 && (
                      <span className="text-xs text-default-500">
                        +{seriesItem.tags.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-default-500 pt-2 border-t">
                    Updated {formatDate(seriesItem.updatedAt)}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </motion.div>

        {filteredSeries.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
            <p className="text-default-600">No series found</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingSeries ? "Edit Series" : "Create New Series"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Series Title"
                      placeholder="Enter series title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="URL Slug"
                      placeholder="series-slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      isRequired
                    />
                  </div>

                  <Textarea
                    label="Description"
                    placeholder="Brief description of the series"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    minRows={3}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Icon/Emoji"
                      placeholder="📚"
                      value={formData.icon}
                      onChange={(e) =>
                        handleInputChange("icon", e.target.value)
                      }
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Color
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              formData.color === color
                                ? "border-black"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleInputChange("color", color)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) =>
                          handleInputChange("difficulty", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-default-100 border border-default-200 rounded-lg"
                      >
                        {difficultyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Estimated Time (minutes)"
                      type="number"
                      placeholder="60"
                      value={formData.estimatedTime}
                      onChange={(e) =>
                        handleInputChange("estimatedTime", e.target.value)
                      }
                    />
                    <Input
                      label="Cover Image URL"
                      placeholder="https://example.com/image.jpg"
                      value={formData.coverImage}
                      onChange={(e) =>
                        handleInputChange("coverImage", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {formData.tags.map((tag) => (
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
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">SEO Settings</h3>
                    <Input
                      label="Meta Title"
                      placeholder="SEO-optimized title"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        handleInputChange("metaTitle", e.target.value)
                      }
                    />
                    <Textarea
                      label="Meta Description"
                      placeholder="SEO description for search engines"
                      value={formData.metaDescription}
                      onChange={(e) =>
                        handleInputChange("metaDescription", e.target.value)
                      }
                      minRows={2}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={saving}
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave} isLoading={saving}>
                  {editingSeries ? "Update Series" : "Create Series"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
