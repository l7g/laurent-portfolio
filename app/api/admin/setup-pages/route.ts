import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    console.log("📄 Setting up initial pages...");

    // Check if pages already exist
    const existingPages = await prisma.portfolio_pages.findMany();

    if (existingPages.length > 0) {
      return NextResponse.json({
        message: "Pages already exist",
        pages: existingPages,
      });
    }

    // Create initial pages
    const initialPages = [
      {
        slug: "home",
        title: "Home",
        description: "Main landing page showcasing Laurent's portfolio",
        metaTitle: "Laurent Gagné - Full-Stack Developer Portfolio",
        metaDescription:
          "Full-stack developer specializing in modern web applications, React, Next.js, and database solutions.",
        isPublished: true,
        isHomepage: true,
        sortOrder: 1,
        content: {
          layout: "portfolio",
          sections: [
            "hero",
            "about",
            "education-skills",
            "projects",
            "projects-cta",
            "blog",
            "contact",
          ],
          seoKeywords: [
            "full-stack developer",
            "web development",
            "React",
            "Next.js",
            "portfolio",
          ],
        },
      },
      {
        slug: "projects",
        title: "Projects",
        description: "Complete showcase of development projects",
        metaTitle: "Projects - Laurent Gagné Portfolio",
        metaDescription:
          "Explore my complete portfolio of web development projects, from React applications to full-stack solutions.",
        isPublished: true,
        isHomepage: false,
        sortOrder: 2,
        content: {
          layout: "projects-gallery",
          showAll: true,
          filters: ["frontend", "full-stack", "featured"],
          seoKeywords: [
            "web projects",
            "portfolio",
            "React applications",
            "full-stack development",
          ],
        },
      },
      {
        slug: "blog",
        title: "Blog & Insights",
        description: "Thoughts on technology, development, and innovation",
        metaTitle: "Blog - Laurent Gagné",
        metaDescription:
          "Articles about web development, technology trends, and programming insights.",
        isPublished: true,
        isHomepage: false,
        sortOrder: 3,
        content: {
          layout: "blog-listing",
          postsPerPage: 10,
          categories: ["Tech", "Development", "Career"],
          seoKeywords: [
            "tech blog",
            "development articles",
            "programming insights",
          ],
        },
      },
      {
        slug: "about",
        title: "About Me",
        description:
          "Extended information about Laurent's background and expertise",
        metaTitle: "About Laurent Gagné - Full-Stack Developer",
        metaDescription:
          "Learn more about Laurent's journey in software development, education, and professional experience.",
        isPublished: true,
        isHomepage: false,
        sortOrder: 4,
        content: {
          layout: "about-extended",
          sections: ["personal-story", "education", "skills", "experience"],
          seoKeywords: [
            "about developer",
            "software engineer background",
            "professional experience",
          ],
        },
      },
    ];

    const createdPages = [];

    for (const pageData of initialPages) {
      const page = await prisma.portfolio_pages.create({
        data: {
          ...pageData,
          id: randomUUID(),
          updatedAt: new Date(),
        },
      });

      createdPages.push(page);
      console.log(`✅ Created page: ${page.title} (${page.slug})`);
    }

    return NextResponse.json({
      success: true,
      message: "Initial pages created successfully!",
      pages: createdPages,
    });
  } catch (error) {
    console.error("Error setting up pages:", error);

    return NextResponse.json(
      {
        error: "Failed to setup pages",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
