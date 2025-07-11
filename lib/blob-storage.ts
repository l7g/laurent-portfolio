import { put, del, list } from "@vercel/blob";

export class BlobStorage {
  /**
   * Upload a file to Vercel Blob storage (images, documents, etc.)
   * @param file - File to upload
   * @param folder - Folder to organize files (e.g., 'projects', 'profile', 'documents')
   * @returns Promise with blob URL
   */
  static async uploadFile(
    file: File,
    folder: string = "uploads",
  ): Promise<string> {
    try {
      const filename = `${folder}/${Date.now()}-${file.name}`;
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      });

      return blob.url;
    } catch (error) {
      console.error("Error uploading to blob storage:", error);
      throw new Error("Failed to upload file");
    }
  }

  /**
   * Upload an image to Vercel Blob storage
   * @param file - File to upload
   * @param folder - Folder to organize files (e.g., 'projects', 'profile')
   * @returns Promise with blob URL
   */
  static async uploadImage(
    file: File,
    folder: string = "projects",
  ): Promise<string> {
    try {
      const filename = `${folder}/${Date.now()}-${file.name}`;
      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      });

      return blob.url;
    } catch (error) {
      console.error("Error uploading to blob storage:", error);
      throw new Error("Failed to upload image");
    }
  }

  /**
   * Delete an image from Vercel Blob storage
   * @param url - Blob URL to delete
   */
  static async deleteImage(url: string): Promise<void> {
    try {
      await del(url);
    } catch (error) {
      console.error("Error deleting from blob storage:", error);
      throw new Error("Failed to delete image");
    }
  }

  /**
   * List all images in a folder
   * @param folder - Folder to list
   * @returns Promise with array of blob URLs
   */
  static async listImages(folder: string = "projects"): Promise<string[]> {
    try {
      const { blobs } = await list({
        prefix: `${folder}/`,
      });

      return blobs.map((blob) => blob.url);
    } catch (error) {
      console.error("Error listing blob storage:", error);

      return [];
    }
  }

  /**
   * Get optimized image URL with Vercel's image optimization
   * @param blobUrl - Original blob URL
   * @param width - Desired width
   * @param height - Desired height
   * @param quality - Image quality (1-100)
   * @returns Optimized image URL
   */
  static getOptimizedImageUrl(
    blobUrl: string,
    width: number = 800,
    height: number = 600,
    quality: number = 80,
  ): string {
    // Use Next.js Image Optimization API with Vercel Blob
    const params = new URLSearchParams({
      url: blobUrl,
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
    });

    return `/_next/image?${params.toString()}`;
  }
}

// Predefined placeholder configurations
export const PLACEHOLDER_IMAGES = {
  projects: {
    default: "/images/project-placeholder.svg",
    web: "/images/web-project-placeholder.svg",
    mobile: "/images/mobile-project-placeholder.svg",
    api: "/images/api-project-placeholder.svg",
    database: "/images/database-project-placeholder.svg",
  },
  profile: {
    default: "/images/profile-placeholder.svg",
    avatar: "/images/avatar-placeholder.svg",
  },
} as const;

/**
 * Get project image URL with fallback to placeholder
 * @param imageUrl - Project image URL (can be blob URL or null)
 * @param projectType - Type of project for appropriate placeholder
 * @returns Image URL or placeholder
 */
export function getProjectImageUrl(
  imageUrl: string | null | undefined,
  projectType: keyof typeof PLACEHOLDER_IMAGES.projects = "default",
): string {
  if (imageUrl && imageUrl.trim()) {
    // Handle custom placeholder types (map to appropriate placeholder images)
    if (imageUrl.startsWith("placeholder-")) {
      switch (imageUrl) {
        case "placeholder-tasks":
          return PLACEHOLDER_IMAGES.projects.web; // Task management is web-based
        case "placeholder-ecommerce":
          return PLACEHOLDER_IMAGES.projects.web; // E-commerce is web-based
        case "placeholder-api":
          return PLACEHOLDER_IMAGES.projects.api;
        case "placeholder-mobile":
          return PLACEHOLDER_IMAGES.projects.mobile;
        case "placeholder-database":
          return PLACEHOLDER_IMAGES.projects.database;
        default:
          return PLACEHOLDER_IMAGES.projects.default;
      }
    }

    return imageUrl;
  }

  return (
    PLACEHOLDER_IMAGES.projects[projectType] ||
    PLACEHOLDER_IMAGES.projects.default
  );
}

/**
 * Validate file for upload (images and documents)
 * @param file - File to validate
 * @param type - File type expected ('image' or 'document')
 * @returns Validation result
 */
export function validateFile(
  file: File,
  type: "image" | "document" = "image",
): {
  valid: boolean;
  error?: string;
} {
  if (type === "image") {
    return validateImageFile(file);
  }

  const maxSize = 10 * 1024 * 1024; // 10MB for documents
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Please upload documents smaller than 10MB.",
    };
  }

  return { valid: true };
}

/**
 * Validate file for image upload
 * @param file - File to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Please upload images smaller than 5MB.",
    };
  }

  return { valid: true };
}
