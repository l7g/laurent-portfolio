import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🧹 Starting database cleanup and setup...");

    // Step 1: Remove duplicates - keep the first one of each name
    const sections = await prisma.portfolioSection.findMany({
      orderBy: { createdAt: "asc" },
    });

    const sectionsByName: { [key: string]: any[] } = {};
    sections.forEach((section) => {
      if (!sectionsByName[section.name]) {
        sectionsByName[section.name] = [];
      }
      sectionsByName[section.name].push(section);
    });

    let deletedCount = 0;
    const keptSections = [];

    // Remove duplicates
    for (const [name, sectionsWithName] of Object.entries(sectionsByName)) {
      if (sectionsWithName.length > 1) {
        // Keep the first one, delete the rest
        const [keep, ...toDelete] = sectionsWithName;
        keptSections.push(keep);

        for (const section of toDelete) {
          await prisma.portfolioSection.delete({
            where: { id: section.id },
          });
          deletedCount++;
          console.log(`🗑️ Deleted duplicate: ${section.name} (${section.id})`);
        }
      } else {
        keptSections.push(sectionsWithName[0]);
      }
    }

    // Step 2: Add missing projects-cta section
    const ctaSection = await prisma.portfolioSection.findFirst({
      where: { name: "projects-cta" },
    });

    let ctaCreated = false;
    if (!ctaSection) {
      const newCta = await prisma.portfolioSection.create({
        data: {
          name: "projects-cta",
          displayName: "Projects Call to Action",
          sectionType: "CUSTOM",
          title: "Ready to Build Something Amazing?",
          subtitle: "Let's Work Together",
          description:
            "I'm passionate about creating innovative solutions that make a real difference. Whether you need a complete web application, want to modernize your existing system, or have a unique project in mind, I'd love to help bring your vision to life.",
          isActive: true,
          sortOrder: 15,
          content: {
            headline: "Ready to Build Something Amazing?",
            subheadline: "Let's Work Together",
            description:
              "I specialize in creating custom web applications that solve real business problems. From concept to deployment, I deliver professional solutions that make a difference.",
            stats: [
              {
                value: "5+",
                label: "Years Experience",
                description: "Professional development",
              },
              {
                value: "20+",
                label: "Projects Completed",
                description: "Full-stack applications delivered",
              },
              {
                value: "100%",
                label: "Client Satisfaction",
                description: "Focused on quality delivery",
              },
            ],
            primaryButton: {
              text: "Start Your Project",
              action: "scroll",
              target: "#contact",
            },
            secondaryButton: {
              text: "Send Quick Email",
              action: "email",
            },
            emailSubject: "Project Inquiry - Let's Build Something Amazing",
            emailBody:
              "Hi Laurent,\n\nI'm interested in discussing a project with you. Here are some details:\n\n- Project type: \n- Timeline: \n- Budget range: \n\nLooking forward to hearing from you!\n\nBest regards,",
            footerText:
              "🚀 Available for freelance projects • 💬 Free consultation • ⚡ Fast turnaround",
          },
        },
      });
      ctaCreated = true;
      console.log(`✅ Created projects-cta section: ${newCta.id}`);
    }

    // Step 3: Ensure proper sort order for all sections
    const finalSections = await prisma.portfolioSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const sortOrderMap: { [key: string]: number } = {
      hero: 1,
      about: 2,
      "education-skills": 3,
      projects: 4,
      "projects-cta": 5,
      blog: 6,
      contact: 7,
    };

    let updatedCount = 0;
    for (const section of finalSections) {
      const expectedOrder = sortOrderMap[section.name];
      if (expectedOrder && section.sortOrder !== expectedOrder) {
        await prisma.portfolioSection.update({
          where: { id: section.id },
          data: { sortOrder: expectedOrder },
        });
        updatedCount++;
        console.log(
          `📝 Updated ${section.name} sort order to ${expectedOrder}`,
        );
      }
    }

    // Step 4: Get final state
    const cleanedSections = await prisma.portfolioSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Database cleanup and setup completed successfully!",
      actions: {
        duplicatesRemoved: deletedCount,
        ctaCreated,
        sortOrderUpdated: updatedCount,
      },
      finalSections: cleanedSections.map((s) => ({
        id: s.id,
        name: s.name,
        displayName: s.displayName,
        sectionType: s.sectionType,
        isActive: s.isActive,
        sortOrder: s.sortOrder,
      })),
    });
  } catch (error) {
    console.error("Error in cleanup and setup:", error);
    return NextResponse.json(
      {
        error: "Failed to cleanup and setup database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
