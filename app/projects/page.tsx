import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import EnhancedProjectsSection from "@/components/enhanced-projects-section";

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
      <EnhancedProjectsSection showAll={true} excludeDemos={true} />

      {/* Additional Content for Dedicated Page */}
      <section className="py-20 bg-default-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Project <span className="text-primary">Categories</span>
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Explore my diverse portfolio across different types of development
              work
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Commercial Projects
              </h3>
              <p className="text-default-600 text-sm">
                Professional business applications and enterprise solutions
                developed for commercial use and potential licensing
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Work</h3>
              <p className="text-default-600 text-sm">
                Custom development projects created for clients, showcasing
                collaboration and requirement fulfillment skills
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-default-600 text-sm">
                Public repositories and contributions to the open source
                community, demonstrating code quality and collaboration
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
