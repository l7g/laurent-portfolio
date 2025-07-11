import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/contacts - Get all contacts (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contacts = await prisma.contacts.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Failed to fetch contacts:", error);

    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
