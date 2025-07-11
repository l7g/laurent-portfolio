import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SectionType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

// This endpoint should only be used once for initial setup
// Remove or disable after first use!
export async function POST(request: NextRequest) {
  try {
    // Safety check - only allow in development or with special key
    const setupKey = request.headers.get("x-setup-key");
    const expectedKey = process.env.SETUP_SECRET_KEY;

    if (!expectedKey || setupKey !== expectedKey) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid setup key" },
        { status: 401 },
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.users.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user already exists",
        admin: { email: existingAdmin.email, name: existingAdmin.name },
      });
    }

    // Get credentials from environment or request body
    const body = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || body.email;
    const adminPassword = process.env.ADMIN_PASSWORD || body.password;
    const adminName = process.env.ADMIN_NAME || body.name || "Admin";

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin email and password are required" },
        { status: 400 },
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: adminEmail,
        name: adminName,
        role: "ADMIN",
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Create basic portfolio data
    const sections = [
      {
        id: randomUUID(),
        name: "hero",
        displayName: "Hero Section",
        sectionType: SectionType.HERO,
        title: "Welcome",
        subtitle: "Full-Stack Developer",
        description: "Building Modern Software Solutions",
        content: JSON.stringify({
          description:
            "Passionate about creating scalable, user-focused solutions with cutting-edge technologies.",
        }),
        isActive: true,
        sortOrder: 1,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "about",
        displayName: "About Section",
        sectionType: SectionType.ABOUT,
        title: "About Me",
        description:
          "Experienced developer with expertise in modern web technologies.",
        isActive: true,
        sortOrder: 2,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "projects",
        displayName: "Projects Section",
        sectionType: SectionType.PROJECTS,
        title: "Featured Projects",
        description: "Showcasing my work and technical capabilities.",
        isActive: true,
        sortOrder: 3,
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "contact",
        displayName: "Contact Section",
        sectionType: SectionType.CONTACT,
        title: "Get In Touch",
        description: "Let's discuss your next project.",
        isActive: true,
        sortOrder: 4,
        updatedAt: new Date(),
      },
    ];

    for (const section of sections) {
      const existing = await prisma.portfolio_sections.findFirst({
        where: { name: section.name },
      });

      if (!existing) {
        await prisma.portfolio_sections.create({ data: section });
      }
    }

    return NextResponse.json({
      message: "Setup completed successfully!",
      admin: { email: admin.email, name: admin.name },
      next_steps: [
        "Visit /admin to access the dashboard",
        "Add your projects and customize content",
        "Upload project images",
        "IMPORTANT: Disable this setup endpoint!",
      ],
    });
  } catch (error) {
    console.error("Setup error:", error);

    return NextResponse.json(
      {
        error: "Setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
