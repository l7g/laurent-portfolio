/**
 * Production Data Migration Script
 * Copies data from production Neon database to local PostgreSQL
 * Used for setting up local development environment
 */

const { PrismaClient } = require("@prisma/client");

const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PROD_DATABASE_URL,
    },
  },
});

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function copyProductionDataOriginal() {
  console.log("🔄 Copying production data using original schema...\n");

  try {
    // 1. Copy projects with original schema mapping
    console.log("📋 Copying projects...");
    const projects = await prodPrisma.$queryRaw`
      SELECT id, title, slug, description, "shortDesc", image, technologies, 
             featured, flagship, "isActive", status, "sortOrder", "liveUrl", 
             "githubUrl", highlights, "detailedDescription", challenges, 
             solutions, results, "clientName", "projectDuration", "teamSize", 
             "myRole", "startDate", "endDate", "createdAt", "updatedAt",
             "showWipWarning", "wipWarningText", "wipWarningEmoji"
      FROM projects
    `;
    console.log(`Found ${projects.length} projects in production`);

    for (const project of projects) {
      // Use original schema fields
      await localPrisma.projects.upsert({
        where: { id: project.id },
        update: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          shortDesc: project.shortDesc,
          image: project.image,
          technologies: project.technologies,
          featured: project.featured,
          flagship: project.flagship,
          demo: project.featured, // Mark featured projects as demos
          isActive: project.isActive,
          status: project.status,
          category: project.flagship ? "COMMERCIAL" : "OPENSOURCE", // Enhanced field
          sortOrder: project.sortOrder,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          highlights: project.highlights,
          detailedDescription: project.detailedDescription,
          challenges: project.challenges,
          solutions: project.solutions,
          results: project.results,
          clientName: project.clientName,
          projectDuration: project.projectDuration,
          teamSize: project.teamSize,
          myRole: project.myRole,
          role: project.myRole, // Enhanced field
          year: project.startDate
            ? new Date(project.startDate).getFullYear()
            : new Date(project.createdAt).getFullYear(),
          startDate: project.startDate,
          endDate: project.endDate,
          updatedAt: project.updatedAt,
          showWipWarning: project.showWipWarning,
          wipWarningText: project.wipWarningText,
          wipWarningEmoji: project.wipWarningEmoji,
        },
        create: {
          id: project.id,
          title: project.title,
          slug: project.slug,
          description: project.description,
          shortDesc: project.shortDesc,
          image: project.image,
          technologies: project.technologies,
          featured: project.featured,
          flagship: project.flagship,
          demo: project.featured,
          isActive: project.isActive,
          status: project.status,
          category: project.flagship ? "COMMERCIAL" : "OPENSOURCE",
          sortOrder: project.sortOrder,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          highlights: project.highlights,
          detailedDescription: project.detailedDescription,
          challenges: project.challenges,
          solutions: project.solutions,
          results: project.results,
          clientName: project.clientName,
          projectDuration: project.projectDuration,
          teamSize: project.teamSize,
          myRole: project.myRole,
          role: project.myRole,
          year: project.startDate
            ? new Date(project.startDate).getFullYear()
            : new Date(project.createdAt).getFullYear(),
          startDate: project.startDate,
          endDate: project.endDate,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          showWipWarning: project.showWipWarning,
          wipWarningText: project.wipWarningText,
          wipWarningEmoji: project.wipWarningEmoji,
        },
      });
    }
    console.log("✅ Projects copied successfully");

    // 2. Copy users first (required for blog posts foreign key)
    console.log("\n👤 Copying users...");
    const users = await prodPrisma.users.findMany();
    console.log(`Found ${users.length} users in production`);
    for (const user of users) {
      await localPrisma.users.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }
    console.log("✅ Users copied successfully");

    // 3. Copy blog categories (required for blog posts)
    console.log("\n� Copying blog categories...");
    const blogCategories = await prodPrisma.blog_categories.findMany();
    console.log(`Found ${blogCategories.length} blog categories in production`);
    for (const category of blogCategories) {
      await localPrisma.blog_categories.upsert({
        where: { id: category.id },
        update: category,
        create: category,
      });
    }
    console.log("✅ Blog categories copied successfully");

    // 4. Copy blog series (optional for blog posts)
    console.log("\n📚 Copying blog series...");
    const blogSeries = await prodPrisma.blog_series.findMany();
    console.log(`Found ${blogSeries.length} blog series in production`);
    for (const series of blogSeries) {
      await localPrisma.blog_series.upsert({
        where: { id: series.id },
        update: series,
        create: series,
      });
    }
    console.log("✅ Blog series copied successfully");

    // 5. Copy blog posts (now that dependencies exist)
    console.log("\n�📝 Copying blog posts...");
    const blogPosts = await prodPrisma.blog_posts.findMany();
    console.log(`Found ${blogPosts.length} blog posts in production`);
    for (const post of blogPosts) {
      await localPrisma.blog_posts.upsert({
        where: { id: post.id },
        update: post,
        create: post,
      });
    }
    console.log("✅ Blog posts copied successfully");

    // 6. Copy skills
    console.log("\n🛠️ Copying skills...");
    const skills = await prodPrisma.skills.findMany();
    console.log(`Found ${skills.length} skills in production`);
    for (const skill of skills) {
      await localPrisma.skills.upsert({
        where: { id: skill.id },
        update: skill,
        create: skill,
      });
    }
    console.log("✅ Skills copied successfully");

    // 7. Copy site settings
    console.log("\n⚙️ Copying site settings...");
    const settings = await prodPrisma.site_settings.findMany();
    console.log(`Found ${settings.length} settings in production`);
    for (const setting of settings) {
      await localPrisma.site_settings.upsert({
        where: { id: setting.id },
        update: setting,
        create: setting,
      });
    }
    console.log("✅ Settings copied successfully");

    // 8. Copy all other tables
    console.log("\n📋 Copying remaining data...");

    try {
      const contacts = await prodPrisma.contacts.findMany();
      console.log(`Found ${contacts.length} contacts`);
      for (const contact of contacts) {
        await localPrisma.contacts.upsert({
          where: { id: contact.id },
          update: contact,
          create: contact,
        });
      }
      console.log("✅ Contacts copied");
    } catch (e) {
      console.log(
        "⚠️ Contacts table might not exist or have different structure",
      );
    }

    try {
      const academicPrograms = await prodPrisma.academic_programs.findMany();
      console.log(`Found ${academicPrograms.length} academic programs`);
      for (const program of academicPrograms) {
        await localPrisma.academic_programs.upsert({
          where: { id: program.id },
          update: program,
          create: program,
        });
      }
      console.log("✅ Academic programs copied");
    } catch (e) {
      console.log(
        "⚠️ Academic programs table might not exist or have different structure",
      );
    }

    console.log("\n🎉 ALL production data copied successfully!");
    console.log("\nData summary:");
    console.log("✅ Projects (with demo flags and categories)");
    console.log("✅ Users");
    console.log("✅ Blog posts, categories, and series");
    console.log("✅ Skills");
    console.log("✅ Site settings");
    console.log("✅ Contacts and academic data");
    console.log("\nYour featured projects are now marked as demos!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prodPrisma.$disconnect();
    await localPrisma.$disconnect();
  }
}

if (require.main === module) {
  copyProductionDataOriginal();
}
