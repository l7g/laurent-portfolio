import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import ProjectsSection from "@/components/projects-section";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-6 py-8">
        <Button
          as={Link}
          className="mb-6"
          href="/"
          startContent={<ArrowLeftIcon className="w-4 h-4" />}
          variant="ghost"
        >
          Back to Home
        </Button>
      </div>

      {/* Enhanced Projects Section */}
      <ProjectsSection showAll={true} />

      {/* Additional Content for Dedicated Page */}
      <section className="py-20 bg-default-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Project <span className="text-primary">Archive</span>
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Explore my complete portfolio - from early experiments to
              production applications. Each project represents a learning
              journey and showcases different aspects of my development skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Frontend Focus</h3>
              <p className="text-default-600 text-sm">
                Modern React, Next.js, and TypeScript applications with emphasis
                on user experience
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Full-Stack Solutions
              </h3>
              <p className="text-default-600 text-sm">
                Complete applications with databases, APIs, and authentication
                systems
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Professional Tools</h3>
              <p className="text-default-600 text-sm">
                Business applications, dashboards, and productivity tools for
                real-world use
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Generate metadata for the projects page
export const metadata = {
  title: "Projects - Laurent Gagné",
  description:
    "Explore my complete portfolio of web development projects, from React applications to full-stack solutions.",
  openGraph: {
    title: "Projects - Laurent Gagné",
    description:
      "Explore my complete portfolio of web development projects, from React applications to full-stack solutions.",
  },
};
