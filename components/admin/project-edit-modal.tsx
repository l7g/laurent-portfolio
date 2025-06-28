"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import ImageUpload from "./image-upload";

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

interface ProjectEditModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: Partial<Project>) => Promise<void>;
}

export default function ProjectEditModal({
  project,
  isOpen,
  onClose,
  onSave,
}: ProjectEditModalProps) {
  const [formData, setFormData] = useState<Partial<Project>>(project || {});
  const [isSaving, setIsSaving] = useState(false);
  const [technologiesInput, setTechnologiesInput] = useState(
    project?.technologies?.join(", ") || "",
  );
  const [highlightsInput, setHighlightsInput] = useState(
    project?.highlights?.join("\n") || "",
  );

  const handleSave = async () => {
    if (!formData.title) return;

    setIsSaving(true);
    try {
      const updatedProject = {
        ...formData,
        technologies: technologiesInput
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0),
        highlights: highlightsInput
          .split("\n")
          .map((highlight) => highlight.trim())
          .filter((highlight) => highlight.length > 0),
      };

      await onSave(updatedProject);
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (newImageUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      image: newImageUrl || undefined,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">
            {project ? "Edit Project" : "Create New Project"}
          </h2>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              placeholder="Enter project title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              isRequired
            />

            <Input
              label="Short Description"
              placeholder="Brief description"
              value={formData.shortDesc || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shortDesc: e.target.value }))
              }
            />
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Image
            </label>
            <ImageUpload
              currentImageUrl={formData.image}
              onImageChange={handleImageChange}
              folder="projects"
              placeholder="default"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Description
            </label>
            <textarea
              placeholder="Detailed project description"
              value={formData.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Technologies */}
          <div>
            <Input
              label="Technologies"
              placeholder="React, TypeScript, Node.js, PostgreSQL"
              value={technologiesInput}
              onChange={(e) => setTechnologiesInput(e.target.value)}
              description="Separate technologies with commas"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {technologiesInput.split(",").map((tech, index) => {
                const trimmedTech = tech.trim();
                return trimmedTech ? (
                  <Chip key={index} size="sm" variant="flat">
                    {trimmedTech}
                  </Chip>
                ) : null;
              })}
            </div>
          </div>

          {/* Project URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Live URL"
              placeholder="https://project-demo.com"
              value={formData.liveUrl || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
              }
            />

            <Input
              label="GitHub URL"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
              }
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Key Highlights
            </label>
            <textarea
              placeholder="Enter key features or achievements, one per line"
              value={highlightsInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setHighlightsInput(e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">One highlight per line</p>
          </div>

          {/* Project Status */}
          <div className="flex flex-wrap gap-4">
            <Switch
              isSelected={formData.isActive || false}
              onValueChange={(isSelected) =>
                setFormData((prev) => ({ ...prev, isActive: isSelected }))
              }
            >
              Active
            </Switch>

            <Switch
              isSelected={formData.featured || false}
              onValueChange={(isSelected) =>
                setFormData((prev) => ({ ...prev, featured: isSelected }))
              }
            >
              Featured
            </Switch>

            <Switch
              isSelected={formData.flagship || false}
              onValueChange={(isSelected) =>
                setFormData((prev) => ({ ...prev, flagship: isSelected }))
              }
            >
              Flagship Project
            </Switch>
          </div>

          {/* Flagship-specific fields */}
          {formData.flagship && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">
                Flagship Project Details
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Detailed Description
                </label>
                <textarea
                  placeholder="Extended description for flagship project"
                  value={formData.detailedDescription || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      detailedDescription: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Client/Company"
                  placeholder="Client or company name"
                  value={formData.clientName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                />

                <Input
                  label="Project Duration"
                  placeholder="e.g., 6 months, 3 weeks"
                  value={formData.projectDuration || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectDuration: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Team Size"
                  placeholder="Solo project, Team of 4, etc."
                  value={formData.teamSize || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      teamSize: e.target.value,
                    }))
                  }
                />

                <Input
                  label="My Role"
                  placeholder="Lead Developer, Full-Stack Developer, etc."
                  value={formData.myRole || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, myRole: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Challenges
                </label>
                <textarea
                  placeholder="Technical challenges overcome during the project"
                  value={formData.challenges || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      challenges: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Solutions
                </label>
                <textarea
                  placeholder="Solutions implemented to overcome challenges"
                  value={formData.solutions || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      solutions: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Results
                </label>
                <textarea
                  placeholder="Project outcomes and results achieved"
                  value={formData.results || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      results: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={isSaving}
            isDisabled={!formData.title}
          >
            {project ? "Update Project" : "Create Project"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
