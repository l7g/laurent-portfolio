import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function restructurePortfolio() {
  console.log("🔧 Restructuring portfolio with Option 3...");

  try {
    // 1. Update existing sections with new confident tone
    const aboutSection = await prisma.portfolioSection.findFirst({
      where: { name: "about" },
    });

    if (aboutSection) {
      await prisma.portfolioSection.update({
        where: { id: aboutSection.id },
        data: {
          description:
            "Dedicated full-stack developer with a unique blend of technical expertise and international perspective. Currently advancing my skills through formal education while building real-world solutions.",
        },
      });
      console.log("✅ Updated About section");
    }

    // 2. Rename Skills section to Education & Skills
    const skillsSection = await prisma.portfolioSection.findFirst({
      where: { name: "skills" },
    });

    if (skillsSection) {
      await prisma.portfolioSection.update({
        where: { id: skillsSection.id },
        data: {
          name: "education-skills",
          displayName: "Education & Skills",
          title: "Education & Skills",
          subtitle: "Learning Journey",
          description:
            "Building expertise through formal education and hands-on development. Currently pursuing BSc International Relations while maintaining strong technical capabilities.",
          sortOrder: 2,
        },
      });
      console.log("✅ Updated Skills section to Education & Skills");
    }

    // 3. Update Projects section with more confident tone
    const projectsSection = await prisma.portfolioSection.findFirst({
      where: { name: "projects" },
    });

    if (projectsSection) {
      await prisma.portfolioSection.update({
        where: { id: projectsSection.id },
        data: {
          title: "Featured Projects",
          subtitle: "Technical Solutions",
          description:
            "Real-world applications built with modern technologies. Each project demonstrates problem-solving skills and attention to user experience.",
          sortOrder: 3,
        },
      });
      console.log("✅ Updated Projects section");
    }

    // 4. Create new Blog section (only if it doesn't exist)
    const existingBlogSection = await prisma.portfolioSection.findFirst({
      where: { name: "blog" },
    });

    if (!existingBlogSection) {
      await prisma.portfolioSection.create({
        data: {
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
      console.log("✅ Created new Blog section");
    }

    // 5. Update Contact section
    const contactSection = await prisma.portfolioSection.findFirst({
      where: { name: "contact" },
    });

    if (contactSection) {
      await prisma.portfolioSection.update({
        where: { id: contactSection.id },
        data: {
          title: "Let's Connect",
          subtitle: "Professional Network",
          description:
            "Open to discussing opportunities, collaborations, and innovative projects. Whether you're interested in my technical work or unique academic perspective, I'd value the conversation.",
          sortOrder: 5,
        },
      });
      console.log("✅ Updated Contact section");
    }

    // 6. Update site settings with more confident tone
    const siteDescSetting = await prisma.siteSetting.findFirst({
      where: { key: "site_description" },
    });

    if (siteDescSetting) {
      await prisma.siteSetting.update({
        where: { id: siteDescSetting.id },
        data: {
          value:
            "Full-stack developer combining technical expertise with international relations studies. Building innovative solutions while pursuing academic excellence.",
        },
      });
      console.log("✅ Updated site description");
    }

    const contactDescSetting = await prisma.siteSetting.findFirst({
      where: { key: "contact_description" },
    });

    if (contactDescSetting) {
      await prisma.siteSetting.update({
        where: { id: contactDescSetting.id },
        data: {
          value:
            "I bring a unique perspective combining technical proficiency with international relations insights. Currently available for opportunities that value both coding expertise and global awareness. Let's discuss how my dual focus can contribute to your team or project.",
        },
      });
      console.log("✅ Updated contact description");
    }

    console.log("🎉 Portfolio restructured successfully!");
  } catch (error) {
    console.error("❌ Error restructuring portfolio:", error);
  } finally {
    await prisma.$disconnect();
  }
}

restructurePortfolio();
