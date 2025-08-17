/**
 * Demos Section Component
 *
 * Displays live demo projects showcasing different development skills.
 * Shows exactly 3 projects - one for each category: FULLSTACK, FRONTEND, BACKEND.
 *
 * Features:
 * - Fetches demo projects from API (projects marked with demo: true)
 * - Uses databas                        onPress={() => openUrl(demo.githubUrl)}                  onPress={() => openUrl(demo.liveUrl)}Type field for categorization
 * - Responsive grid layout with hover effects
 * - Live links, GitHub links, and case study links
 * - Loading states and error handling
 *
 * @component
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { motion } from "framer-motion";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import LoadingSkeleton from "./loading-skeleton";

import { GithubIcon } from "@/components/icons";
import { getProjectImageUrl } from "@/lib/blob-storage";
import { openUrl } from "@/lib/utils";

interface Demo {
  id: string;
  title: string;
  description: string;
  shortDesc?: string;
  image?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  type: "FULLSTACK" | "FRONTEND" | "BACKEND";
  features: string[];
  year?: number;
  role?: string;
  outcomes?: string[];
}

interface DemosSectionProps {
  className?: string;
}

const DemosSection = ({ className = "" }: DemosSectionProps) => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemos();
  }, []);

  async function fetchDemos() {
    try {
      const response = await fetch("/api/projects?demo=true");

      if (response.ok) {
        const dbDemos = await response.json();
        console.log("Raw demos from API:", dbDemos);

        // Transform database demos to match our interface
        const transformedDemos = dbDemos
          .filter((d: any) => d.isActive && d.demo)
          .map((demo: any) => ({
            id: demo.id,
            title: demo.title,
            description: demo.description,
            shortDesc: demo.shortDesc,
            image: demo.image,
            techStack: demo.technologies || [],
            liveUrl: demo.liveUrl,
            githubUrl: demo.githubUrl,
            caseStudyUrl: demo.caseStudyUrl,
            type: demo.demoType || "FULLSTACK", // Use database demoType
            features: demo.highlights || [],
            year: demo.year,
            role: demo.role || demo.myRole,
            outcomes: demo.outcomes || [],
          }))
          .slice(0, 3); // Limit to 3 demos

        console.log("Filtered demos:", transformedDemos);
        setDemos(transformedDemos);
      }
    } catch (error) {
      console.error("Failed to fetch demos:", error);
      setDemos([]);
    } finally {
      setLoading(false);
    }
  }

  const typeConfig = {
    FULLSTACK: {
      color: "primary" as const,
      label: "Full Stack",
      description: "Complete web application with frontend and backend",
      gradient: "from-blue-500 to-purple-600",
    },
    FRONTEND: {
      color: "secondary" as const,
      label: "Frontend",
      description: "User interface and experience focused",
      gradient: "from-emerald-500 to-teal-600",
    },
    BACKEND: {
      color: "warning" as const,
      label: "Backend",
      description: "Server-side logic and API development",
      gradient: "from-orange-500 to-red-600",
    },
  };

  if (loading) {
    return (
      <section className={`py-20 ${className}`} id="demos">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <LoadingSkeleton className="h-12 w-64 mx-auto mb-4" />
            <LoadingSkeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${className}`} id="demos">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Live <span className="text-primary">Demos</span>
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto leading-relaxed">
            Explore three comprehensive demonstrations showcasing different
            aspects of my development skills. Each demo represents a complete,
            production-ready application with full source code available.
          </p>
        </motion.div>

        {/* Demos Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {demos.map((demo, index) => {
            const config = typeConfig[demo.type];

            return (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                  {/* Demo Image with Type Badge */}
                  <CardHeader className="p-0 relative overflow-hidden">
                    <div className="relative w-full h-48 overflow-hidden">
                      {demo.image ? (
                        <Image
                          alt={demo.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          src={getProjectImageUrl(demo.image, "default")}
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
                        >
                          <span className="text-white text-4xl font-bold opacity-20">
                            {demo.title.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <Chip
                          className="text-white font-medium"
                          color={config.color}
                          size="sm"
                          variant="solid"
                        >
                          {config.label}
                        </Chip>
                      </div>

                      {/* Year Badge */}
                      {demo.year && (
                        <div className="absolute top-4 right-4">
                          <Chip
                            className="bg-black/20 text-white backdrop-blur-sm"
                            size="sm"
                            variant="flat"
                          >
                            {demo.year}
                          </Chip>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardBody className="p-6 flex-1">
                    {/* Title and Description */}
                    <h3 className="text-xl font-bold mb-2">{demo.title}</h3>
                    <p className="text-sm text-default-500 mb-3 italic">
                      {config.description}
                    </p>
                    <p className="text-default-600 mb-4 line-clamp-3 leading-relaxed">
                      {demo.shortDesc || demo.description}
                    </p>

                    {/* Key Features */}
                    {demo.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 text-default-700">
                          Key Features:
                        </h4>
                        <ul className="space-y-1">
                          {demo.features.slice(0, 3).map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-default-600 flex items-start"
                            >
                              <span className="text-primary mr-1">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2 text-default-700">
                        Tech Stack:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {demo.techStack.slice(0, 4).map((tech) => (
                          <Chip key={tech} size="sm" variant="flat">
                            {tech}
                          </Chip>
                        ))}
                        {demo.techStack.length > 4 && (
                          <Chip size="sm" variant="flat">
                            +{demo.techStack.length - 4}
                          </Chip>
                        )}
                      </div>
                    </div>

                    {/* Role/Outcomes */}
                    {(demo.role ||
                      (demo.outcomes && demo.outcomes.length > 0)) && (
                      <div className="text-xs text-default-500">
                        {demo.role && (
                          <p className="mb-1">
                            <strong>Role:</strong> {demo.role}
                          </p>
                        )}
                        {demo.outcomes && demo.outcomes.length > 0 && (
                          <p>
                            <strong>Impact:</strong> {demo.outcomes[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </CardBody>

                  {/* Action Buttons */}
                  <CardFooter className="p-6 pt-0 flex gap-2">
                    {demo.liveUrl && (
                      <Button
                        className="flex-1 font-medium"
                        color="primary"
                        size="sm"
                        startContent={
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        }
                        onPress={() => {
                          const normalizedUrl = demo.liveUrl?.startsWith("http")
                            ? demo.liveUrl
                            : `https://${demo.liveUrl}`;
                          window.open(normalizedUrl, "_blank");
                        }}
                      >
                        Live Demo
                      </Button>
                    )}

                    {demo.githubUrl && (
                      <Button
                        className="flex-1 font-medium"
                        size="sm"
                        startContent={<GithubIcon className="w-4 h-4" />}
                        variant="bordered"
                        onPress={() => {
                          const normalizedUrl = demo.githubUrl?.startsWith(
                            "http",
                          )
                            ? demo.githubUrl
                            : `https://${demo.githubUrl}`;
                          window.open(normalizedUrl, "_blank");
                        }}
                      >
                        Code
                      </Button>
                    )}

                    {demo.caseStudyUrl && (
                      <Button
                        isIconOnly
                        size="sm"
                        startContent={<DocumentTextIcon className="w-4 h-4" />}
                        variant="light"
                        onPress={() => openUrl(demo.caseStudyUrl)}
                      />
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        {demos.length > 0 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="bg-default-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Build Your{" "}
                <span className="text-primary">Next Project?</span>
              </h3>
              <p className="text-default-600 mb-6 max-w-2xl mx-auto">
                These demos showcase my capabilities in full-stack development,
                modern frontend frameworks, and robust backend systems. Let's
                discuss how I can help bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  color="primary"
                  size="lg"
                  onPress={() => (window.location.href = "/contact")}
                >
                  Start Your Project
                </Button>
                <Button
                  size="lg"
                  variant="bordered"
                  onPress={() => (window.location.href = "/projects")}
                >
                  View All Projects
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {demos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-default-500 text-lg">
              Demo projects will be available soon. Check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DemosSection;
