#!/usr/bin/env node

/**
 * Deployment Seed Script
 * Seeds only missing entities and uses environment variables for admin setup
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

// Load environment variables (only in development)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting smart deployment seeding...");

  // Get admin info from environment variables
  const adminEmail =
    process.env.ADMIN_EMAIL || "laurentgagne.portfolio@gmail.com";
  const adminName = process.env.ADMIN_NAME || "Laurent Gagné";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  console.log(`👤 Setting up admin user: ${adminEmail}`);

  // Helper function to add required fields
  const addRequiredFields = (data) => ({
    ...data,
    id: randomUUID(),
    updatedAt: new Date(),
  });

  // Create/update admin user only if it doesn't exist or needs updating
  const existingAdmin = await prisma.users.findUnique({
    where: { email: adminEmail },
  });

  let admin;
  if (!existingAdmin) {
    console.log("� Creating new admin user...");
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    admin = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: "ADMIN",
        updatedAt: new Date(),
      },
    });
  } else {
    console.log("✅ Admin user already exists, updating if needed...");
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    admin = await prisma.users.update({
      where: { email: adminEmail },
      data: {
        name: adminName,
        password: hashedPassword,
        role: "ADMIN",
        updatedAt: new Date(),
      },
    });
  }

  // Check and create default site settings only if missing
  const defaultSettings = [
    {
      key: "site_title",
      value: "Laurent Gagné - Portfolio",
      type: "text",
      description: "Main site title",
    },
    {
      key: "site_description",
      value:
        "Full-stack developer passionate about creating innovative solutions",
      type: "text",
      description: "Site meta description",
    },
    {
      key: "hero_image",
      value: "/hero-image.png",
      type: "text",
      description: "Hero section background image",
    },
    {
      key: "profile_image",
      value: "/profile-image.jpg",
      type: "text",
      description: "Profile photo",
    },
    {
      key: "github_url",
      value: "https://github.com/laurentgagne",
      type: "text",
      description: "GitHub profile URL",
    },
    {
      key: "linkedin_url",
      value: "https://linkedin.com/in/laurentgagne",
      type: "text",
      description: "LinkedIn profile URL",
    },
    {
      key: "email",
      value: adminEmail,
      type: "text",
      description: "Contact email",
    },
    {
      key: "phone",
      value: "+1 (555) 123-4567",
      type: "text",
      description: "Contact phone",
    },
    {
      key: "location",
      value: "Montreal, Canada",
      type: "text",
      description: "Location",
    },
    {
      key: "primary_color",
      value: "#f98a07",
      type: "text",
      description: "Primary brand color",
    },
    {
      key: "resume_url",
      value: "/Laurent_Cv.pdf",
      type: "text",
      description: "Resume/CV download link",
    },
  ];

  console.log("⚙️ Checking site settings...");
  let settingsCreated = 0;
  for (const setting of defaultSettings) {
    const existing = await prisma.site_settings.findUnique({
      where: { key: setting.key },
    });

    if (!existing) {
      await prisma.site_settings.create({
        data: addRequiredFields(setting),
      });
      settingsCreated++;
    }
  }
  console.log(`📝 Created ${settingsCreated} missing site settings`);

  // Check and create default blog categories only if missing
  const defaultCategories = [
    {
      name: "Tech & Development",
      slug: "tech-development",
      description: "Programming, web development, and technology insights",
      color: "#3b82f6",
      icon: "💻",
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Career & Growth",
      slug: "career-growth",
      description: "Professional development and career advice",
      color: "#10b981",
      icon: "📈",
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Personal Insights",
      slug: "personal-insights",
      description: "Personal thoughts and life experiences",
      color: "#8b5cf6",
      icon: "💭",
      isActive: true,
      sortOrder: 3,
    },
  ];

  console.log("📂 Checking blog categories...");
  let categoriesCreated = 0;
  for (const category of defaultCategories) {
    // Check by both slug and name to avoid conflicts
    const existingBySlug = await prisma.blog_categories.findUnique({
      where: { slug: category.slug },
    });
    const existingByName = await prisma.blog_categories.findFirst({
      where: { name: category.name },
    });

    if (!existingBySlug && !existingByName) {
      await prisma.blog_categories.create({
        data: addRequiredFields(category),
      });
      categoriesCreated++;
    }
  }
  console.log(`📂 Created ${categoriesCreated} missing blog categories`);

  // Check and create default skills only if missing
  const existingSkillsCount = await prisma.skills.count();
  if (existingSkillsCount === 0) {
    console.log("🎯 Creating default skills...");
    const defaultSkills = [
      {
        name: "JavaScript",
        category: "Programming Languages",
        proficiency: 90,
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "TypeScript",
        category: "Programming Languages",
        proficiency: 85,
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "React",
        category: "Frontend Frameworks",
        proficiency: 88,
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Next.js",
        category: "Frontend Frameworks",
        proficiency: 85,
        isActive: true,
        sortOrder: 4,
      },
      {
        name: "Node.js",
        category: "Backend Technologies",
        proficiency: 82,
        isActive: true,
        sortOrder: 5,
      },
    ];

    for (const skill of defaultSkills) {
      await prisma.skills.create({
        data: addRequiredFields(skill),
      });
    }
    console.log(`🎯 Created ${defaultSkills.length} default skills`);
  } else {
    console.log("✅ Skills already exist, skipping...");
  }

  console.log("✅ Smart deployment seeding completed successfully!");
  console.log(`👤 Admin user: ${admin.email} (${admin.role})`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Deployment seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
