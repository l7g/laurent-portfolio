import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST() {
  try {
    // Check if the section already exists
    const existingSection = await prisma.portfolio_sections.findFirst({
      where: { name: "projects-cta" },
    });

    if (existingSection) {
      return NextResponse.json({
        message: "Projects CTA section already exists",
        section: existingSection,
      });
    }

    // Create the new section
    const newSection = await prisma.portfolio_sections.create({
      data: {
        id: randomUUID(),
        name: "projects-cta",
        displayName: "Projects CTA",
        sectionType: "CUSTOM",
        title: "Ready to Build Something Amazing?",
        subtitle: "Let's Work Together",
        description:
          "I'm passionate about creating innovative solutions that make a real difference. Whether you need a complete web application, want to modernize your existing system, or have a unique project in mind, I'd love to help bring your vision to life.",
        isActive: true,
        sortOrder: 15,
        updatedAt: new Date(),
        content: {
          headline: "Ready to Build Something Amazing?",
          subheadline: "Let's Work Together",
          description:
            "I'm passionate about creating innovative solutions that make a real difference. Whether you need a complete web application, want to modernize your existing system, or have a unique project in mind, I'd love to help bring your vision to life.",
          stats: [
            {
              value: "10+",
              label: "Projects Completed",
              description: "Full-stack applications delivered",
            },
            {
              value: "2+",
              label: "Years Experience",
              description: "Professional development",
            },
            {
              value: "100%",
              label: "Client Satisfaction",
              description: "Focused on quality delivery",
            },
          ],
          benefits: [
            {
              title: "Custom Solutions",
              description:
                "Tailored applications built specifically for your needs and requirements",
              icon: "code",
            },
            {
              title: "Modern Technology",
              description:
                "Latest frameworks and tools for scalable, maintainable code",
              icon: "tech",
            },
            {
              title: "Collaborative Process",
              description:
                "Regular communication and feedback throughout the development process",
              icon: "team",
            },
            {
              title: "Ongoing Support",
              description:
                "Post-launch support and maintenance to ensure your application thrives",
              icon: "support",
            },
          ],
          ctaButtons: [
            {
              text: "Start Your Project",
              type: "primary",
              action: "scroll",
              target: "#contact",
              icon: "arrow-right",
            },
            {
              text: "View My Work",
              type: "secondary",
              action: "link",
              target: "/projects",
              icon: "external-link",
            },
          ],
        },
      },
    });

    return NextResponse.json({
      message: "Projects CTA section created successfully!",
      section: newSection,
    });
  } catch (error) {
    console.error("Error creating projects CTA section:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to create projects CTA section",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
