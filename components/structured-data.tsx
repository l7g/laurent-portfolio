import Script from "next/script";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Laurent Gagne",
    jobTitle: "Full-Stack Developer",
    description:
      "Experienced Full-Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://laurentgagne.com",
    sameAs: [
      // Add your social media profiles here
      // "https://github.com/yourusername",
      // "https://linkedin.com/in/yourusername",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Full-Stack Development",
      "Web Development",
      "Software Engineering",
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": process.env.NEXT_PUBLIC_APP_URL || "https://laurentgagne.com",
    },
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Laurent Gagne - Full-Stack Developer",
    description:
      "Portfolio showcasing full-stack development projects, blog posts, and technical expertise",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://laurentgagne.com",
    author: {
      "@type": "Person",
      name: "Laurent Gagne",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "https://laurentgagne.com"}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Script
        id="structured-data-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
    </>
  );
}
