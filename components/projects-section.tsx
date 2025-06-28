"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import {
  ArrowTopRightOnSquareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

const ProjectsSection = () => {
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
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
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
        <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center relative overflow-hidden">
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

  const projects = [
    {
      title: "Tracker - Political Data Platform",
      description:
        "A comprehensive data platform built with Next.js, designed to handle complex political information with enterprise-level architecture. Features advanced user authentication, role-based access control, and scalable database design patterns.",
      image: "/projects/tracker-preview.png", // You'll need to add this image
      technologies: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "TailwindCSS",
        "NextAuth.js",
      ],
      featured: true,
      isWip: true, // Set to false when project is complete
      links: {
        live: siteConfig.links.tracker,
        github: "#", // Add your tracker GitHub link
      },
      highlights: [
        "Enterprise-grade data architecture and modeling",
        "Advanced authentication & authorization systems",
        "Responsive, modern UI with optimal user experience",
        "Complex database relationships and optimization",
        "Scalable role-based access control implementation",
      ],
    },
    {
      title: "E-Commerce Dashboard",
      description:
        "Modern e-commerce administration platform with comprehensive inventory management, analytics, and user interface design. Built with scalability and real-world business needs in mind.",
      image: "placeholder-ecommerce",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Chart.js"],
      featured: false,
      isWip: true,
      links: {
        live: "#",
        github: "#",
      },
    },
    {
      title: "Task Management App",
      description:
        "Professional task management solution featuring real-time collaboration, advanced project tracking, and intuitive user experience design for team productivity.",
      image: "placeholder-tasks",
      technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL"],
      featured: false,
      isWip: true,
      links: {
        live: "#",
        github: "#",
      },
    },
  ];

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

        {/* Featured Project - Tracker */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden shadow-xl">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-48 sm:h-56 md:h-64 lg:h-auto overflow-hidden">
                <Image
                  alt={projects[0].title}
                  className="w-full h-full object-cover object-center"
                  src={projects[0].image}
                />{" "}
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
                {projects[0].isWip && (
                  <div className="mb-4 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                    {" "}
                    <p className="text-sm text-warning-700 dark:text-warning-300">
                      🚧 Personal project currently in development. Code is
                      private. Contact me to discuss my development approach and
                      capabilities.
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
                      {" "}
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        }
                        variant="solid"
                        onPress={() => {
                          const contactSection =
                            document.getElementById("contact");

                          contactSection?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                      >
                        {" "}
                        Discuss My Work
                      </Button>
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
                    </>
                  ) : (
                    <>
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
                      <Button
                        startContent={<GithubIcon className="w-4 h-4" />}
                        variant="bordered"
                        onPress={() =>
                          window.open(projects[0].links.github, "_blank")
                        }
                      >
                        Source Code
                      </Button>
                    </>
                  )}
                </div>
              </CardBody>
            </div>
          </Card>
        </motion.div>

        {/* Other Projects Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(1).map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {" "}
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="p-0 overflow-hidden">
                  {project.image.startsWith("placeholder-") ? (
                    <PlaceholderImage
                      title={project.title}
                      type={project.image}
                    />
                  ) : (
                    <Image
                      alt={project.title}
                      className="w-full h-40 sm:h-48 object-cover object-center"
                      src={project.image}
                    />
                  )}
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
                      {" "}
                      <p className="text-xs text-warning-700 dark:text-warning-300">
                        {" "}
                        🚧 Available for freelancing - Contact for custom
                        development
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
                      <Button
                        className="flex-1 font-semibold"
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
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        }
                        variant="solid"
                        onPress={() => {
                          const contactSection =
                            document.getElementById("contact");

                          contactSection?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                      >
                        {" "}
                        Freelance Inquiry
                      </Button>
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {" "}
          <p className="text-default-600 mb-6">
            Interested in hiring me or need custom development work similar to
            these projects?
          </p>
          <Button
            color="primary"
            endContent={<ArrowRightIcon className="w-5 h-5" />}
            size="lg"
            variant="bordered"
            onPress={() => {
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Get In Touch
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
