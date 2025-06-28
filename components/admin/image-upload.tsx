"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { PhotoIcon, TrashIcon, FolderIcon } from "@heroicons/react/24/outline";
import { getProjectImageUrl, validateImageFile } from "@/lib/blob-storage";
import BlobStorageManager from "./blob-storage-manager";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageChange: (newImageUrl: string | null) => void;
  folder?: string;
  placeholder?: "default" | "web" | "mobile" | "api" | "database";
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageChange,
  folder = "projects",
  placeholder = "default",
  disabled = false,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showBlobManager, setShowBlobManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onImageChange(result.url);
      } else {
        alert(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl || disabled) return;

    try {
      // Only delete if it's a blob URL (not a placeholder)
      if (currentImageUrl.includes("blob.vercel-storage.com")) {
        const response = await fetch(
          `/api/upload?url=${encodeURIComponent(currentImageUrl)}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("Delete error:", error);
        }
      }

      onImageChange(null);
    } catch (error) {
      console.error("Remove image error:", error);
    }
  };

  const imageUrl = getProjectImageUrl(currentImageUrl, placeholder);

  const placeholderOptions = [
    { key: "default", label: "Default Placeholder" },
    { key: "placeholder-ecommerce", label: "E-Commerce Placeholder" },
    { key: "placeholder-tasks", label: "Task Management Placeholder" },
    { key: "placeholder-web", label: "Web App Placeholder" },
    { key: "placeholder-mobile", label: "Mobile App Placeholder" },
    { key: "placeholder-api", label: "API/Backend Placeholder" },
    { key: "placeholder-database", label: "Database Placeholder" },
  ];

  const handlePlaceholderSelect = (placeholderKey: string) => {
    onImageChange(placeholderKey);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="overflow-hidden">
        <CardBody className="p-0">
          {/* Image Preview */}
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            <img
              src={imageUrl}
              alt="Project image"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = getProjectImageUrl(null, placeholder);
              }}
            />

            {/* Image Overlay Actions */}
            {!disabled && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-70 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    startContent={<PhotoIcon className="w-4 h-4" />}
                    onPress={() => fileInputRef.current?.click()}
                    isLoading={isUploading}
                  >
                    {currentImageUrl ? "Upload New" : "Upload"}
                  </Button>

                  <Button
                    size="sm"
                    color="secondary"
                    variant="flat"
                    startContent={<FolderIcon className="w-4 h-4" />}
                    onPress={() => setShowBlobManager(true)}
                  >
                    Browse
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Action Buttons - Always Visible */}
      {!disabled && (
        <div className="flex gap-2 mb-4">
          {currentImageUrl && (
            <Button
              size="sm"
              color="danger"
              variant="flat"
              startContent={<TrashIcon className="w-4 h-4" />}
              onPress={handleRemoveImage}
            >
              Clear Current Image
            </Button>
          )}
          <Button
            size="sm"
            color="secondary"
            variant="flat"
            startContent={<FolderIcon className="w-4 h-4" />}
            onPress={() => setShowBlobManager(true)}
          >
            Browse Images
          </Button>
        </div>
      )}

      {/* Drag & Drop Upload Area */}
      {!disabled && (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-gray-400"
          } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
          isPressable
          onPress={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardBody className="text-center py-8">
            <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {isUploading
                ? "Uploading..."
                : currentImageUrl
                  ? "Drop new image here or click to browse"
                  : "Drop image here or click to browse"}
            </p>
            <p className="text-xs text-gray-500">
              Supports JPEG, PNG, WebP, GIF (max 5MB)
              {currentImageUrl && (
                <>
                  <br />
                  Use "Clear" button above to remove current image
                </>
              )}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Placeholder Selection */}
      {!disabled && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Or select a placeholder:
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={
                currentImageUrl === "placeholder-ecommerce"
                  ? "solid"
                  : "bordered"
              }
              color="primary"
              onPress={() => handlePlaceholderSelect("placeholder-ecommerce")}
            >
              E-Commerce
            </Button>
            <Button
              size="sm"
              variant={
                currentImageUrl === "placeholder-tasks" ? "solid" : "bordered"
              }
              color="primary"
              onPress={() => handlePlaceholderSelect("placeholder-tasks")}
            >
              Task Management
            </Button>
            <Button
              size="sm"
              variant={
                currentImageUrl === "/projects/placeholder.png"
                  ? "solid"
                  : "bordered"
              }
              color="primary"
              onPress={() =>
                handlePlaceholderSelect("/projects/placeholder.png")
              }
            >
              Default
            </Button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Blob Storage Manager Modal */}
      <BlobStorageManager
        isOpen={showBlobManager}
        onClose={() => setShowBlobManager(false)}
        onSelectImage={(imageUrl) => {
          onImageChange(imageUrl);
          setShowBlobManager(false);
        }}
        currentImageUrl={currentImageUrl || undefined}
      />
    </div>
  );
}
