import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blog_posts.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        users: {
          select: {
            name: true,
            email: true,
          },
        },
        blog_categories: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 50, // Last 50 posts
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Blog Title</title>
    <description>Latest blog posts and updates</description>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <managingEditor>your@email.com (Your Name)</managingEditor>
    <webMaster>your@email.com (Your Name)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <pubDate>${new Date(post.publishedAt!).toUTCString()}</pubDate>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="false">${post.id}</guid>
      <author>${post.users.email} (${post.users.name})</author>
      <category>${post.blog_categories.name}</category>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return NextResponse.json(
      { error: "Failed to generate RSS feed" },
      { status: 500 },
    );
  }
}
