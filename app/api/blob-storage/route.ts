import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // List all blobs in the storage
    const { blobs } = await list();

    // Filter for images and format the response
    const images = blobs
      .filter(
        (blob) =>
          blob.pathname.startsWith("projects/") &&
          /\.(jpg|jpeg|png|gif|webp)$/i.test(blob.pathname),
      )
      .map((blob) => ({
        url: blob.url,
        filename: blob.pathname.split("/").pop() || "Unknown",
        uploadedAt: blob.uploadedAt,
        size: blob.size,
      }))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      );

    return NextResponse.json({
      images,
      count: images.length,
    });
  } catch (error) {
    console.error("Blob storage list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
