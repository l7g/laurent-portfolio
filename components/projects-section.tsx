"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";
import {
  ArrowTopRightOnSquareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import LoadingSkeleton from "./loading-skeleton";

import { GithubIcon } from "@/components/icons";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  featured: boolean;
  isWip: boolean;
  showWipWarning?: boolean;
  wipWarningText?: string;
  wipWarningEmoji?: string;
  links: {
    live: string;
    github: string;
  };
  highlights?: string[];
  shortDesc?: string;
  slug?: string;
}

interface ProjectsSectionProps {
  showAll?: boolean;
  className?: string;
}

const ProjectsSection = ({
  showAll = false,
  className = "",
}: ProjectsSectionProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [ctaData, setCtaData] = useState<any>(null);
  const router = useRouter();

  // Helper function to handle button actions based on database configuration
  const handleButtonAction = (buttonConfig: any) => {
    if (!buttonConfig) return;

    switch (buttonConfig.action) {
      case "scroll":
        if (buttonConfig.target === "/contact") {
          // Navigate to contact page instead of scrolling
          router.push("/contact");
        } else {
          // Handle other scroll targets
          const element = document.getElementById(
            buttonConfig.target.replace("/", ""),
          );
          element?.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "link":
        if (buttonConfig.target) {
          router.push(buttonConfig.target);
        }
        break;
      case "external":
        if (buttonConfig.target) {
          window.open(buttonConfig.target, "_blank");
        }
        break;
      default:
        // Fallback to scroll behavior for backward compatibility
        const contactSection = document.getElementById("contact");
        contactSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");

        if (response.ok) {
          const dbProjects = await response.json();

          // Transform database projects to match your existing format
          const transformedProjects = dbProjects
            .filter((p: any) => p.isActive)
            .map((project: any) => ({
              title: project.title,
              description: project.description,
              image: project.image || "/projects/placeholder.png",
              technologies: project.technologies || [],
              featured: project.featured,
              isWip: project.status === "WIP",
              showWipWarning: project.showWipWarning,
              wipWarningText: project.wipWarningText,
              wipWarningEmoji: project.wipWarningEmoji,
              links: {
                live: project.liveUrl || "#",
                github: project.githubUrl || "#",
              },
              highlights: project.highlights || [],
              // Add any other fields your component expects
              shortDesc: project.shortDesc,
              slug: project.slug,
            }));

          setProjects(transformedProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Fallback to empty array
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();

    // Fetch CTA section data
    async function fetchCtaData() {
      try {
        const response = await fetch("/api/sections");

        if (response.ok) {
          const sections = await response.json();
          const ctaSection = sections.find(
            (section: any) => section.name === "projects-cta",
          );

          if (ctaSection) {
            setCtaData(ctaSection);
          }
        }
      } catch (error) {
        console.error("Failed to fetch CTA data:", error);
      }
    }

    fetchCtaData();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="projects" />;
  }
  // Custom placeholder component for WIP projects
  const PlaceholderImage = ({
    type,
    title,
  }: {
    type: string;
    title: string;
  }) => {
    if (type === "placeholder-ecommerce") {
      return (
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80" />
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              E-Commerce Dashboard
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Coming Soon
            </p>
          </div>
          <div className="absolute top-4 right-4 flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
          </div>
        </div>
      );
    }

    if (type === "placeholder-tasks") {
      return (
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80" />
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Task Management
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              In Development
            </p>
          </div>
          <div className="absolute top-4 right-4 flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <div className="w-2 h-2 bg-pink-400 rounded-full" />
            <div className="w-2 h-2 bg-indigo-400 rounded-full" />
          </div>
        </div>
      );
    }

    return null;
  };

  // Projects are now loaded from database via useEffect

  return (
    <section className="py-20" id="projects">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {" "}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>{" "}
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            Comprehensive full-stack applications built with professional
            quality and scalability in mind. My flagship project showcases my
            capabilities, while other projects are available for custom
            development and freelancing opportunities.
          </p>
        </motion.div>

        {/* Featured Project */}
        {projects.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden shadow-xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 sm:h-72 md:h-80 lg:h-auto lg:min-h-[400px] overflow-hidden bg-gray-100">
                  {projects[0].image &&
                  projects[0].image.startsWith("placeholder-") ? (
                    <PlaceholderImage
                      title={projects[0].title}
                      type={projects[0].image}
                    />
                  ) : (
                    <img
                      alt={projects[0].title}
                      className="w-full h-full object-cover object-center"
                      src={projects[0].image}
                      style={{
                        minHeight: "100%",
                        minWidth: "100%",
                      }}
                    />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <Chip color="primary" size="sm" variant="solid">
                      Flagship Project
                    </Chip>
                  </div>
                </div>{" "}
                <CardBody className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold">{projects[0].title}</h3>
                    {projects[0].isWip && (
                      <Chip
                        className="text-xs font-semibold animate-pulse"
                        color="warning"
                        size="sm"
                        startContent={
                          <div className="w-2 h-2 bg-white rounded-full" />
                        }
                        variant="solid"
                      >
                        Work in Progress
                      </Chip>
                    )}
                  </div>
                  {projects[0].isWip &&
                    projects[0].showWipWarning !== false && (
                      <div className="mb-4 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                        {" "}
                        <p className="text-sm text-warning-700 dark:text-warning-300">
                          {(() => {
                            const customText = projects[0].wipWarningText;
                            const selectedEmoji =
                              projects[0].wipWarningEmoji || "🚧";
                            const defaultText =
                              "Personal project currently in development. Code is private. Contact me to discuss my development approach and capabilities.";

                            const messageText = customText || defaultText;

                            return `${selectedEmoji} ${messageText}`;
                          })()}
                        </p>
                      </div>
                    )}
                  <p className="text-default-600 mb-6 leading-relaxed">
                    {projects[0].description}
                  </p>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {projects[0].highlights?.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-default-600"
                        >
                          <ArrowRightIcon className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {projects[0].technologies.map((tech) => (
                      <Chip key={tech} color="primary" size="sm" variant="flat">
                        {tech}
                      </Chip>
                    ))}
                  </div>{" "}
                  <div className="flex gap-4">
                    {projects[0].isWip ? (
                      <>
                        {/* Show live demo button if available for WIP projects */}
                        {projects[0].links.live &&
                          projects[0].links.live !== "#" && (
                            <Button
                              className="font-semibold shadow-lg"
                              color="warning"
                              startContent={
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              }
                              variant="solid"
                              onPress={() =>
                                window.open(projects[0].links.live, "_blank")
                              }
                            >
                              View Live Demo
                            </Button>
                          )}
                        <Button
                          className="font-semibold shadow-lg"
                          color="warning"
                          startContent={
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          }
                          variant="solid"
                          onPress={() => router.push("/contact")}
                        >
                          Explore My Work
                        </Button>
                        {/* Only show code button if GitHub link is valid */}
                        {projects[0].links.github &&
                          projects[0].links.github !== "#" && (
                            <Button
                              className="font-semibold"
                              startContent={<GithubIcon className="w-4 h-4" />}
                              variant="bordered"
                              onPress={() =>
                                window.open(projects[0].links.github, "_blank")
                              }
                            >
                              View Code
                            </Button>
                          )}
                      </>
                    ) : (
                      <>
                        {/* Only show live demo button if live link is valid */}
                        {projects[0].links.live &&
                          projects[0].links.live !== "#" && (
                            <Button
                              color="primary"
                              startContent={
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              }
                              variant="solid"
                              onPress={() =>
                                window.open(projects[0].links.live, "_blank")
                              }
                            >
                              View Live Demo
                            </Button>
                          )}
                        {/* Only show code button if GitHub link is valid */}
                        {projects[0].links.github &&
                          projects[0].links.github !== "#" && (
                            <Button
                              startContent={<GithubIcon className="w-4 h-4" />}
                              variant="bordered"
                              onPress={() =>
                                window.open(projects[0].links.github, "_blank")
                              }
                            >
                              Source Code
                            </Button>
                          )}
                        {/* Show message when no links are available */}
                        {(!projects[0].links.live ||
                          projects[0].links.live === "#") &&
                          (!projects[0].links.github ||
                            projects[0].links.github === "#") && (
                            <div className="text-center py-2">
                              <p className="text-default-500">
                                🔗 Links coming soon
                              </p>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </CardBody>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Other Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {projects
            .slice(1, showAll ? projects.length : 4)
            .map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardHeader className="p-0 overflow-hidden">
                    <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-100">
                      {project.image &&
                      project.image.startsWith("placeholder-") ? (
                        <PlaceholderImage
                          title={project.title}
                          type={project.image}
                        />
                      ) : (
                        <img
                          alt={project.title}
                          className="w-full h-full object-cover object-center"
                          src={project.image}
                          style={{
                            minHeight: "100%",
                            minWidth: "100%",
                          }}
                        />
                      )}
                    </div>
                  </CardHeader>{" "}
                  <CardBody className="p-6">
                    {" "}
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {project.isWip && (
                        <Chip
                          className="text-xs font-semibold animate-pulse"
                          color="warning"
                          size="sm"
                          startContent={
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          }
                          variant="solid"
                        >
                          WIP
                        </Chip>
                      )}
                    </div>
                    {project.isWip && (
                      <div className="mb-3 p-2 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-md">
                        <p className="text-xs text-warning-700 dark:text-warning-300">
                          {project.wipWarningEmoji || "🚧"}{" "}
                          {project.wipWarningText ||
                            "Available for freelancing - Contact for custom development"}
                        </p>
                      </div>
                    )}
                    <p className="text-default-600 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Chip key={tech} size="sm" variant="flat">
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                  <CardFooter className="p-6 pt-0 flex gap-3">
                    {project.isWip ? (
                      <>
                        {/* Show live demo button if available for WIP projects */}
                        {project.links.live && project.links.live !== "#" && (
                          <Button
                            color="warning"
                            size="sm"
                            startContent={
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            }
                            variant="flat"
                            onPress={() =>
                              window.open(project.links.live, "_blank")
                            }
                          >
                            Live Demo
                          </Button>
                        )}
                        <Button
                          className={`font-semibold ${project.links.live && project.links.live !== "#" ? "" : "flex-1"}`}
                          color="warning"
                          size="sm"
                          startContent={
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          }
                          variant="solid"
                          onPress={() => router.push("/contact")}
                        >
                          Explore My Work
                        </Button>
                        {/* Only show code button if GitHub link is valid */}
                        {project.links.github &&
                          project.links.github !== "#" && (
                            <Button
                              size="sm"
                              startContent={<GithubIcon className="w-4 h-4" />}
                              variant="light"
                              onPress={() =>
                                window.open(project.links.github, "_blank")
                              }
                            >
                              Code
                            </Button>
                          )}
                      </>
                    ) : (
                      <>
                        {/* Only show live demo button if live link is valid */}
                        {project.links.live && project.links.live !== "#" && (
                          <Button
                            color="primary"
                            size="sm"
                            startContent={
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            }
                            variant="flat"
                            onPress={() =>
                              window.open(project.links.live, "_blank")
                            }
                          >
                            Live Demo
                          </Button>
                        )}
                        {/* Only show code button if GitHub link is valid */}
                        {project.links.github &&
                          project.links.github !== "#" && (
                            <Button
                              size="sm"
                              startContent={<GithubIcon className="w-4 h-4" />}
                              variant="light"
                              onPress={() =>
                                window.open(project.links.github, "_blank")
                              }
                            >
                              Code
                            </Button>
                          )}
                        {/* Show message when no links are available */}
                        {(!project.links.live || project.links.live === "#") &&
                          (!project.links.github ||
                            project.links.github === "#") && (
                            <div className="flex-1 text-center py-2">
                              <p className="text-small text-default-500">
                                🔗 Links coming soon
                              </p>
                            </div>
                          )}
                      </>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* View All Projects Button - Only show on homepage */}
        {!showAll && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Button
              as={Link}
              color="primary"
              endContent={<ArrowRightIcon className="w-5 h-5" />}
              href="/projects"
              size="lg"
              variant="bordered"
            >
              View All Projects
            </Button>
          </motion.div>
        )}

        {/* Enhanced Call to Action */}
        <motion.div
          className="mt-20 py-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="text-center max-w-4xl mx-auto px-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {ctaData?.title || "Ready to Build Something"}{" "}
              <span className="text-primary">
                {ctaData?.subtitle || "Amazing?"}
              </span>
            </h3>
            <p className="text-lg text-default-600 mb-8 leading-relaxed">
              {ctaData?.description ||
                "I specialize in creating custom web applications that solve real business problems. From concept to deployment, I deliver professional solutions that make a difference."}
            </p>

            {/* Stats/Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {ctaData?.content?.stats?.[0]?.value || "3+"}
                </div>
                <div className="text-sm text-default-600">
                  {ctaData?.content?.stats?.[0]?.label || "Years Learning"}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {ctaData?.content?.stats?.[1]?.value || "Multiple"}
                </div>
                <div className="text-sm text-default-600">
                  {ctaData?.content?.stats?.[1]?.label || "Learning Projects"}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {ctaData?.content?.stats?.[2]?.value || "Proven"}
                </div>
                <div className="text-sm text-default-600">
                  {ctaData?.content?.stats?.[2]?.label || "Team Ready"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                className="min-w-[200px] font-semibold"
                color="primary"
                endContent={<ArrowRightIcon className="w-5 h-5" />}
                size="lg"
                variant="solid"
                onPress={() =>
                  handleButtonAction(ctaData?.content?.primaryButton)
                }
              >
                {ctaData?.content?.primaryButton?.text || "Start Your Project"}
              </Button>
              <Button
                className="min-w-[200px] font-semibold"
                color="default"
                size="lg"
                variant="bordered"
                onPress={() => {
                  const emailSubject = encodeURIComponent(
                    ctaData?.content?.emailSubject || "Project Inquiry",
                  );
                  const emailBody = encodeURIComponent(
                    ctaData?.content?.emailBody ||
                      "Hi Laurent, I'd like to discuss a project with you.",
                  );

                  window.open(
                    `mailto:contact@laurentgagne.com?subject=${emailSubject}&body=${emailBody}`,
                    "_blank",
                  );
                }}
              >
                {ctaData?.content?.secondaryButton?.text || "Send Quick Email"}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-default-200">
              <p className="text-sm text-default-500">
                {ctaData?.content?.footerText ||
                  "🚀 Available for freelance projects • 💬 Free consultation • ⚡ Fast turnaround"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
