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
import { getProjectImageUrl } from "@/lib/blob-storage";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  image?: string | null;
  technologies: string[];
  featured: boolean;
  flagship: boolean;
  isActive: boolean;
  status: "WIP" | "READY";
  liveUrl?: string | null;
  githubUrl?: string | null;
  highlights: string[];
  detailedDescription?: string | null;
  challenges?: string | null;
  solutions?: string | null;
  results?: string | null;
  clientName?: string | null;
  projectDuration?: string | null;
  teamSize?: string | null;
  myRole?: string | null;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const flagshipProject = projects.find((p) => p.flagship);
  const featuredProjects = projects.filter((p) => p.featured && !p.flagship);
  const otherProjects = projects.filter((p) => !p.featured && !p.flagship);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="projects">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            Comprehensive full-stack applications built with professional
            quality and scalability in mind. My flagship project showcases my
            capabilities, while other projects are available for custom
            development and freelancing opportunities.
          </p>
        </motion.div>

        {/* Flagship Project */}
        {flagshipProject && (
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
                    alt={flagshipProject.title}
                    className="w-full h-full object-cover"
                    src={getProjectImageUrl(flagshipProject.image, "default")}
                  />
                  {flagshipProject.status === "WIP" && (
                    <div className="absolute top-4 left-4">
                      <Chip
                        className="text-white font-medium"
                        color="warning"
                        size="sm"
                        variant="solid"
                      >
                        Work in Progress
                      </Chip>
                    </div>
                  )}
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Chip color="primary" size="sm" variant="flat">
                      Flagship Project
                    </Chip>
                    {flagshipProject.status === "WIP" && (
                      <Chip color="warning" size="sm" variant="flat">
                        WIP
                      </Chip>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    {flagshipProject.title}
                  </h3>
                  <p className="text-default-600 mb-6 leading-relaxed">
                    {flagshipProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {flagshipProject.technologies.map((tech) => (
                      <Chip key={tech} size="sm" variant="flat">
                        {tech}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {flagshipProject.status === "WIP" ? (
                      <Button
                        color="warning"
                        startContent={<ArrowRightIcon className="w-4 h-4" />}
                        variant="flat"
                      >
                        Coming Soon
                      </Button>
                    ) : (
                      <>
                        {flagshipProject.githubUrl && (
                          <Button
                            startContent={<GithubIcon className="w-4 h-4" />}
                            variant="flat"
                            onPress={() =>
                              window.open(flagshipProject.githubUrl!, "_blank")
                            }
                          >
                            Code
                          </Button>
                        )}
                        {flagshipProject.liveUrl && (
                          <Button
                            color="primary"
                            startContent={
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            }
                            onPress={() =>
                              window.open(flagshipProject.liveUrl!, "_blank")
                            }
                          >
                            Live Demo
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Featured Projects Grid */}
        {featuredProjects.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {featuredProjects.map((project, index) => (
              <Card key={project.id} className="overflow-hidden shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      alt={project.title}
                      className="w-full h-full object-cover"
                      src={getProjectImageUrl(project.image, "default")}
                    />
                    {project.status === "WIP" && (
                      <div className="absolute top-4 left-4">
                        <Chip
                          className="text-white font-medium"
                          color="warning"
                          size="sm"
                          variant="solid"
                        >
                          Work in Progress
                        </Chip>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Chip color="secondary" size="sm" variant="flat">
                      Featured
                    </Chip>
                    {project.status === "WIP" && (
                      <Chip color="warning" size="sm" variant="flat">
                        WIP
                      </Chip>
                    )}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{project.title}</h4>
                  <p className="text-default-600 mb-4 line-clamp-3">
                    {project.shortDesc || project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <Chip key={tech} size="sm" variant="flat">
                        {tech}
                      </Chip>
                    ))}
                    {project.technologies.length > 4 && (
                      <Chip size="sm" variant="flat">
                        +{project.technologies.length - 4}
                      </Chip>
                    )}
                  </div>
                </CardBody>
                <CardFooter className="p-6 pt-0">
                  <div className="flex gap-3 w-full">
                    {project.status === "WIP" ? (
                      <Button
                        className="flex-1"
                        color="warning"
                        startContent={<ArrowRightIcon className="w-4 h-4" />}
                        variant="flat"
                      >
                        In Development
                      </Button>
                    ) : (
                      <>
                        {project.githubUrl && (
                          <Button
                            className="flex-1"
                            startContent={<GithubIcon className="w-4 h-4" />}
                            variant="flat"
                            onPress={() =>
                              window.open(project.githubUrl!, "_blank")
                            }
                          >
                            Code
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button
                            className="flex-1"
                            color="primary"
                            startContent={
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            }
                            onPress={() =>
                              window.open(project.liveUrl!, "_blank")
                            }
                          >
                            Demo
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              Other Projects
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image
                        alt={project.title}
                        className="w-full h-full object-cover"
                        src={getProjectImageUrl(project.image, "default")}
                      />
                      {project.status === "WIP" && (
                        <div className="absolute top-3 left-3">
                          <Chip
                            className="text-white font-medium"
                            color="warning"
                            size="sm"
                            variant="solid"
                          >
                            WIP
                          </Chip>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardBody className="p-4">
                    <h5 className="font-bold mb-2">{project.title}</h5>
                    <p className="text-sm text-default-600 mb-3 line-clamp-2">
                      {project.shortDesc || project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Chip key={tech} size="sm" variant="flat">
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex gap-2 w-full">
                      {project.status === "WIP" ? (
                        <Button
                          className="flex-1"
                          color="warning"
                          size="sm"
                          startContent={<ArrowRightIcon className="w-3 h-3" />}
                          variant="flat"
                        >
                          Soon
                        </Button>
                      ) : (
                        <>
                          {project.githubUrl && (
                            <Button
                              className="flex-1"
                              size="sm"
                              startContent={<GithubIcon className="w-3 h-3" />}
                              variant="flat"
                              onPress={() =>
                                window.open(project.githubUrl!, "_blank")
                              }
                            >
                              Code
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button
                              className="flex-1"
                              color="primary"
                              size="sm"
                              startContent={
                                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                              }
                              onPress={() =>
                                window.open(project.liveUrl!, "_blank")
                              }
                            >
                              Demo
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="text-lg text-default-600 mb-6">
            Interested in collaborating on a project?
          </p>
          <Button
            color="primary"
            size="lg"
            onPress={() =>
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Get In Touch
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
