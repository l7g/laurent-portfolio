import { notFound } from "next/navigation";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Card, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

import { GithubIcon } from "@/components/icons";
import { prisma } from "@/lib/prisma";

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

// Generate static paths for all active projects
export async function generateStaticParams() {
  try {
    const projects = await prisma.projects.findMany({
      where: { isActive: true },
      select: { slug: true },
    });

    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for projects:", error);

    return [];
  }
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string) {
  try {
    const project = await prisma.projects.findUnique({
      where: { slug },
    });

    if (!project || !project.isActive) {
      return null;
    }

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);

    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            as={Link}
            href="/projects"
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
            variant="ghost"
          >
            Back to Projects
          </Button>
          <Button as={Link} href="/" variant="ghost">
            Home
          </Button>
        </div>
      </div>

      {/* Project Hero */}
      <section className="py-12 bg-default-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                {project.title}
              </h1>
              {project.status === "WIP" && (
                <Chip
                  className="text-sm font-semibold animate-pulse"
                  color="warning"
                  size="lg"
                  startContent={
                    <div className="w-2 h-2 bg-white rounded-full" />
                  }
                  variant="solid"
                >
                  WIP
                </Chip>
              )}
            </div>

            {project.status === "WIP" && project.showWipWarning && (
              <div className="mb-8 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                <p className="text-warning-700 dark:text-warning-300">
                  {project.wipWarningEmoji || "🚧"}{" "}
                  {project.wipWarningText ||
                    "This project is currently under development."}
                </p>
              </div>
            )}

            <p className="text-xl text-default-600 mb-8 leading-relaxed">
              {project.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              {project.liveUrl && project.liveUrl !== "#" && (
                <Button
                  isExternal
                  as={Link}
                  color="primary"
                  href={project.liveUrl}
                  size="lg"
                  startContent={
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  }
                >
                  View Live Demo
                </Button>
              )}
              {project.githubUrl && project.githubUrl !== "#" && (
                <Button
                  isExternal
                  as={Link}
                  href={project.githubUrl}
                  size="lg"
                  startContent={<GithubIcon className="w-5 h-5" />}
                  variant="bordered"
                >
                  View Code
                </Button>
              )}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Chip key={tech} color="primary" size="sm" variant="flat">
                  {tech}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Image */}
      {project.image && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <CardHeader className="p-0">
                  <img
                    alt={project.title}
                    className="w-full h-96 object-cover"
                    src={project.image}
                  />
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Project Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                  <div className="space-y-4">
                    {project.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <p className="text-default-600 leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Info */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <Chip
                      color={project.status === "READY" ? "success" : "warning"}
                      variant="flat"
                    >
                      {project.status === "READY"
                        ? "Completed"
                        : "Work in Progress"}
                    </Chip>
                  </div>

                  {project.featured && (
                    <div>
                      <h3 className="font-semibold mb-2">Featured Project</h3>
                      <p className="text-default-600">
                        This is one of my featured projects, showcasing my best
                        work.
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          color="default"
                          size="sm"
                          variant="flat"
                        >
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-default-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Interested in Similar Work?
            </h2>
            <p className="text-default-600 mb-8">
              Need custom development work or have a project in mind? Let's
              discuss how I can help bring your ideas to life.
            </p>
            <Button as={Link} color="primary" href="/contact" size="lg">
              Get In Touch
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Generate metadata for each project
export async function generateMetadata({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} - Laurent Gagné`,
    description: project.description,
    openGraph: {
      title: `${project.title} - Laurent Gagné`,
      description: project.description,
      images: project.image ? [project.image] : [],
    },
  };
}
