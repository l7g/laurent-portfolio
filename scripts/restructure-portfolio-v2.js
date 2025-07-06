import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function restructurePortfolio() {
  console.log("🔧 Restructuring portfolio with Option 3...");

  try {
    // Helper function to find and update sections
    const updateSection = async (name, updates) => {
      const section = await prisma.portfolio_sections.findFirst({
        where: { name },
      });
      if (section) {
        return await prisma.portfolio_sections.update({
          where: { id: section.id },
          data: updates,
        });
      }
      return null;
    };

    // 1. Update existing sections with new confident tone
    console.log("Updating About section...");
    await updateSection("about", {
      description:
        "Dedicated full-stack developer with a unique blend of technical expertise and international perspective. Currently advancing my skills through formal education while building real-world solutions.",
    });

    // 2. Rename Skills section to Education & Skills
    console.log("Updating Skills section...");
    await updateSection("skills", {
      name: "education-skills",
      displayName: "Education & Skills",
      title: "Education & Skills",
      subtitle: "Learning Journey",
      description:
        "Building expertise through formal education and hands-on development. Currently pursuing BSc International Relations while maintaining strong technical capabilities.",
      sortOrder: 2,
    });

    // 3. Update Projects section with more confident tone
    console.log("Updating Projects section...");
    await updateSection("projects", {
      title: "Featured Projects",
      subtitle: "Technical Solutions",
      description:
        "Real-world applications built with modern technologies. Each project demonstrates problem-solving skills and attention to user experience.",
      sortOrder: 3,
    });

    // 4. Create new Blog section
    console.log("Creating Blog section...");
    const existingBlog = await prisma.portfolio_sections.findFirst({
      where: { name: "blog" },
    });

    if (!existingBlog) {
      await prisma.portfolio_sections.create({
        data: {
          id: randomUUID(),
          name: "blog",
          displayName: "Blog & Insights",
          sectionType: "CUSTOM",
          title: "Latest",
          subtitle: "Insights",
          description:
            "Sharing thoughts on technology, development practices, and international relations. Bridging technical innovation with global perspectives.",
          isActive: true,
          sortOrder: 4,
          content: {
            showLatestCount: 3,
            showCategories: true,
            style: "card-grid",
          },
        },
      });
    }

    // 5. Update Contact section
    console.log("Updating Contact section...");
    await updateSection("contact", {
      title: "Let's Connect",
      subtitle: "Professional Network",
      description:
        "Open to discussing opportunities, collaborations, and innovative projects. Whether you're interested in my technical work or unique academic perspective, I'd value the conversation.",
      sortOrder: 5,
    });

    // 6. Update site settings with more confident tone
    console.log("Updating site settings...");
    const updateSetting = async (key, value) => {
      await prisma.site_settings.upsert({
        where: { key },
        update: { value },
        create: { key, value, type: "text", description: `Updated ${key}` },
      });
    };

    await updateSetting(
      "site_description",
      "Full-stack developer combining technical expertise with international relations studies. Building innovative solutions while pursuing academic excellence.",
    );

    await updateSetting(
      "contact_description",
      "I bring a unique perspective combining technical proficiency with international relations insights. Currently available for opportunities that value both coding expertise and global awareness. Let's discuss how my dual focus can contribute to your team or project.",
    );

    console.log("✅ Portfolio restructured successfully!");
  } catch (error) {
    console.error("❌ Error restructuring portfolio:", error);
  } finally {
    await prisma.$disconnect();
  }
}

restructurePortfolio();
