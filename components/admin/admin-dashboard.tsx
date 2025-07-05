"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useDisclosure } from "@heroui/modal";
import {
  PencilIcon,
  EyeIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { getProjectImageUrl } from "@/lib/blob-storage";
import { useApi } from "@/lib/use-api";
import ProjectEditModal from "./project-edit-modal";
import SectionContentEditModal from "./section-content-edit-modal";
import PageEditModal from "./page-edit-modal";
import SettingsManager from "./settings-manager";

interface AdminDashboardProps {
  contacts: any[];
  demoRequests: any[];
  projects: any[];
  skills: any[];
  sections: any[];
}

export default function AdminDashboard({
  contacts,
  demoRequests,
  projects: initialProjects,
  skills: initialSkills,
  sections: initialSections,
}: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [projects, setProjects] = useState(initialProjects);
  const [skills, setSkills] = useState(initialSkills);
  const [sections, setSections] = useState(initialSections);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const {
    isOpen: isProjectModalOpen,
    onOpen: onProjectModalOpen,
    onClose: onProjectModalClose,
  } = useDisclosure();

  const {
    isOpen: isSectionModalOpen,
    onOpen: onSectionModalOpen,
    onClose: onSectionModalClose,
  } = useDisclosure();

  const {
    isOpen: isPageModalOpen,
    onOpen: onPageModalOpen,
    onClose: onPageModalClose,
  } = useDisclosure();

  const api = useApi();

  // Refresh data functions
  const refreshProjects = async () => {
    const response = await api.projects.getAll();
    if (response.data) {
      setProjects(response.data);
    }
  };

  const refreshSkills = async () => {
    const response = await api.skills.getAll();
    if (response.data) {
      setSkills(response.data);
    }
  };

  const refreshSections = async () => {
    const response = await api.sections.getAll();
    if (response.data) {
      setSections(response.data);
    }
  };

  const refreshPages = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      if (response.ok) {
        const pagesData = await response.json();
        setPages(pagesData);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    }
  };

  // Fetch pages on component mount
  useEffect(() => {
    refreshPages();
  }, []);

  // Project operations
  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    onProjectModalOpen();
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    onProjectModalOpen();
  };

  // Section operations
  const handleEditSection = (section: any) => {
    setSelectedSection(section);
    onSectionModalOpen();
  };

  // Page operations
  const handleDeletePage = async (pageId: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        const response = await fetch(`/api/admin/pages/${pageId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await refreshPages();
        } else {
          alert("Failed to delete page");
        }
      } catch (error) {
        console.error("Error deleting page:", error);
        alert("Failed to delete page");
      }
    }
  };

  const handleSavePage = async (pageData: any) => {
    try {
      const url = selectedPage
        ? `/api/admin/pages/${selectedPage.id}`
        : "/api/admin/pages";
      const method = selectedPage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        await refreshPages();
        alert(
          selectedPage
            ? "Page updated successfully!"
            : "Page created successfully!",
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to save page: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page");
    }
  };

  const handleSaveProject = async (projectData: any) => {
    if (selectedProject) {
      // Update existing project
      await api.projects.update(selectedProject.id, projectData, {
        onSuccess: () => {
          refreshProjects();
          alert("Project updated successfully!");
        },
        onError: (error) => alert(`Failed to update project: ${error}`),
      });
    } else {
      // Create new project
      await api.projects.create(projectData, {
        onSuccess: () => {
          refreshProjects();
          alert("Project created successfully!");
        },
        onError: (error) => alert(`Failed to create project: ${error}`),
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    await api.projects.delete(projectId, {
      onSuccess: () => {
        refreshProjects();
        alert("Project deleted successfully!");
      },
      onError: (error) => alert(`Failed to delete project: ${error}`),
    });
  };

  const stats = [
    {
      title: "Contact Messages",
      value: contacts.length,
      unread: contacts.filter((c) => !c.read).length,
      icon: UserIcon,
    },
    {
      title: "Demo Requests",
      value: demoRequests.length,
      pending: demoRequests.filter((d) => d.status === "PENDING").length,
      icon: DocumentTextIcon,
    },
    {
      title: "Active Projects",
      value: projects.filter((p) => p.isActive).length,
      total: projects.length,
      icon: ChartBarIcon,
    },
    {
      title: "Skills Listed",
      value: skills.filter((s) => s.isActive).length,
      total: skills.length,
      icon: CogIcon,
    },
  ];

  const tabs = [
    { key: "overview", title: "Overview" },
    { key: "content", title: "Portfolio Sections" },
    { key: "pages", title: "Pages" },
    { key: "projects", title: "Projects" },
    { key: "messages", title: "Messages" },
    { key: "settings", title: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portfolio Admin
              </h1>
              <p className="text-gray-600">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                startContent={<EyeIcon className="w-4 h-4" />}
                variant="flat"
                onPress={() => window.open("/", "_blank")}
              >
                View Site
              </Button>
              <Button
                color="primary"
                startContent={<PencilIcon className="w-4 h-4" />}
              >
                Quick Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Tabs" className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTab(tab.key)}
              >
                {tab.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        {(stat as any).unread > 0 && (
                          <Chip color="danger" size="sm">
                            {(stat as any).unread} unread
                          </Chip>
                        )}
                        {(stat as any).pending > 0 && (
                          <Chip color="warning" size="sm">
                            {(stat as any).pending} pending
                          </Chip>
                        )}
                      </div>
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <stat.icon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Recent Messages</h3>
                </CardHeader>
                <CardBody>
                  {contacts.slice(0, 5).map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">
                          {contact.subject}
                        </p>
                      </div>
                      {!contact.read && (
                        <Chip color="primary" size="sm">
                          New
                        </Chip>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Flagship Projects</h3>
                </CardHeader>
                <CardBody>
                  {projects
                    .filter((p) => p.flagship)
                    .map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-gray-600">
                            {project.shortDesc}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip color="warning" size="sm">
                            Flagship
                          </Chip>
                          <Chip
                            color={project.isActive ? "success" : "default"}
                            size="sm"
                          >
                            {project.isActive ? "Active" : "Inactive"}
                          </Chip>
                        </div>
                      </div>
                    ))}
                  {projects.filter((p) => p.flagship).length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No flagship projects yet
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === "content" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Portfolio Sections</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{section.displayName}</h4>
                        <p className="text-sm text-gray-600">
                          {section.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip
                          color={section.isActive ? "success" : "default"}
                          size="sm"
                        >
                          {section.isActive ? "Active" : "Inactive"}
                        </Chip>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => handleEditSection(section)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {selectedTab === "pages" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Pages</h2>
              <Button
                color="primary"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={() => {
                  setSelectedPage(null);
                  onPageModalOpen();
                }}
              >
                Add Page
              </Button>
            </div>

            <Card>
              <CardBody>
                <div className="space-y-3">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{page.title}</h4>
                          {page.isHomepage && (
                            <Chip color="primary" size="sm" variant="flat">
                              Homepage
                            </Chip>
                          )}
                          <Chip
                            color={page.isPublished ? "success" : "warning"}
                            size="sm"
                            variant="flat"
                          >
                            {page.isPublished ? "Published" : "Draft"}
                          </Chip>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          /{page.slug}
                        </p>
                        <p className="text-sm text-gray-500">
                          {page.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onPress={() => window.open(`/${page.slug}`, "_blank")}
                          isDisabled={!page.isPublished}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<PencilIcon className="w-4 h-4" />}
                          onPress={() => {
                            setSelectedPage(page);
                            onPageModalOpen();
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          startContent={<TrashIcon className="w-4 h-4" />}
                          onPress={() => handleDeletePage(page.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}

                  {pages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No pages created yet</p>
                      <p className="text-sm">
                        Create your first page to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {selectedTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Projects</h2>
              <Button
                color="primary"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={handleAddProject}
              >
                Add Project
              </Button>
            </div>
            <Card>
              <CardBody>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{project.title}</h4>
                          {project.flagship && (
                            <Chip size="sm" color="warning" variant="flat">
                              Flagship
                            </Chip>
                          )}
                          {project.featured && (
                            <Chip size="sm" color="primary" variant="flat">
                              Featured
                            </Chip>
                          )}
                          {!project.isActive && (
                            <Chip size="sm" color="danger" variant="flat">
                              Inactive
                            </Chip>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {project.shortDesc || project.description}
                        </p>
                        <div className="flex gap-2">
                          {project.technologies
                            .slice(0, 3)
                            .map((tech: string) => (
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
                      </div>

                      {/* Project Image Preview */}
                      <div className="w-24 h-18 flex-shrink-0 mx-4">
                        <img
                          src={getProjectImageUrl(project.image, "default")}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() => handleEditProject(project)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => handleDeleteProject(project.id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No projects found. Add your first project to get started!
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {selectedTab === "messages" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Contact Messages</h2>
            <Card>
              <CardBody>
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-gray-500">
                            {contact.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!contact.read && (
                            <Chip color="primary" size="sm">
                              New
                            </Chip>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="font-medium mb-1">{contact.subject}</p>
                      <p className="text-gray-600">{contact.message}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {selectedTab === "settings" && <SettingsManager />}
      </div>

      {/* Project Edit Modal */}
      <ProjectEditModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={onProjectModalClose}
        onSave={handleSaveProject}
      />

      {/* Section Content Edit Modal */}
      <SectionContentEditModal
        section={selectedSection}
        isOpen={isSectionModalOpen}
        onClose={onSectionModalClose}
        onUpdate={refreshSections}
      />

      {/* Page Edit Modal */}
      <PageEditModal
        page={selectedPage}
        isOpen={isPageModalOpen}
        onClose={onPageModalClose}
        onSave={handleSavePage}
      />
    </div>
  );
}
