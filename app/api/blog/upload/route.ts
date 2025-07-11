import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { BlobStorage, validateImageFile } from "@/lib/blob-storage";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "blog";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate image file
    const validation = validateImageFile(file);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload to blob storage with optimized settings for blog images
    const blobUrl = await BlobStorage.uploadImage(file, folder);

    return NextResponse.json({
      success: true,
      url: blobUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: "Blog image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading blog image:", error);

    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
