import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import DemosSection from "@/components/demos-section";

export default function DemosPage() {
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

      {/* Demos Section */}
      <DemosSection />

      {/* Additional Content for Dedicated Page */}
      <section className="py-20 bg-default-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Demo <span className="text-primary">Details</span>
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Each demo showcases a different aspect of modern web development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Stack</h3>
              <p className="text-default-600 text-sm">
                Complete web applications with both frontend and backend
                components, demonstrating end-to-end development skills
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Frontend Focus</h3>
              <p className="text-default-600 text-sm">
                User interface and experience focused applications showcasing
                modern frontend frameworks and design principles
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-default-100 rounded-lg">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Backend Systems</h3>
              <p className="text-default-600 text-sm">
                Server-side applications, APIs, and system architecture
                demonstrating robust backend development capabilities
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Generate metadata for the demos page
export const metadata = {
  title: "Live Demos - Laurent Gagné",
  description:
    "Explore interactive demonstrations of my development skills across full-stack, frontend, and backend applications.",
  openGraph: {
    title: "Live Demos - Laurent Gagné",
    description:
      "Explore interactive demonstrations of my development skills across full-stack, frontend, and backend applications.",
  },
};
