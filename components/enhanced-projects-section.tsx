"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

import LoadingSkeleton from "./loading-skeleton";

import { GithubIcon } from "@/components/icons";
import { getProjectImageUrl } from "@/lib/blob-storage";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  image?: string;
  technologies: string[];
  category: "COMMERCIAL" | "CLIENT" | "OPENSOURCE" | "DEMO";
  status: "WIP" | "READY";
  featured: boolean;
  flagship: boolean;
  isActive: boolean;
  demo?: boolean;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  highlights: string[];
  year?: number;
  role?: string;
  outcomes?: string[];
  clientName?: string;
  projectDuration?: string;
  teamSize?: string;
  myRole?: string;
  createdAt: string;
  updatedAt: string;
}

interface EnhancedProjectsSectionProps {
  showAll?: boolean;
  excludeDemos?: boolean;
  className?: string;
  limit?: number;
}

const EnhancedProjectsSection = ({
  showAll = false,
  excludeDemos = false,
  className = "",
  limit,
}: EnhancedProjectsSectionProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory]);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects");

      if (response.ok) {
        const dbProjects = await response.json();

        let transformedProjects = dbProjects
          .filter((p: any) => p.isActive)
          .map((project: any) => ({
            id: project.id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            shortDesc: project.shortDesc,
            image: project.image,
            technologies: project.technologies || [],
            category: project.category || "OPENSOURCE",
            status: project.status || "READY",
            featured: project.featured || false,
            flagship: project.flagship || false,
            isActive: project.isActive,
            demo: project.demo || false,
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            caseStudyUrl: project.caseStudyUrl,
            highlights: project.highlights || [],
            year: project.year,
            role: project.role || project.myRole,
            outcomes: project.outcomes || [],
            clientName: project.clientName,
            projectDuration: project.projectDuration,
            teamSize: project.teamSize,
            myRole: project.myRole,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          }));

        // Exclude demos if specified
        if (excludeDemos) {
          transformedProjects = transformedProjects.filter(
            (p: Project) => !p.demo,
          );
        }

        // Sort by featured, then flagship, then by year/creation date
        transformedProjects.sort((a: Project, b: Project) => {
          if (a.flagship !== b.flagship) return b.flagship ? 1 : -1;
          if (a.featured !== b.featured) return b.featured ? 1 : -1;
          if (a.year && b.year) return b.year - a.year;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        // Limit projects if not showing all
        if (!showAll) {
          transformedProjects = transformedProjects.slice(0, 6);
        }

        setProjects(transformedProjects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  function filterProjects() {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory,
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.technologies.some((tech) => tech.toLowerCase().includes(term)),
      );
    }

    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredProjects(filtered);
  }

  const categoryConfig = {
    all: {
      label: "All Projects",
      icon: GlobeAltIcon,
      description: "Complete portfolio",
    },
    commercial: {
      label: "Commercial",
      icon: BuildingOfficeIcon,
      description: "Business applications",
    },
    client: {
      label: "Client Work",
      icon: UserGroupIcon,
      description: "Custom development",
    },
    opensource: {
      label: "Open Source",
      icon: CodeBracketIcon,
      description: "Public repositories",
    },
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "commercial":
        return "success";
      case "client":
        return "primary";
      case "opensource":
        return "secondary";
      case "demo":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusChip = (
    status: string,
    featured: boolean,
    flagship: boolean,
  ) => {
    if (flagship) {
      return (
        <Chip color="warning" size="sm" variant="solid">
          Flagship
        </Chip>
      );
    }
    if (featured) {
      return (
        <Chip color="primary" size="sm" variant="flat">
          Featured
        </Chip>
      );
    }
    if (status === "WIP") {
      return (
        <Chip color="danger" size="sm" variant="flat">
          WIP
        </Chip>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <section className={`py-20 ${className}`} id="projects">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <LoadingSkeleton className="h-12 w-64 mx-auto mb-4" />
            <LoadingSkeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${className}`} id="projects">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {showAll ? (
              <>
                Project <span className="text-primary">Portfolio</span>
              </>
            ) : (
              <>
                Other <span className="text-primary">Projects</span>
              </>
            )}
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto leading-relaxed">
            {showAll ? (
              <>
                A comprehensive showcase of my development work, from commercial
                applications to open-source contributions. Each project
                demonstrates different aspects of modern web development and
                problem-solving.
              </>
            ) : (
              <>
                Beyond the featured demos, explore my diverse project portfolio
                including commercial applications, client work, and open-source
                contributions across different technologies and industries.
              </>
            )}
          </p>
        </motion.div>

        {/* Filters and Search */}
        {showAll && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Category Tabs */}
              <Tabs
                selectedKey={selectedCategory}
                onSelectionChange={(key) => setSelectedCategory(key as string)}
                variant="bordered"
                classNames={{
                  tabList: "bg-default-50",
                  tab: "data-[selected=true]:bg-primary data-[selected=true]:text-white",
                }}
              >
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <Tab
                      key={key}
                      title={
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{config.label}</span>
                        </div>
                      }
                    />
                  );
                })}
              </Tabs>

              {/* Search */}
              <Input
                classNames={{
                  base: "max-w-sm",
                  inputWrapper: "bg-default-50",
                }}
                placeholder="Search projects..."
                size="sm"
                startContent={
                  <MagnifyingGlassIcon className="w-4 h-4 text-default-400" />
                }
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-center">
              <p className="text-sm text-default-500">
                Showing {filteredProjects.length} of {projects.length} projects
                {selectedCategory !== "all" &&
                  ` in ${categoryConfig[selectedCategory as keyof typeof categoryConfig]?.label}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${searchTerm}`}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                  {/* Project Image */}
                  <CardHeader className="p-0 relative overflow-hidden">
                    <div className="relative w-full h-48 overflow-hidden">
                      {project.image ? (
                        <Image
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          src={getProjectImageUrl(project.image, "default")}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-default-100 to-default-200 flex items-center justify-center">
                          <span className="text-default-400 text-4xl font-bold opacity-20">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Chip
                          className="text-white font-medium"
                          color={getCategoryBadgeColor(project.category)}
                          size="sm"
                          variant="solid"
                        >
                          {project.category.charAt(0) +
                            project.category.slice(1).toLowerCase()}
                        </Chip>
                      </div>

                      {/* Status/Featured Badge */}
                      <div className="absolute top-4 right-4">
                        {getStatusChip(
                          project.status,
                          project.featured,
                          project.flagship,
                        )}
                      </div>

                      {/* Year */}
                      {project.year && (
                        <div className="absolute bottom-4 right-4">
                          <Chip
                            className="bg-black/20 text-white backdrop-blur-sm"
                            size="sm"
                            variant="flat"
                          >
                            {project.year}
                          </Chip>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardBody className="p-6 flex-1">
                    {/* Title and Description */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold line-clamp-1">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-default-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {project.shortDesc || project.description}
                    </p>

                    {/* Client/Role Info */}
                    {(project.clientName || project.role) && (
                      <div className="mb-3 text-xs text-default-500">
                        {project.clientName && (
                          <p>
                            <strong>Client:</strong> {project.clientName}
                          </p>
                        )}
                        {project.role && (
                          <p>
                            <strong>Role:</strong> {project.role}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Key Features */}
                    {project.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 text-default-700">
                          Highlights:
                        </h4>
                        <ul className="space-y-1">
                          {project.highlights
                            .slice(0, 2)
                            .map((highlight, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-default-600 flex items-start"
                              >
                                <span className="text-primary mr-1">•</span>
                                {highlight}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-default-700">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-1">
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
                    </div>
                  </CardBody>

                  {/* Action Buttons */}
                  <CardFooter className="p-6 pt-0 flex gap-2">
                    {project.status === "WIP" ? (
                      <Button
                        className="flex-1"
                        color="warning"
                        size="sm"
                        variant="flat"
                        isDisabled
                      >
                        In Development
                      </Button>
                    ) : (
                      <>
                        {project.liveUrl && (
                          <Button
                            className="flex-1 font-medium"
                            color="primary"
                            size="sm"
                            startContent={
                              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            }
                            onPress={() =>
                              window.open(project.liveUrl, "_blank")
                            }
                          >
                            Live Demo
                          </Button>
                        )}

                        {project.githubUrl && (
                          <Button
                            className="flex-1 font-medium"
                            size="sm"
                            startContent={<GithubIcon className="w-4 h-4" />}
                            variant="bordered"
                            onPress={() =>
                              window.open(project.githubUrl, "_blank")
                            }
                          >
                            Code
                          </Button>
                        )}

                        {project.caseStudyUrl && (
                          <Button
                            isIconOnly
                            size="sm"
                            startContent={
                              <DocumentTextIcon className="w-4 h-4" />
                            }
                            variant="light"
                            onPress={() =>
                              window.open(project.caseStudyUrl, "_blank")
                            }
                          />
                        )}
                      </>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && !loading && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-default-500 text-lg mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "No projects match your criteria."
                : "No projects available yet."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <Button
                color="primary"
                variant="light"
                onPress={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}

        {/* View All Button - Only show on homepage */}
        {!showAll && filteredProjects.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Button
              color="primary"
              size="lg"
              variant="bordered"
              onPress={() => (window.location.href = "/projects")}
            >
              View All Projects ({projects.length})
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        {showAll && filteredProjects.length > 0 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="bg-default-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                Interested in{" "}
                <span className="text-primary">Collaborating?</span>
              </h3>
              <p className="text-default-600 mb-6 max-w-2xl mx-auto">
                Whether you need a complete application, want to contribute to
                open source, or have a custom development project in mind, I'm
                here to help turn your ideas into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  color="primary"
                  size="lg"
                  onPress={() => (window.location.href = "/contact")}
                >
                  Start a Project
                </Button>
                <Button
                  size="lg"
                  variant="bordered"
                  onPress={() => (window.location.href = "/demos")}
                >
                  View Live Demos
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EnhancedProjectsSection;
