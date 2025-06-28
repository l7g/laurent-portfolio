"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getProjectImageUrl, validateImageFile } from "@/lib/blob-storage";

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

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="overflow-hidden">
        <CardBody className="p-0">
          {/* Image Preview */}
          <div className="relative aspect-video bg-gray-100">
            <Image
              src={imageUrl}
              alt="Project image"
              className="object-cover w-full h-full"
              fallbackSrc={getProjectImageUrl(null, placeholder)}
            />

            {/* Image Overlay Actions */}
            {!disabled && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    startContent={<PhotoIcon className="w-4 h-4" />}
                    onPress={() => fileInputRef.current?.click()}
                    isLoading={isUploading}
                  >
                    {currentImageUrl ? "Change" : "Upload"}
                  </Button>

                  {currentImageUrl && !currentImageUrl.includes("/images/") && (
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      startContent={<TrashIcon className="w-4 h-4" />}
                      onPress={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

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
                : "Drop image here or click to browse"}
            </p>
            <p className="text-xs text-gray-500">
              Supports JPEG, PNG, WebP, GIF (max 5MB)
            </p>
          </CardBody>
        </Card>
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
    </div>
  );
}
