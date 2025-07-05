import { prisma } from "../lib/prisma.ts";

async function addProjectsCta() {
  try {
    // Check if the section already exists
    const existingSection = await prisma.section.findUnique({
      where: { name: "projects-cta" },
    });

    if (existingSection) {
      console.log("✅ Projects CTA section already exists");
      return;
    }

    // Create the projects CTA section
    const ctaSection = await prisma.section.create({
      data: {
        name: "projects-cta",
        title: "Ready to Build Something",
        subtitle: "Amazing?",
        description:
          "I specialize in creating custom web applications that solve real business problems. From concept to deployment, I deliver professional solutions that make a difference.",
        content: {
          stats: [
            { value: "5+", label: "Years Experience" },
            { value: "20+", label: "Projects Completed" },
            { value: "100%", label: "Client Satisfaction" },
          ],
          primaryButton: {
            text: "Start Your Project",
            action: "scroll-to-contact",
          },
          secondaryButton: {
            text: "Send Quick Email",
            action: "mailto",
          },
          emailSubject: "Project Inquiry",
          emailBody: "Hi Laurent, I'd like to discuss a project with you.",
          footerText:
            "🚀 Available for freelance projects • 💬 Free consultation • ⚡ Fast turnaround",
        },
        isActive: true,
        sortOrder: 10,
      },
    });

    console.log("✅ Projects CTA section created successfully!");
    console.log("Section ID:", ctaSection.id);

    // Also create a setting for easy customization
    const ctaSetting = await prisma.setting.create({
      data: {
        key: "projects_cta_enabled",
        value: "true",
        category: "display",
        description: "Enable/disable the call-to-action section in projects",
      },
    });

    console.log("✅ Projects CTA setting created successfully!");
  } catch (error) {
    console.error("❌ Error creating projects CTA section:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addProjectsCta();
