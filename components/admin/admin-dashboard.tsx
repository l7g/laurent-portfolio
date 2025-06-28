"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  PencilIcon,
  EyeIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

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
  projects,
  skills,
  sections,
}: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

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
    { key: "content", title: "Content" },
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
                        <Button size="sm" variant="flat">
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

        {selectedTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Projects</h2>
              <Button color="primary">Add Project</Button>
            </div>
            <Card>
              <CardBody>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-600">
                          {project.shortDesc}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {project.technologies
                            .slice(0, 3)
                            .map((tech: string) => (
                              <Chip key={tech} size="sm" variant="flat">
                                {tech}
                              </Chip>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.flagship && (
                          <Chip color="warning" size="sm">
                            Flagship
                          </Chip>
                        )}
                        {project.featured && (
                          <Chip color="secondary" size="sm">
                            Featured
                          </Chip>
                        )}
                        <Chip
                          color={project.isActive ? "success" : "default"}
                          size="sm"
                        >
                          {project.isActive ? "Active" : "Inactive"}
                        </Chip>
                        <Button size="sm" variant="flat">
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

        {selectedTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Site Settings</h2>
            <Card>
              <CardBody>
                <p className="text-gray-600">
                  Settings management will be implemented here.
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
