"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import React from "react";

interface PageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  page?: any;
  onSave: (pageData: any) => void;
}

const layoutOptions = [
  { value: "portfolio", label: "Portfolio Layout" },
  { value: "projects-gallery", label: "Projects Gallery" },
  { value: "blog-listing", label: "Blog Listing" },
  { value: "about-extended", label: "Extended About" },
  { value: "custom", label: "Custom Layout" },
];

export default function PageEditModal({
  isOpen,
  onClose,
  page,
  onSave,
}: PageEditModalProps) {
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
    isHomepage: false,
    sortOrder: 0,
    content: {
      layout: "custom",
      sections: [],
      seoKeywords: [],
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        slug: page.slug || "",
        title: page.title || "",
        description: page.description || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        isPublished: page.isPublished || false,
        isHomepage: page.isHomepage || false,
        sortOrder: page.sortOrder || 0,
        content: {
          layout: page.content?.layout || "custom",
          sections: page.content?.sections || [],
          seoKeywords: page.content?.seoKeywords || [],
        },
      });
    } else {
      setFormData({
        slug: "",
        title: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        isPublished: false,
        isHomepage: false,
        sortOrder: 0,
        content: {
          layout: "custom",
          sections: [],
          seoKeywords: [],
        },
      });
    }
  }, [page]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) {
      alert("Title and slug are required");

      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: !page ? generateSlug(value) : prev.slug, // Only auto-generate slug for new pages
    }));
  };

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">
            {page ? "Edit Page" : "Create New Page"}
          </h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
              Basic Information
            </h4>

            <Input
              isRequired
              label="Page Title"
              placeholder="Enter page title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            <Input
              isRequired
              description="This will be the URL path for your page"
              label="URL Slug"
              placeholder="page-url"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of this page"
                rows={3}
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
              SEO Settings
            </h4>

            <Input
              description="Recommended: 50-60 characters"
              label="Meta Title"
              placeholder="SEO title for search engines"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
              }
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO description for search engines"
                rows={3}
                value={formData.metaDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Recommended: 150-160 characters
              </p>
            </div>
          </div>

          {/* Layout Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
              Layout & Settings
            </h4>

            <div>
              <label className="block text-sm font-medium mb-2">
                Page Layout
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.content.layout}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const layout = e.target.value;

                  setFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, layout },
                  }));
                }}
              >
                <option value="">Select a layout template</option>
                {layoutOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              description="Lower numbers appear first in navigation"
              label="Sort Order"
              placeholder="0"
              type="number"
              value={formData.sortOrder.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sortOrder: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>

          {/* Publishing Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700 uppercase tracking-wide">
              Publishing
            </h4>

            <div className="space-y-3">
              <Switch
                isSelected={formData.isPublished}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, isPublished: value }))
                }
              >
                <span className="text-sm">Publish page</span>
              </Switch>

              <Switch
                isSelected={formData.isHomepage}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, isHomepage: value }))
                }
              >
                <span className="text-sm">Set as homepage</span>
              </Switch>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" isLoading={loading} onPress={handleSubmit}>
            {page ? "Update Page" : "Create Page"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
