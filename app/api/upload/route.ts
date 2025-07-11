import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  BlobStorage,
  validateFile,
  validateImageFile,
} from "@/lib/blob-storage";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";
    const fileType = (formData.get("type") as string) || "image"; // 'image' or 'document'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file based on type
    const validation =
      fileType === "document"
        ? validateFile(file, "document")
        : validateImageFile(file);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload to blob storage
    const blobUrl =
      fileType === "document"
        ? await BlobStorage.uploadFile(file, folder)
        : await BlobStorage.uploadImage(file, folder);

    return NextResponse.json({
      success: true,
      url: blobUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: `${fileType === "document" ? "Document" : "Image"} uploaded successfully`,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Delete from blob storage
    await BlobStorage.deleteImage(url);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
