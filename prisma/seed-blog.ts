import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding blog data...");

  // Create blog categories
  const techCategory = await prisma.blog_categories.upsert({
    where: { slug: "tech-dev" },
    update: {},
    create: {
      id: randomUUID(),
      name: "Tech & Development",
      slug: "tech-dev",
      description:
        "My journey in software development, programming insights, and technical discoveries.",
      color: "#3B82F6", // Blue
      icon: "💻",
      metaTitle: "Tech & Development Blog - Laurent's Journey",
      metaDescription:
        "Follow my journey in software development, programming insights, and technical discoveries.",
      isActive: true,
      sortOrder: 1,
      updatedAt: new Date(),
    },
  });

  const irCategory = await prisma.blog_categories.upsert({
    where: { slug: "international-relations" },
    update: {},
    create: {
      id: randomUUID(),
      name: "International Relations",
      slug: "international-relations",
      description:
        "Insights from my Bachelor's studies in International Relations and global perspectives.",
      color: "#10B981", // Green
      icon: "🌍",
      metaTitle: "International Relations Blog - Laurent's Academic Journey",
      metaDescription:
        "Insights from my Bachelor's studies in International Relations and global perspectives.",
      isActive: true,
      sortOrder: 2,
      updatedAt: new Date(),
    },
  });

  // Get or create admin user
  const adminUser = await prisma.users.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminUser) {
    console.log("❌ No admin user found. Please create an admin user first.");
    return;
  }

  // Create sample blog posts
  const samplePosts = [
    {
      title: "Building a Modern Portfolio with Next.js 15",
      slug: "building-modern-portfolio-nextjs-15",
      excerpt:
        "A deep dive into creating a dynamic, database-driven portfolio using Next.js 15, Prisma, and modern web technologies.",
      content: `
# Building a Modern Portfolio with Next.js 15

Creating a modern portfolio isn't just about showcasing your work—it's about demonstrating your technical skills through the very platform you build.

## The Tech Stack

For this portfolio, I chose:

- **Next.js 15**: The latest version with App Router
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Robust relational database
- **TypeScript**: For type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

## Key Features Implemented

### 1. Dynamic Settings System
Instead of hardcoding portfolio content, I built a dynamic settings system that allows real-time updates through an admin panel.

### 2. Project Management
A comprehensive project management system with:
- WIP (Work in Progress) indicators
- Dynamic project cards
- Category filtering
- Live preview links

### 3. Admin Dashboard
A secure admin interface for managing:
- Site settings
- Project details
- Content updates
- User management

## Lessons Learned

Building this portfolio taught me the importance of:
- **Separation of concerns**: Keeping content separate from code
- **Type safety**: Using TypeScript throughout the stack
- **Performance**: Optimizing for fast load times
- **User experience**: Creating intuitive interfaces

## What's Next?

The portfolio is now live and I'm continuously adding features like:
- Blog system (this post!)
- Advanced analytics
- Better SEO optimization
- Enhanced admin capabilities

---

*This is my first blog post on the new platform. More technical insights coming soon!*
      `,
      categoryId: techCategory.id,
      tags: ["nextjs", "typescript", "portfolio", "web-development"],
      status: "PUBLISHED",
      authorId: adminUser.id,
      publishedAt: new Date(),
      metaTitle:
        "Building a Modern Portfolio with Next.js 15 - Laurent's Tech Blog",
      metaDescription:
        "Learn how I built a dynamic, database-driven portfolio using Next.js 15, Prisma, and modern web technologies.",
    },
    {
      title: "Understanding Geopolitical Dynamics in the Digital Age",
      slug: "geopolitical-dynamics-digital-age",
      excerpt:
        "Exploring how digital technologies reshape international relations and global power structures in the 21st century.",
      content: `
# Understanding Geopolitical Dynamics in the Digital Age

As I begin my Bachelor's degree in International Relations, I'm fascinated by how digital technologies are fundamentally reshaping global politics and power dynamics.

## The Digital Revolution in International Relations

The emergence of cyberspace as a new domain of international relations has created unprecedented challenges and opportunities for nation-states.

### Key Areas of Impact:

1. **Digital Diplomacy**: How countries engage through social media and digital platforms
2. **Cyber Warfare**: The new frontier of conflict and security
3. **Economic Interdependence**: Global supply chains and digital economies
4. **Information Warfare**: The battle for narrative control

## Case Study: The Role of Social Media in Modern Diplomacy

Recent events have shown how platforms like Twitter, Facebook, and TikTok have become battlegrounds for international influence.

### Examples:
- **Ukraine-Russia Conflict**: Real-time information warfare
- **US-China Relations**: Trade wars fought in digital spaces
- **European Union**: Digital sovereignty initiatives

## The Intersection of Technology and Politics

As someone with a background in software development, I bring a unique perspective to understanding:

- How algorithms shape public opinion
- The technical realities behind "cyber attacks"
- The feasibility of digital policy proposals
- The intersection of privacy, security, and governance

## Academic Goals

Through my IR studies, I aim to:
1. Analyze the impact of emerging technologies on global governance
2. Understand the regulatory challenges of digital platforms
3. Explore the role of tech companies in international relations
4. Develop frameworks for digital diplomacy

## Looking Forward

The convergence of technology and international relations is only beginning. As artificial intelligence, quantum computing, and other emerging technologies mature, their impact on global politics will only intensify.

---

*This is my first post exploring the intersection of technology and international relations. I look forward to sharing more insights as I progress through my studies.*
      `,
      categoryId: irCategory.id,
      tags: [
        "international-relations",
        "digital-diplomacy",
        "geopolitics",
        "technology",
      ],
      status: "PUBLISHED",
      authorId: adminUser.id,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      metaTitle: "Geopolitical Dynamics in the Digital Age - Laurent's IR Blog",
      metaDescription:
        "Exploring how digital technologies reshape international relations and global power structures in the 21st century.",
    },
    {
      title: "The Future of Full-Stack Development",
      slug: "future-full-stack-development",
      excerpt:
        "Predictions and trends shaping the future of full-stack development, from AI-assisted coding to serverless architectures.",
      content: `
# The Future of Full-Stack Development

As a full-stack developer, I'm constantly watching the horizon for emerging trends and technologies that will shape our field.

## Current Trends

### 1. AI-Assisted Development
- **GitHub Copilot**: Transforming how we write code
- **AI Code Review**: Automated security and quality checks
- **Intelligent Testing**: AI-generated test cases

### 2. Serverless Architecture
- **Edge Computing**: Bringing computation closer to users
- **Function-as-a-Service**: Event-driven architectures
- **Managed Databases**: Less infrastructure management

### 3. Modern Frontend Frameworks
- **React Server Components**: Blurring server-client boundaries
- **Next.js Evolution**: Full-stack React framework
- **Svelte/SvelteKit**: Compile-time optimization

## Predictions for 2025 and Beyond

### WebAssembly Adoption
WebAssembly will enable:
- High-performance web applications
- Language-agnostic development
- Better resource utilization

### AI Integration
Every application will have:
- Smart search capabilities
- Predictive user interfaces
- Automated content generation

### Developer Experience
Focus on:
- Zero-config setups
- Instant feedback loops
- Collaborative development tools

## Skills for the Future

To stay relevant, developers should focus on:

1. **Core Fundamentals**: Algorithms, data structures, system design
2. **AI Literacy**: Understanding how to work with AI tools
3. **Cloud-Native Development**: Serverless, containers, microservices
4. **Security**: Privacy-first design and implementation
5. **Performance**: Optimization and monitoring

## My Learning Journey

I'm currently exploring:
- Advanced React patterns
- Database optimization techniques
- AI/ML integration in web apps
- International relations (my academic pursuit)

The intersection of technology and other fields (like IR) creates unique opportunities for innovation.

---

*What trends are you most excited about? Let me know in the comments below!*
      `,
      categoryId: techCategory.id,
      tags: [
        "full-stack",
        "future-trends",
        "web-development",
        "ai",
        "serverless",
      ],
      status: "DRAFT",
      authorId: adminUser.id,
      metaTitle:
        "The Future of Full-Stack Development - Laurent's Tech Insights",
      metaDescription:
        "Predictions and trends shaping the future of full-stack development, from AI-assisted coding to serverless architectures.",
    },
  ];

  // Create blog posts
  for (const post of samplePosts) {
    await prisma.blog_posts.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        id: randomUUID(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        categoryId: post.categoryId,
        tags: post.tags,
        status: post.status as any,
        authorId: post.authorId,
        publishedAt: post.publishedAt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        updatedAt: new Date(),
      },
    });
  }

  console.log("✅ Blog seeding completed successfully!");
  console.log(`📝 Created ${samplePosts.length} blog posts`);
  console.log(`🏷️ Created 2 blog categories`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding blog data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
