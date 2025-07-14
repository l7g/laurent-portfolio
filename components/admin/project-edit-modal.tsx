"use client";

import { useState, useEffect } from "react";
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
  demo: boolean;
  demoType?: "FULLSTACK" | "FRONTEND" | "BACKEND";
  isActive: boolean;
  status: "WIP" | "READY";
  category: "DEMO" | "COMMERCIAL" | "CLIENT" | "OPENSOURCE";
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
  showWipWarning?: boolean;
  wipWarningText?: string;
  wipWarningEmoji?: string;
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
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [technologiesInput, setTechnologiesInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🚧");

  // Warning emoji options
  const emojiOptions = [
    { value: "🚧", label: "🚧 Construction" },
    { value: "⚠️", label: "⚠️ Warning" },
    { value: "🔨", label: "🔨 Building" },
    { value: "⏳", label: "⏳ In Progress" },
    { value: "🛠️", label: "🛠️ Tools" },
    { value: "🔧", label: "🔧 Development" },
    { value: "🚀", label: "🚀 Coming Soon" },
    { value: "💡", label: "💡 Concept" },
  ];

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setFormData(project);
      setTechnologiesInput(project.technologies?.join(", ") || "");
      setHighlightsInput(project.highlights?.join("\n") || "");
      setSelectedEmoji(project.wipWarningEmoji || "🚧");
    } else {
      // Reset form for new project with sensible defaults
      setFormData({
        demo: false,
        demoType: "FULLSTACK",
        category: "OPENSOURCE",
        isActive: true,
        featured: false,
        flagship: false,
        status: "WIP",
        showWipWarning: true,
      });
      setTechnologiesInput("");
      setHighlightsInput("");
      setSelectedEmoji("🚧");
    }
  }, [project]);

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
        wipWarningEmoji: selectedEmoji,
      };

      // Generate slug for new projects
      if (!project?.id && !updatedProject.slug) {
        updatedProject.slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

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
    <Modal isOpen={isOpen} scrollBehavior="inside" size="3xl" onClose={onClose}>
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
              isRequired
              label="Project Title"
              placeholder="Enter project title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
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
              folder="projects"
              placeholder="default"
              onImageChange={handleImageChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed project description"
              rows={3}
              value={formData.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Technologies */}
          <div>
            <Input
              description="Separate technologies with commas"
              label="Technologies"
              placeholder="React, TypeScript, Node.js, PostgreSQL"
              value={technologiesInput}
              onChange={(e) => setTechnologiesInput(e.target.value)}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter key features or achievements, one per line"
              rows={3}
              value={highlightsInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setHighlightsInput(e.target.value)
              }
            />
            <p className="text-xs text-gray-500 mt-1">One highlight per line</p>
          </div>

          {/* Project Status */}
          <div className="space-y-4">
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

              <Switch
                isSelected={formData.demo || false}
                onValueChange={(isSelected) =>
                  setFormData((prev) => ({ ...prev, demo: isSelected }))
                }
                color="success"
              >
                Show as Demo
              </Switch>

              <Switch
                isSelected={formData.status === "READY"}
                onValueChange={(isSelected) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: isSelected ? "READY" : "WIP",
                  }))
                }
              >
                Production Ready
              </Switch>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={formData.category || "OPENSOURCE"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as
                      | "DEMO"
                      | "COMMERCIAL"
                      | "CLIENT"
                      | "OPENSOURCE",
                  }))
                }
              >
                <option value="OPENSOURCE">Open Source</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="CLIENT">Client Work</option>
                <option value="DEMO">Demo Project</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.demo
                  ? "Required: Category helps organize demos by type on the homepage"
                  : "Optional: Helps categorize your projects"}
              </p>
            </div>
          </div>

          {/* Demo Information */}
          {formData.demo && (
            <div className="space-y-4 border border-success-200 rounded-lg p-4 bg-success-50">
              <h3 className="text-md font-semibold text-success-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                Demo Project Configuration
              </h3>

              {/* Demo Type Selection */}
              <div>
                <label className="block text-sm font-medium text-success-700 mb-2">
                  Demo Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-success-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent bg-white"
                  value={formData.demoType || "FULLSTACK"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      demoType: e.target.value as
                        | "FULLSTACK"
                        | "FRONTEND"
                        | "BACKEND",
                    }))
                  }
                >
                  <option value="FULLSTACK">
                    Full Stack - Complete web applications
                  </option>
                  <option value="FRONTEND">
                    Frontend - User interfaces & client-side apps
                  </option>
                  <option value="BACKEND">
                    Backend - APIs, services & server-side apps
                  </option>
                </select>
                <p className="text-xs text-success-600 mt-1">
                  This determines which section your demo appears in on the
                  homepage
                </p>
              </div>

              <div className="text-sm text-success-600 space-y-2">
                <p>
                  This project will appear in the <strong>Demos</strong> section
                  on your homepage.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Demos are organized by type: Full Stack, Frontend, Backend
                  </li>
                  <li>Only active demo projects will be visible to visitors</li>
                  <li>Featured demos get priority positioning</li>
                  <li>
                    Live URL and GitHub links will be prominently displayed
                  </li>
                </ul>
                <p className="font-medium">
                  Make sure to set a demo type and add a compelling description!
                </p>
              </div>
            </div>
          )}

          {/* WIP Warning Configuration */}
          {formData.status === "WIP" && (
            <div className="space-y-4 border border-warning-200 rounded-lg p-4 bg-warning-50">
              <h3 className="text-md font-semibold text-warning-700">
                WIP Warning Configuration
              </h3>

              <Switch
                isSelected={formData.showWipWarning !== false}
                onValueChange={(isSelected) =>
                  setFormData((prev) => ({
                    ...prev,
                    showWipWarning: isSelected,
                  }))
                }
              >
                Show WIP Warning Banner
              </Switch>

              {formData.showWipWarning !== false && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Warning Icon
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={selectedEmoji}
                      onChange={(e) => setSelectedEmoji(e.target.value)}
                    >
                      {emojiOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Custom Warning Message
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      placeholder="Personal project currently in development. Code is private. Contact me to discuss my development approach and capabilities."
                      rows={3}
                      value={formData.wipWarningText || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          wipWarningText: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Selected emoji ({selectedEmoji}) will be automatically
                      added. Leave empty to use the default message.
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Preview:
                    </p>
                    <p className="text-sm text-warning-700">
                      {selectedEmoji}{" "}
                      {formData.wipWarningText ||
                        "Personal project currently in development. Code is private. Contact me to discuss my development approach and capabilities."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Extended description for flagship project"
                  rows={3}
                  value={formData.detailedDescription || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      detailedDescription: e.target.value,
                    }))
                  }
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Technical challenges overcome during the project"
                  rows={3}
                  value={formData.challenges || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      challenges: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Solutions
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Solutions implemented to overcome challenges"
                  rows={3}
                  value={formData.solutions || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      solutions: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Results
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Project outcomes and results achieved"
                  rows={3}
                  value={formData.results || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      results: e.target.value,
                    }))
                  }
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
            isDisabled={!formData.title}
            isLoading={isSaving}
            onPress={handleSave}
          >
            {project ? "Update Project" : "Create Project"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
