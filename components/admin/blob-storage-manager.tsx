"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  TrashIcon,
  PhotoIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

interface BlobImage {
  url: string;
  filename: string;
  uploadedAt: string;
  size?: number;
}

interface BlobStorageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string | null) => void;
  currentImageUrl?: string;
}

export default function BlobStorageManager({
  isOpen,
  onClose,
  onSelectImage,
  currentImageUrl,
}: BlobStorageManagerProps) {
  const [images, setImages] = useState<BlobImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchBlobImages();
    }
  }, [isOpen]);

  const fetchBlobImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blob-storage");
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Failed to fetch blob images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh the image list
        await fetchBlobImages();
        // Auto-select the newly uploaded image
        setSelectedImage(data.url);
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const response = await fetch(
        `/api/upload?url=${encodeURIComponent(imageUrl)}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Remove from local state
        setImages(images.filter((img) => img.url !== imageUrl));
        // Clear selection if this image was selected
        if (selectedImage === imageUrl) {
          setSelectedImage(null);
        }
      } else {
        const error = await response.json();
        alert(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete image");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSelectAndClose = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
      onClose();
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getFilenameFromUrl = (url: string) => {
    try {
      return decodeURIComponent(url.split("/").pop() || "Unknown");
    } catch {
      return "Unknown";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        body: "py-6",
        base: "bg-white dark:bg-gray-900",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Manage Project Images</h2>
          <p className="text-small text-default-500">
            Upload new images or select from existing ones in your Vercel Blob
            Storage
          </p>

          {/* Current Status */}
          <div className="mt-2">
            {currentImageUrl ? (
              <Chip size="sm" color="success" variant="flat">
                Current:{" "}
                {currentImageUrl.includes("placeholder-")
                  ? "Placeholder Image"
                  : currentImageUrl.includes("blob.vercel-storage.com")
                    ? "Blob Storage Image"
                    : "Local Image"}
              </Chip>
            ) : (
              <Chip size="sm" color="default" variant="flat">
                No Image Selected
              </Chip>
            )}
          </div>
        </ModalHeader>

        <ModalBody>
          {/* Upload Section */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CloudArrowUpIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Upload New Image</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && (
                  <Chip color="primary" variant="flat">
                    Uploading...
                  </Chip>
                )}
              </div>
              <p className="text-small text-default-500 mt-2">
                Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
              </p>
            </CardBody>
          </Card>

          {/* Images Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PhotoIcon className="w-5 h-5 text-primary" />
                Your Images ({images.length})
              </h3>
              <Button
                size="sm"
                variant="flat"
                onPress={fetchBlobImages}
                isLoading={loading}
              >
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : images.length === 0 ? (
              <Card>
                <CardBody className="text-center py-8">
                  <PhotoIcon className="w-16 h-16 text-default-300 mx-auto mb-4" />
                  <p className="text-default-500">No images uploaded yet</p>
                  <p className="text-small text-default-400">
                    Upload your first image above
                  </p>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {images.map((image) => (
                  <Card
                    key={image.url}
                    isHoverable
                    isPressable
                    className={`relative transition-all duration-200 group cursor-pointer ${
                      selectedImage === image.url
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    }`}
                    onPress={() => setSelectedImage(image.url)}
                  >
                    <CardBody className="p-0">
                      {/* Image Preview */}
                      <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />

                        {/* Selection Indicator */}
                        {selectedImage === image.url && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* Delete Button */}
                        <div
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card selection
                            setDeleteConfirm(image.url);
                          }}
                        >
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Image Info */}
                      <div className="p-3">
                        <p
                          className="text-small font-medium truncate"
                          title={image.filename}
                        >
                          {getFilenameFromUrl(image.url)}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-tiny text-default-500">
                            {formatFileSize(image.size)}
                          </p>
                          {currentImageUrl === image.url && (
                            <Chip size="sm" color="success" variant="flat">
                              Current
                            </Chip>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <Modal
              isOpen={!!deleteConfirm}
              onClose={() => setDeleteConfirm(null)}
              size="sm"
            >
              <ModalContent>
                <ModalHeader>Confirm Delete</ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete this image? This action
                    cannot be undone.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={() => setDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => handleDeleteImage(deleteConfirm)}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>

          {currentImageUrl && (
            <Button
              color="danger"
              variant="flat"
              onPress={() => {
                onSelectImage(null);
                onClose();
              }}
            >
              Clear Current Image
            </Button>
          )}

          <Button
            color="primary"
            onPress={handleSelectAndClose}
            isDisabled={!selectedImage}
          >
            Select Image
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
