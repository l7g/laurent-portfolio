"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

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
  detailedDescription?: string;
  challenges?: string;
  solutions?: string;
  results?: string;
  clientName?: string;
  projectDuration?: string;
  teamSize?: string;
  myRole?: string;
}

interface FlagshipProjectCardProps {
  project: Project;
}

export function FlagshipProjectCard({ project }: FlagshipProjectCardProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (!project.flagship) return null;

  return (
    <>
      <Card
        isPressable
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onPress={onOpen}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-600">{project.shortDesc}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Chip color="warning" size="sm">
                Flagship
              </Chip>
              {project.featured && (
                <Chip color="secondary" size="sm">
                  Featured
                </Chip>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <p className="text-gray-700 text-sm mb-3">{project.description}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies.slice(0, 4).map((tech) => (
              <Chip key={tech} size="sm" variant="flat">
                {tech}
              </Chip>
            ))}
            {project.technologies.length > 4 && (
              <Chip size="sm" variant="flat">
                +{project.technologies.length - 4} more
              </Chip>
            )}
          </div>

          <div className="flex gap-2">
            {project.liveUrl && (
              <Button
                size="sm"
                startContent={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
                variant="flat"
                onPress={() => window.open(project.liveUrl, "_blank")}
              >
                Live Demo
              </Button>
            )}
            {project.githubUrl && (
              <Button
                size="sm"
                startContent={<CodeBracketIcon className="w-4 h-4" />}
                variant="flat"
                onPress={() => window.open(project.githubUrl, "_blank")}
              >
                Code
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Detailed Modal */}
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="3xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{project.title}</h2>
                  <Chip color="warning" size="sm">
                    Flagship Project
                  </Chip>
                </div>
                <p className="text-gray-600 font-normal">{project.shortDesc}</p>
              </ModalHeader>
              <ModalBody className="pb-6">
                <div className="space-y-6">
                  {/* Project Overview */}
                  <section>
                    <h3 className="text-lg font-semibold mb-2">
                      Project Overview
                    </h3>
                    <p className="text-gray-700">
                      {project.detailedDescription || project.description}
                    </p>
                  </section>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.clientName && (
                      <div>
                        <h4 className="font-medium text-gray-900">Client</h4>
                        <p className="text-gray-600">{project.clientName}</p>
                      </div>
                    )}
                    {project.projectDuration && (
                      <div>
                        <h4 className="font-medium text-gray-900">Duration</h4>
                        <p className="text-gray-600">
                          {project.projectDuration}
                        </p>
                      </div>
                    )}
                    {project.teamSize && (
                      <div>
                        <h4 className="font-medium text-gray-900">Team Size</h4>
                        <p className="text-gray-600">{project.teamSize}</p>
                      </div>
                    )}
                    {project.myRole && (
                      <div>
                        <h4 className="font-medium text-gray-900">My Role</h4>
                        <p className="text-gray-600">{project.myRole}</p>
                      </div>
                    )}
                  </div>

                  {/* Challenges */}
                  {project.challenges && (
                    <section>
                      <h3 className="text-lg font-semibold mb-2">Challenges</h3>
                      <p className="text-gray-700">{project.challenges}</p>
                    </section>
                  )}

                  {/* Solutions */}
                  {project.solutions && (
                    <section>
                      <h3 className="text-lg font-semibold mb-2">Solutions</h3>
                      <p className="text-gray-700">{project.solutions}</p>
                    </section>
                  )}

                  {/* Results */}
                  {project.results && (
                    <section>
                      <h3 className="text-lg font-semibold mb-2">Results</h3>
                      <p className="text-gray-700">{project.results}</p>
                    </section>
                  )}

                  {/* Key Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold mb-2">
                        Key Highlights
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {project.highlights.map((highlight, index) => (
                          <li key={index} className="text-gray-700">
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Technologies */}
                  <section>
                    <h3 className="text-lg font-semibold mb-2">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Chip key={tech} color="primary" variant="flat">
                          {tech}
                        </Chip>
                      ))}
                    </div>
                  </section>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    {project.liveUrl && (
                      <Button
                        color="primary"
                        startContent={
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        }
                        onPress={() => window.open(project.liveUrl, "_blank")}
                      >
                        View Live Project
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        startContent={<CodeBracketIcon className="w-4 h-4" />}
                        variant="bordered"
                        onPress={() => window.open(project.githubUrl, "_blank")}
                      >
                        View Source Code
                      </Button>
                    )}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
