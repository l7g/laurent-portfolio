import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all portfolio sections
    const sections = await prisma.portfolio_sections.findMany({
      orderBy: { sortOrder: "asc" },
    });

    // Group by name to find duplicates
    const sectionsByName: { [key: string]: any[] } = {};

    sections.forEach((section) => {
      if (!sectionsByName[section.name]) {
        sectionsByName[section.name] = [];
      }
      sectionsByName[section.name].push(section);
    });

    // Identify duplicates
    const duplicates: { [key: string]: any[] } = {};
    const unique: { [key: string]: any } = {};

    Object.keys(sectionsByName).forEach((name) => {
      const sectionsWithName = sectionsByName[name];

      if (sectionsWithName.length > 1) {
        duplicates[name] = sectionsWithName;
      } else {
        unique[name] = sectionsWithName[0];
      }
    });

    // Check for projects-cta section
    const ctaSection = sections.find((s) => s.name === "projects-cta");

    return NextResponse.json({
      total: sections.length,
      unique: Object.keys(unique).length,
      duplicates: Object.keys(duplicates).length,
      duplicateDetails: duplicates,
      uniqueSections: unique,
      hasProjectsCta: !!ctaSection,
      ctaSection: ctaSection || null,
      allSections: sections.map((s) => ({
        id: s.id,
        name: s.name,
        displayName: s.displayName,
        sectionType: s.sectionType,
        isActive: s.isActive,
        sortOrder: s.sortOrder,
      })),
    });
  } catch (error) {
    console.error("Error analyzing sections:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze sections",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
