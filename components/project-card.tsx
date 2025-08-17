"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

import { getProjectImageUrl } from "@/lib/blob-storage";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  image?: string;
  technologies: string[];
  featured: boolean;
  flagship: boolean;
  isActive: boolean;
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
}

interface ProjectCardProps {
  project: Project;
  imageType?: "default" | "web" | "mobile" | "api" | "database";
}

export function ProjectCard({
  project,
  imageType = "default",
}: ProjectCardProps) {
  const determineImageType = (): typeof imageType => {
    if (imageType !== "default") return imageType;

    // Auto-detect based on technologies
    const techs = project.technologies.map((t) => t.toLowerCase());

    if (
      techs.some((t) =>
        ["react native", "flutter", "ios", "android", "mobile"].includes(t),
      )
    ) {
      return "mobile";
    }
    if (
      techs.some((t) =>
        ["api", "rest", "graphql", "express", "fastapi", "node"].includes(t),
      )
    ) {
      return "api";
    }
    if (
      techs.some((t) =>
        [
          "postgresql",
          "mongodb",
          "mysql",
          "database",
          "prisma",
          "sql",
        ].includes(t),
      )
    ) {
      return "database";
    }
    if (
      techs.some((t) =>
        ["react", "vue", "angular", "next", "frontend", "web"].includes(t),
      )
    ) {
      return "web";
    }

    return "default";
  };

  const projectImageType = determineImageType();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-600">{project.shortDesc}</p>
          </div>
          <div className="flex flex-col gap-1">
            {project.featured && (
              <Chip color="secondary" size="sm">
                Featured
              </Chip>
            )}
            {!project.isActive && (
              <Chip color="default" size="sm">
                In Development
              </Chip>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        {/* Project Image */}
        <div className="mb-4">
          <Image
            alt={project.title}
            className="w-full h-40 object-cover rounded-lg"
            fallbackSrc={getProjectImageUrl(null, projectImageType)}
            src={getProjectImageUrl(project.image, projectImageType)}
          />
        </div>

        <p className="text-gray-700 text-sm mb-3">{project.description}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, 3).map((tech) => (
            <Chip key={tech} size="sm" variant="flat">
              {tech}
            </Chip>
          ))}
          {project.technologies.length > 3 && (
            <Chip size="sm" variant="flat">
              +{project.technologies.length - 3} more
            </Chip>
          )}
        </div>

        {/* Key Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mb-3">
            <ul className="text-xs text-gray-600 space-y-1">
              {project.highlights.slice(0, 2).map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-1">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {project.liveUrl && (
            <Button
              size="sm"
              startContent={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
              variant="flat"
              onPress={() => {
                const normalizedUrl = project.liveUrl?.startsWith("http")
                  ? project.liveUrl
                  : `https://${project.liveUrl}`;
                window.open(normalizedUrl, "_blank");
              }}
            >
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button
              size="sm"
              startContent={<CodeBracketIcon className="w-4 h-4" />}
              variant="flat"
              onPress={() => {
                const normalizedUrl = project.githubUrl?.startsWith("http")
                  ? project.githubUrl
                  : `https://${project.githubUrl}`;
                window.open(normalizedUrl, "_blank");
              }}
            >
              Code
            </Button>
          )}
          {!project.liveUrl && !project.githubUrl && (
            <Chip color="default" size="sm" variant="flat">
              Coming Soon
            </Chip>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
