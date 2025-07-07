"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  StarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { title } from "@/components/primitives";

interface AdminStats {
  totalProjects: number;
  totalBlogPosts: number;
  publishedPosts: number;
  totalCourses: number;
  totalSkills: number;
  totalContacts: number;
  totalViews: number;
  totalLikes: number;
  totalPrograms: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalProjects: 0,
    totalBlogPosts: 0,
    publishedPosts: 0,
    totalCourses: 0,
    totalSkills: 0,
    totalContacts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalPrograms: 0,
  });

  // Data states for each tab
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      redirect("/admin/login");
    }
    fetchDashboardData();
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        blogResponse,
        projectsResponse,
        contactsResponse,
        skillsResponse,
        coursesResponse,
        programsResponse,
      ] = await Promise.all([
        fetch("/api/admin/blog/posts"),
        fetch("/api/projects"),
        fetch("/api/contacts"),
        fetch("/api/skills"),
        fetch("/api/academic/courses"),
        fetch("/api/academic/programs"),
      ]);

      const blogData = blogResponse.ok ? await blogResponse.json() : [];
      const projectsData = projectsResponse.ok
        ? await projectsResponse.json()
        : [];
      const contactsData = contactsResponse.ok
        ? await contactsResponse.json()
        : [];
      const skillsData = skillsResponse.ok ? await skillsResponse.json() : [];
      const coursesData = coursesResponse.ok
        ? await coursesResponse.json()
        : [];
      const programsData = programsResponse.ok
        ? await programsResponse.json()
        : [];

      // Set data states
      setBlogPosts(blogData);
      setProjects(projectsData);
      setContacts(contactsData);
      setSkills(skillsData);
      setCourses(coursesData);
      setPrograms(programsData);

      // Calculate stats
      const publishedPosts = blogData.filter(
        (p: any) => p.status === "PUBLISHED",
      );
      const totalViews = blogData.reduce(
        (sum: number, p: any) => sum + (p.views || 0),
        0,
      );
      const totalLikes = blogData.reduce(
        (sum: number, p: any) => sum + (p.likes || 0),
        0,
      );

      setStats({
        totalProjects: projectsData.length,
        totalBlogPosts: blogData.length,
        publishedPosts: publishedPosts.length,
        totalCourses: coursesData.length,
        totalSkills: skillsData.length,
        totalContacts: contactsData.length,
        totalViews,
        totalLikes,
        totalPrograms: programsData.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactStatusUpdate = async (
    contactId: string,
    status: string,
  ) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setContacts(
          contacts.map((c) =>
            c.id === contactId ? { ...c, status: status as any } : c,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const handleSkillUpdate = async (skillId: string, updates: any) => {
    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedSkill = await response.json();
        setSkills(skills.map((s) => (s.id === skillId ? updatedSkill : s)));
      }
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleDeleteItem = async (
    endpoint: string,
    id: string,
    setState: any,
    items: any[],
  ) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`${endpoint}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setState(items.filter((item: any) => item.id !== id));
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "blog", label: "Blog", icon: DocumentTextIcon },
    { id: "projects", label: "Projects", icon: BriefcaseIcon },
    { id: "skills", label: "Skills", icon: Cog6ToothIcon },
    { id: "education", label: "Education", icon: AcademicCapIcon },
    { id: "contacts", label: "Messages", icon: ChatBubbleLeftRightIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-default-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={title({ size: "lg" })}>Admin Dashboard</h1>
            <p className="text-default-600 mt-2">
              Comprehensive management for your entire portfolio
            </p>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "solid" : "flat"}
                color={activeTab === tab.id ? "primary" : "default"}
                startContent={<tab.icon className="w-4 h-4" />}
                onPress={() => setActiveTab(tab.id)}
                className="flex-shrink-0"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
                  <CardBody className="text-center p-4">
                    <DocumentTextIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {stats.totalBlogPosts}
                    </div>
                    <p className="text-xs text-default-600">Blog Posts</p>
                    <Chip
                      size="sm"
                      color="success"
                      variant="flat"
                      className="mt-1"
                    >
                      {stats.publishedPosts} live
                    </Chip>
                  </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100">
                  <CardBody className="text-center p-4">
                    <BriefcaseIcon className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-secondary-600 mb-1">
                      {stats.totalProjects}
                    </div>
                    <p className="text-xs text-default-600">Projects</p>
                  </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-success-50 to-success-100">
                  <CardBody className="text-center p-4">
                    <Cog6ToothIcon className="w-8 h-8 text-success-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success-600 mb-1">
                      {stats.totalSkills}
                    </div>
                    <p className="text-xs text-default-600">Skills</p>
                  </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-warning-50 to-warning-100">
                  <CardBody className="text-center p-4">
                    <AcademicCapIcon className="w-8 h-8 text-warning-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-warning-600 mb-1">
                      {stats.totalCourses}
                    </div>
                    <p className="text-xs text-default-600">Courses</p>
                  </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-danger-50 to-danger-100">
                  <CardBody className="text-center p-4">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-danger-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-danger-600 mb-1">
                      {stats.totalContacts}
                    </div>
                    <p className="text-xs text-default-600">Messages</p>
                  </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardBody className="text-center p-4">
                    <BuildingOfficeIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {stats.totalPrograms}
                    </div>
                    <p className="text-xs text-default-600">Programs</p>
                  </CardBody>
                </Card>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Blog Management */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        Blog Posts
                      </h3>
                      <Link href="/admin/blog">
                        <Button size="sm" variant="flat" color="primary">
                          Manage All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Published</span>
                        <span className="font-medium">
                          {stats.publishedPosts}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Draft</span>
                        <span className="font-medium">
                          {stats.totalBlogPosts - stats.publishedPosts}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Views</span>
                        <span className="font-medium">{stats.totalViews}</span>
                      </div>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex gap-2">
                      <Link href="/admin/blog/new" className="flex-1">
                        <Button size="sm" color="primary" className="w-full">
                          New Post
                        </Button>
                      </Link>
                      <Link href="/admin/blog/series">
                        <Button size="sm" variant="flat">
                          Series
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>

                {/* Projects Management */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BriefcaseIcon className="w-5 h-5" />
                        Projects
                      </h3>
                      <Button size="sm" variant="flat" color="primary">
                        Add New
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Total Projects</span>
                        <span className="font-medium">
                          {stats.totalProjects}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Featured</span>
                        <span className="font-medium">-</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Technologies</span>
                        <span className="font-medium">-</span>
                      </div>
                    </div>
                    <Divider className="my-3" />
                    <Button size="sm" color="primary" className="w-full">
                      Manage Projects
                    </Button>
                  </CardBody>
                </Card>

                {/* Skills & Education */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5" />
                        Learning
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Skills</span>
                        <span className="font-medium">{stats.totalSkills}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Courses</span>
                        <span className="font-medium">
                          {stats.totalCourses}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Programs</span>
                        <span className="font-medium">
                          {stats.totalPrograms}
                        </span>
                      </div>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => setActiveTab("skills")}
                        className="flex-1"
                      >
                        Skills
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => setActiveTab("education")}
                        className="flex-1"
                      >
                        Education
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardBody className="text-center">
                    <EyeIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {stats.totalViews}
                    </div>
                    <p className="text-sm text-default-600">Total Views</p>
                  </CardBody>
                </Card>
                <Card className="bg-gradient-to-r from-pink-50 to-rose-50">
                  <CardBody className="text-center">
                    <HeartIcon className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-pink-600 mb-1">
                      {stats.totalLikes}
                    </div>
                    <p className="text-sm text-default-600">Total Likes</p>
                  </CardBody>
                </Card>
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardBody className="text-center">
                    <ChartBarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {Math.round(
                        (stats.publishedPosts /
                          Math.max(stats.totalBlogPosts, 1)) *
                          100,
                      )}
                      %
                    </div>
                    <p className="text-sm text-default-600">Publish Rate</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Blog Management
                </h2>
                <div className="flex gap-2">
                  <Link href="/admin/blog/series">
                    <Button
                      color="secondary"
                      startContent={<BookOpenIcon className="w-4 h-4" />}
                    >
                      Manage Series
                    </Button>
                  </Link>
                  <Link href="/admin/blog/new">
                    <Button
                      color="primary"
                      startContent={<PlusIcon className="w-4 h-4" />}
                    >
                      New Post
                    </Button>
                  </Link>
                  <Link href="/admin/blog">
                    <Button variant="flat" color="primary">
                      Full Blog Manager
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {blogPosts.slice(0, 8).map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4">
                            <Chip
                              size="sm"
                              color={
                                post.status === "PUBLISHED"
                                  ? "success"
                                  : "warning"
                              }
                              variant="flat"
                            >
                              {post.status}
                            </Chip>
                            {post.blog_categories && (
                              <Chip
                                size="sm"
                                variant="flat"
                                style={{
                                  backgroundColor: `${post.blog_categories.color}20`,
                                  color: post.blog_categories.color,
                                }}
                              >
                                {post.blog_categories.name}
                              </Chip>
                            )}
                            <div className="flex items-center gap-2 text-sm text-default-600">
                              <EyeIcon className="w-4 h-4" />
                              {post.views || 0}
                              <HeartIcon className="w-4 h-4" />
                              {post.likes || 0}
                              <ChatBubbleLeftRightIcon className="w-4 h-4" />
                              {post._count?.blog_comments || 0}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/blog/${post.slug}`}>
                            <Button size="sm" variant="flat" isIconOnly>
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button
                              size="sm"
                              variant="flat"
                              color="warning"
                              isIconOnly
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                {blogPosts.length === 0 && (
                  <Card>
                    <CardBody className="text-center py-12">
                      <DocumentTextIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                      <p className="text-default-600 mb-4">No blog posts yet</p>
                      <Link href="/admin/blog/new">
                        <Button
                          color="primary"
                          startContent={<PlusIcon className="w-4 h-4" />}
                        >
                          Create Your First Post
                        </Button>
                      </Link>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Skills Management
                </h2>
                <Button
                  color="primary"
                  startContent={<PlusIcon className="w-4 h-4" />}
                >
                  Add Skill
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <Card
                    key={skill.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardBody>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{skill.name}</h3>
                          <Chip size="sm" variant="flat" color="secondary">
                            {skill.category}
                          </Chip>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-default-600">
                              Proficiency
                            </span>
                            <span className="text-sm font-medium">
                              {skill.level}%
                            </span>
                          </div>
                          <Progress
                            value={skill.level}
                            color={
                              skill.level >= 90
                                ? "success"
                                : skill.level >= 70
                                  ? "primary"
                                  : "warning"
                            }
                            className="mb-2"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Chip
                            size="sm"
                            color={skill.isActive ? "success" : "default"}
                            variant="flat"
                          >
                            {skill.isActive ? "Active" : "Inactive"}
                          </Chip>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="flat"
                              isIconOnly
                              onPress={() =>
                                handleSkillUpdate(skill.id, {
                                  isActive: !skill.isActive,
                                })
                              }
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              color="warning"
                              isIconOnly
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isIconOnly
                              onPress={() =>
                                handleDeleteItem(
                                  "/api/skills",
                                  skill.id,
                                  setSkills,
                                  skills,
                                )
                              }
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                {skills.length === 0 && (
                  <Card className="md:col-span-3">
                    <CardBody className="text-center py-12">
                      <Cog6ToothIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                      <p className="text-default-600 mb-4">
                        No skills added yet
                      </p>
                      <Button
                        color="primary"
                        startContent={<PlusIcon className="w-4 h-4" />}
                      >
                        Add Your First Skill
                      </Button>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="text-center py-12">
              <AcademicCapIcon className="w-16 h-16 text-warning-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Education Management
              </h3>
              <p className="text-default-600 mb-6">
                Manage your academic programs, courses, and educational journey
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/education">
                  <Button
                    size="lg"
                    variant="flat"
                    startContent={<EyeIcon className="w-5 h-5" />}
                  >
                    View Education Page
                  </Button>
                </Link>
                <Button
                  size="lg"
                  color="primary"
                  startContent={<PlusIcon className="w-5 h-5" />}
                >
                  Add Course
                </Button>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="text-center py-12">
              <BriefcaseIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Projects Management
              </h3>
              <p className="text-default-600 mb-6">
                Showcase your work and manage project portfolios
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/projects">
                  <Button
                    size="lg"
                    variant="flat"
                    startContent={<EyeIcon className="w-5 h-5" />}
                  >
                    View Projects Page
                  </Button>
                </Link>
                <Button
                  size="lg"
                  color="primary"
                  startContent={<PlusIcon className="w-5 h-5" />}
                >
                  Add Project
                </Button>
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-danger-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contact Messages</h3>
              <p className="text-default-600 mb-6">
                Manage inquiries and communications from visitors
              </p>
              <Button
                size="lg"
                color="primary"
                startContent={<EyeIcon className="w-5 h-5" />}
              >
                View Messages ({stats.totalContacts})
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
