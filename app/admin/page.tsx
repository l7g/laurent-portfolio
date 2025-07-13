"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
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
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  CloudArrowUpIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { title } from "@/components/primitives";
import ProjectEditModal from "@/components/admin/project-edit-modal";
import SkillEditModal from "@/components/admin/skill-edit-modal";
import ProgramEditModal from "@/components/admin/program-edit-modal";
import CourseEditModal from "@/components/admin/course-edit-modal";
import EducationVisibilityToggle from "@/components/admin/education-visibility-toggle";

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
  totalComments: number;
  pendingComments: number;
  approvedComments: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    totalComments: 0,
    pendingComments: 0,
    approvedComments: 0,
  });

  // Data states for each tab
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  // Modal states
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Settings state
  const [settings, setSettings] = useState({
    name: "",
    description: "",
    mission: "",
    vision: "",
    contactEmail: "",
    githubUrl: "",
    linkedinUrl: "",
    cvFileName: "",
    emailSignature: "",
    responseTime: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Document management state
  const [documents, setDocuments] = useState<
    Array<{
      url: string;
      fileName: string;
      size: number;
      uploadedAt: Date;
    }>
  >([]);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [selectedCvUrl, setSelectedCvUrl] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin/login");

      return;
    }
    fetchDashboardData();
    fetchSettings();
    fetchDocuments();
  }, [session, status, router]);

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
        commentsResponse,
      ] = await Promise.all([
        fetch("/api/blog/posts"),
        fetch("/api/projects"),
        fetch("/api/contacts"),
        fetch("/api/skills?admin=true"),
        fetch("/api/academic/courses?admin=true"),
        fetch("/api/academic/programs?admin=true"),
        fetch("/api/admin/comments"),
      ]);

      const rawBlogData = blogResponse.ok ? await blogResponse.json() : {};
      const blogData = rawBlogData.posts || []; // Extract posts from paginated response
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
      const commentsData = commentsResponse.ok
        ? await commentsResponse.json()
        : { comments: [], summary: { total: 0, approved: 0, pending: 0 } };

      // Ensure all data is arrays
      const safeBlogData = Array.isArray(blogData) ? blogData : [];
      const safeProjectsData = Array.isArray(projectsData) ? projectsData : [];
      const safeContactsData = Array.isArray(contactsData) ? contactsData : [];
      const safeSkillsData = Array.isArray(skillsData) ? skillsData : [];
      const safeCoursesData = Array.isArray(coursesData) ? coursesData : [];
      const safeProgramsData = Array.isArray(programsData) ? programsData : [];

      // Set data states
      setBlogPosts(safeBlogData);
      setProjects(safeProjectsData);
      setContacts(safeContactsData);
      setSkills(safeSkillsData);
      setCourses(safeCoursesData);
      setPrograms(safeProgramsData);

      // Calculate stats
      const publishedPosts = safeBlogData.filter(
        (p: any) => p.status === "PUBLISHED",
      );
      const totalViews = safeBlogData.reduce(
        (sum: number, p: any) => sum + (p.views || 0),
        0,
      );
      const totalLikes = safeBlogData.reduce(
        (sum: number, p: any) => sum + (p.likes || 0),
        0,
      );

      setStats({
        totalProjects: safeProjectsData.length,
        totalBlogPosts: safeBlogData.length,
        publishedPosts: publishedPosts.length,
        totalCourses: safeCoursesData.length,
        totalSkills: safeSkillsData.length,
        totalContacts: safeContactsData.length,
        totalViews,
        totalLikes,
        totalPrograms: safeProgramsData.length,
        totalComments: commentsData.summary?.total || 0,
        approvedComments: commentsData.summary?.approved || 0,
        pendingComments: commentsData.summary?.pending || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactStatusUpdate = async (
    contactId: string,
    read: boolean,
  ) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });

      if (response.ok) {
        setContacts(
          contacts.map((c) => (c.id === contactId ? { ...c, read } : c)),
        );
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleProjectUpdate = async (projectId: string, updates: any) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedProject = await response.json();

        setProjects(
          projects.map((p) => (p.id === projectId ? updatedProject : p)),
        );
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleEducationUpdate = async (
    type: "program" | "course",
    id: string,
    updates: any,
  ) => {
    try {
      const endpoint =
        type === "program"
          ? `/api/academic/programs/${id}`
          : `/api/academic/courses/${id}`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated = await response.json();

        if (type === "program") {
          setPrograms(programs.map((p) => (p.id === id ? updated : p)));
        } else {
          setCourses(courses.map((c) => (c.id === id ? updated : c)));
        }
      }
    } catch (error) {
      console.error("Error updating education item:", error);
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

  // Settings functions
  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSettingsSave = async () => {
    try {
      setSettingsLoading(true);

      // Include selected CV URL in settings
      const settingsToSave = {
        ...settings,
        cvUrl: selectedCvUrl,
      };

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      });

      if (response.ok) {
        // Show success message or feedback
        console.log("Settings saved successfully");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Document management functions
  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/admin/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);

        // Find current CV if it exists
        const cvDoc = data.find(
          (doc: any) =>
            doc.fileName.toLowerCase().includes("cv") ||
            doc.fileName.toLowerCase().includes("resume"),
        );
        if (cvDoc) {
          setSelectedCvUrl(cvDoc.url);
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      setDocumentLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await fetchDocuments(); // Refresh the list
        return true;
      } else {
        const error = await response.json();
        console.error("Upload error:", error.error);
        return false;
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      return false;
    } finally {
      setDocumentLoading(false);
    }
  };

  const handleDocumentDelete = async (url: string) => {
    try {
      const response = await fetch(
        `/api/admin/documents?url=${encodeURIComponent(url)}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        await fetchDocuments(); // Refresh the list
        if (selectedCvUrl === url) {
          setSelectedCvUrl(""); // Clear selection if deleted CV was selected
        }
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleCvSelect = (url: string) => {
    setSelectedCvUrl(url);
    // Update settings with the selected CV
    const fileName = documents.find((doc) => doc.url === url)?.fileName || "";
    setSettings({ ...settings, cvFileName: fileName });
  };

  // Modal handlers
  const handleProjectSave = async (updates: any) => {
    try {
      if (editingProject.id) {
        // Updating existing project
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          const updatedProject = await response.json();

          setProjects(
            projects.map((p) =>
              p.id === editingProject.id ? updatedProject : p,
            ),
          );
          setEditingProject(null);
          fetchDashboardData();
        }
      } else {
        // Creating new project
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          const newProject = await response.json();
          setProjects([...projects, newProject]);
          setEditingProject(null);
          fetchDashboardData();
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleSkillSave = async (skillId: string, updates: any) => {
    try {
      await handleSkillUpdate(skillId, updates);
      setEditingSkill(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleProgramSave = async (programId: string, updates: any) => {
    try {
      await handleEducationUpdate("program", programId, updates);
      setEditingProgram(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating program:", error);
    }
  };

  const handleCourseSave = async (courseData: any) => {
    try {
      await handleEducationUpdate("course", courseData.id, courseData);
      setEditingCourse(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "blog", label: "Blog", icon: DocumentTextIcon },
    { id: "projects", label: "Projects", icon: BriefcaseIcon },
    { id: "skills", label: "Skills", icon: Cog6ToothIcon },
    { id: "education", label: "Education", icon: AcademicCapIcon },
    { id: "contacts", label: "Messages", icon: ChatBubbleLeftRightIcon },
    { id: "settings", label: "Settings", icon: WrenchScrewdriverIcon },
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
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
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
                className="flex-shrink-0"
                color={activeTab === tab.id ? "primary" : "default"}
                startContent={<tab.icon className="w-4 h-4" />}
                variant={activeTab === tab.id ? "solid" : "flat"}
                onPress={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
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
                      className="mt-1"
                      color="success"
                      size="sm"
                      variant="flat"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Blog Management */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        Blog Posts
                      </h3>
                      <Link href="/admin/blog">
                        <Button color="primary" size="sm" variant="flat">
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
                      <Link className="flex-1" href="/admin/blog/new">
                        <Button className="w-full" color="primary" size="sm">
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

                {/* Comments Management */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        Comments
                      </h3>
                      <Link href="/admin/blog/comments">
                        <Button color="primary" size="sm" variant="flat">
                          Manage All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Pending Review</span>
                        <span className="font-medium text-orange-600">
                          {stats.pendingComments}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Approved</span>
                        <span className="font-medium text-green-600">
                          {stats.approvedComments}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Comments</span>
                        <span className="font-medium">
                          {stats.totalComments}
                        </span>
                      </div>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex gap-2">
                      <Link className="flex-1" href="/admin/blog/comments">
                        <Button className="w-full" color="primary" size="sm">
                          Review Comments
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
                      <Button color="primary" size="sm" variant="flat">
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
                    <Button className="w-full" color="primary" size="sm">
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
                        className="flex-1"
                        size="sm"
                        variant="flat"
                        onPress={() => setActiveTab("skills")}
                      >
                        Skills
                      </Button>
                      <Button
                        className="flex-1"
                        size="sm"
                        variant="flat"
                        onPress={() => setActiveTab("education")}
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
                    <Button color="primary" variant="flat">
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
                              color={
                                post.status === "PUBLISHED"
                                  ? "success"
                                  : "warning"
                              }
                              size="sm"
                              variant="flat"
                            >
                              {post.status}
                            </Chip>
                            {post.blog_categories && (
                              <Chip
                                size="sm"
                                style={{
                                  backgroundColor: `${post.blog_categories.color}20`,
                                  color: post.blog_categories.color,
                                }}
                                variant="flat"
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
                            <Button isIconOnly size="sm" variant="flat">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button
                              isIconOnly
                              color="warning"
                              size="sm"
                              variant="flat"
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
                          <Chip color="secondary" size="sm" variant="flat">
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
                            className="mb-2"
                            color={
                              skill.level >= 90
                                ? "success"
                                : skill.level >= 70
                                  ? "primary"
                                  : "warning"
                            }
                            value={skill.level}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Chip
                            color={skill.isActive ? "success" : "default"}
                            size="sm"
                            variant="flat"
                          >
                            {skill.isActive ? "Active" : "Inactive"}
                          </Chip>
                          <div className="flex gap-1">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() =>
                                handleSkillUpdate(skill.id, {
                                  isActive: !skill.isActive,
                                })
                              }
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              isIconOnly
                              color="warning"
                              size="sm"
                              variant="flat"
                              onPress={() => setEditingSkill(skill)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              isIconOnly
                              color="danger"
                              size="sm"
                              variant="flat"
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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Education Management
                </h2>
                <div className="flex gap-2">
                  <Button
                    color="secondary"
                    startContent={<BuildingOfficeIcon className="w-4 h-4" />}
                  >
                    Add Program
                  </Button>
                  <Button
                    color="primary"
                    startContent={<PlusIcon className="w-4 h-4" />}
                  >
                    Add Course
                  </Button>
                </div>
              </div>

              {/* Education Visibility Toggle */}
              <Card className="border border-warning-200 bg-warning-50/50">
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Education Section Visibility
                      </h3>
                      <p className="text-sm text-default-600 mt-1">
                        Control whether education content appears on your
                        portfolio and in navigation
                      </p>
                    </div>
                    <EducationVisibilityToggle />
                  </div>
                </CardBody>
              </Card>

              {/* Programs Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BuildingOfficeIcon className="w-5 h-5" />
                  Academic Programs ({programs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map((program) => (
                    <Card
                      key={program.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardBody>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {program.name}
                              </h4>
                              <p className="text-sm text-default-600">
                                {program.degree} • {program.institution}
                              </p>
                              <p className="text-xs text-default-500 mt-1">
                                {new Date(program.startDate).getFullYear()} -{" "}
                                {program.endDate
                                  ? new Date(program.endDate).getFullYear()
                                  : "Present"}
                              </p>
                            </div>
                            <Chip
                              color={
                                program.status === "COMPLETED"
                                  ? "success"
                                  : program.status === "ACTIVE"
                                    ? "primary"
                                    : "warning"
                              }
                              size="sm"
                              variant="flat"
                            >
                              {program.status}
                            </Chip>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-default-600">
                              {program.gpa && <span>GPA: {program.gpa}</span>}
                              {program.skill_progressions && (
                                <span>
                                  {program.skill_progressions.length} skills
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                isIconOnly
                                color="warning"
                                size="sm"
                                variant="flat"
                                onPress={() => setEditingProgram(program)}
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="flat"
                                onPress={() =>
                                  handleDeleteItem(
                                    "/api/academic/programs",
                                    program.id,
                                    setPrograms,
                                    programs,
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
                </div>
              </div>

              {/* Courses Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5" />
                  Courses ({courses.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardBody>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {course.code}
                              </h4>
                              <p className="text-sm text-default-600 line-clamp-2">
                                {course.title}
                              </p>
                              <p className="text-xs text-default-500 mt-1">
                                {course.academic_programs?.name}
                              </p>
                            </div>
                            <Chip
                              color={
                                course.status === "COMPLETED"
                                  ? "success"
                                  : course.status === "IN_PROGRESS"
                                    ? "primary"
                                    : "warning"
                              }
                              size="sm"
                              variant="flat"
                            >
                              {course.status}
                            </Chip>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-default-600">
                              {course.year} • {course.semester}
                              {course.grade && (
                                <span className="ml-2 font-medium">
                                  Grade: {course.grade}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                isIconOnly
                                color="warning"
                                size="sm"
                                variant="flat"
                                onPress={() => setEditingCourse(course)}
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="flat"
                                onPress={() =>
                                  handleDeleteItem(
                                    "/api/academic/courses",
                                    course.id,
                                    setCourses,
                                    courses,
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
                </div>
              </div>

              {/* Empty States */}
              {programs.length === 0 && courses.length === 0 && (
                <Card>
                  <CardBody className="text-center py-12">
                    <AcademicCapIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                    <p className="text-default-600 mb-4">
                      No education data yet
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        color="secondary"
                        startContent={
                          <BuildingOfficeIcon className="w-4 h-4" />
                        }
                      >
                        Add Your First Program
                      </Button>
                      <Button
                        color="primary"
                        startContent={<PlusIcon className="w-4 h-4" />}
                      >
                        Add Your First Course
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Projects Management
                </h2>
                <div className="flex gap-2">
                  <Link href="/projects">
                    <Button
                      startContent={<EyeIcon className="w-4 h-4" />}
                      variant="flat"
                    >
                      View Portfolio
                    </Button>
                  </Link>
                  <Button
                    color="primary"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onPress={() => setEditingProject({})}
                  >
                    Add Project
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardBody>
                      <div className="space-y-4">
                        {/* Project Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {project.title}
                            </h3>
                            <p className="text-sm text-default-600 line-clamp-2">
                              {project.shortDesc || project.description}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 ml-2">
                            {project.flagship && (
                              <Chip color="warning" size="sm" variant="flat">
                                Flagship
                              </Chip>
                            )}
                            {project.featured && (
                              <Chip color="secondary" size="sm" variant="flat">
                                Featured
                              </Chip>
                            )}
                          </div>
                        </div>

                        {/* Project Image */}
                        {project.image && (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-default-100">
                            <img
                              alt={project.title}
                              className="w-full h-full object-cover"
                              src={project.image}
                            />
                          </div>
                        )}

                        {/* Project Status & Tech */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Chip
                              color={
                                project.status === "READY"
                                  ? "success"
                                  : project.status === "WIP"
                                    ? "warning"
                                    : "default"
                              }
                              size="sm"
                              variant="flat"
                            >
                              {project.status}
                            </Chip>
                            <Chip
                              color={project.isActive ? "success" : "default"}
                              size="sm"
                              variant="flat"
                            >
                              {project.isActive ? "Active" : "Hidden"}
                            </Chip>
                          </div>

                          {/* Technologies */}
                          {project.technologies &&
                            project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {project.technologies
                                  .slice(0, 3)
                                  .map((tech: string, index: number) => (
                                    <Chip
                                      key={index}
                                      className="text-xs"
                                      size="sm"
                                      variant="flat"
                                    >
                                      {tech}
                                    </Chip>
                                  ))}
                                {project.technologies.length > 3 && (
                                  <Chip
                                    className="text-xs"
                                    size="sm"
                                    variant="flat"
                                  >
                                    +{project.technologies.length - 3} more
                                  </Chip>
                                )}
                              </div>
                            )}
                        </div>

                        {/* Project Links */}
                        <div className="flex items-center gap-2">
                          {project.liveUrl && (
                            <Link href={project.liveUrl} target="_blank">
                              <Button isIconOnly size="sm" variant="flat">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                          {project.githubUrl && (
                            <Link href={project.githubUrl} target="_blank">
                              <Button isIconOnly size="sm" variant="flat">
                                <Cog6ToothIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/projects/${project.slug}`}>
                            <Button isIconOnly size="sm" variant="flat">
                              <DocumentTextIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-default-200">
                          <Button
                            className="flex-1"
                            color="warning"
                            size="sm"
                            startContent={<PencilIcon className="w-4 h-4" />}
                            variant="flat"
                            onPress={() => setEditingProject(project)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() =>
                              handleDeleteItem(
                                "/api/projects",
                                project.id,
                                setProjects,
                                projects,
                              )
                            }
                          >
                            <TrashIcon className="w-4 h-4 text-danger" />
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() =>
                              fetch(`/api/projects/${project.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  isActive: !project.isActive,
                                }),
                              }).then(() => fetchDashboardData())
                            }
                          >
                            {project.isActive ? "Hide" : "Show"}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                {projects.length === 0 && (
                  <Card className="md:col-span-3">
                    <CardBody className="text-center py-12">
                      <BriefcaseIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                      <p className="text-default-600 mb-4">No projects yet</p>
                      <Button
                        color="primary"
                        startContent={<PlusIcon className="w-4 h-4" />}
                      >
                        Create Your First Project
                      </Button>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Contact Messages
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="flat"
                    onPress={() => {
                      const unreadCount = contacts.filter(
                        (c) => !c.read,
                      ).length;

                      if (unreadCount > 0) {
                        // Mark all as read
                        Promise.all(
                          contacts
                            .filter((c) => !c.read)
                            .map((c) =>
                              fetch(`/api/contacts/${c.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ read: true }),
                              }),
                            ),
                        ).then(() => fetchDashboardData());
                      }
                    }}
                  >
                    Mark All Read
                  </Button>
                  <Chip color="primary" size="lg" variant="flat">
                    {contacts.filter((c) => !c.read).length} unread
                  </Chip>
                </div>
              </div>

              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className={`hover:shadow-lg transition-shadow ${
                      !contact.read
                        ? "border-l-4 border-l-primary bg-primary-50/50"
                        : ""
                    }`}
                  >
                    <CardBody>
                      <div className="space-y-4">
                        {/* Message Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {contact.name}
                                </h3>
                                <p className="text-sm text-default-600">
                                  {contact.email}
                                </p>
                              </div>
                              {!contact.read && (
                                <Chip color="primary" size="sm" variant="flat">
                                  New
                                </Chip>
                              )}
                            </div>
                            <h4 className="font-medium text-foreground mb-2">
                              {contact.subject || "No Subject"}
                            </h4>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-default-500">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-default-500">
                              {new Date(contact.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="bg-default-50 rounded-lg p-4">
                          <p className="text-sm text-default-700 whitespace-pre-wrap">
                            {contact.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-default-200">
                          <div className="flex gap-2">
                            <Link href={`mailto:${contact.email}`}>
                              <Button
                                color="primary"
                                size="sm"
                                startContent={
                                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                }
                              >
                                Reply
                              </Button>
                            </Link>
                            <Button
                              color={contact.read ? "default" : "primary"}
                              size="sm"
                              variant="flat"
                              onPress={() =>
                                handleContactStatusUpdate(
                                  contact.id,
                                  !contact.read,
                                )
                              }
                            >
                              {contact.read ? "Mark Unread" : "Mark Read"}
                            </Button>
                          </div>
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            variant="flat"
                            onPress={() =>
                              handleDeleteItem(
                                "/api/contacts",
                                contact.id,
                                setContacts,
                                contacts,
                              )
                            }
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                {contacts.length === 0 && (
                  <Card>
                    <CardBody className="text-center py-12">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 text-default-400 mx-auto mb-4" />
                      <p className="text-default-600 mb-4">
                        No messages received yet
                      </p>
                      <p className="text-sm text-default-500">
                        Messages from your contact form will appear here
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Site Settings
                </h2>
                <Button
                  color="primary"
                  isLoading={settingsLoading}
                  onPress={handleSettingsSave}
                >
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <Input
                      label="Site Name"
                      placeholder="Your portfolio name"
                      value={settings.name}
                      onChange={(e) =>
                        setSettings({ ...settings, name: e.target.value })
                      }
                    />
                    <Textarea
                      label="Site Description"
                      placeholder="A brief description of yourself and your work"
                      value={settings.description}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          description: e.target.value,
                        })
                      }
                      minRows={3}
                    />
                    <Textarea
                      label="Mission Statement"
                      placeholder="Your professional mission"
                      value={settings.mission}
                      onChange={(e) =>
                        setSettings({ ...settings, mission: e.target.value })
                      }
                      minRows={2}
                    />
                    <Textarea
                      label="Vision Statement"
                      placeholder="Your professional vision"
                      value={settings.vision}
                      onChange={(e) =>
                        setSettings({ ...settings, vision: e.target.value })
                      }
                      minRows={2}
                    />
                  </CardBody>
                </Card>

                {/* Contact & Social Links */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Contact & Social</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <Input
                      label="Contact Email"
                      placeholder="your.email@example.com"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactEmail: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="GitHub URL"
                      placeholder="https://github.com/yourusername"
                      value={settings.githubUrl}
                      onChange={(e) =>
                        setSettings({ ...settings, githubUrl: e.target.value })
                      }
                    />
                    <Input
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={settings.linkedinUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          linkedinUrl: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="CV File Name"
                      placeholder="Your_CV.pdf"
                      value={settings.cvFileName}
                      onChange={(e) =>
                        setSettings({ ...settings, cvFileName: e.target.value })
                      }
                      description="Name of your CV file in the public folder"
                    />
                  </CardBody>
                </Card>

                {/* Email Configuration */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Email Configuration
                    </h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <Input
                      label="Email Response Time"
                      placeholder="24-48 hours"
                      value={settings.responseTime}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          responseTime: e.target.value,
                        })
                      }
                      description="Expected response time for emails"
                    />
                    <Textarea
                      label="Email Signature"
                      placeholder="Your professional email signature"
                      value={settings.emailSignature}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailSignature: e.target.value,
                        })
                      }
                      minRows={6}
                      description="Professional signature for automated emails"
                    />
                  </CardBody>
                </Card>

                {/* CV Management Section */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">CV Management</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-6">
                      {/* Upload Area */}
                      <div className="p-6 border-2 border-dashed border-default-300 rounded-lg text-center">
                        <CloudArrowUpIcon className="w-12 h-12 text-default-400 mx-auto mb-2" />
                        <p className="text-default-600 mb-2">Upload your CV</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="cv-upload"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const success = await handleDocumentUpload(file);
                              if (success) {
                                // Auto-select newly uploaded file if it's a CV
                                if (
                                  file.name.toLowerCase().includes("cv") ||
                                  file.name.toLowerCase().includes("resume")
                                ) {
                                  const newDoc = documents.find(
                                    (doc) => doc.fileName === file.name,
                                  );
                                  if (newDoc) {
                                    handleCvSelect(newDoc.url);
                                  }
                                }
                              }
                            }
                          }}
                        />
                        <Button
                          variant="flat"
                          size="sm"
                          isLoading={documentLoading}
                          onPress={() =>
                            document.getElementById("cv-upload")?.click()
                          }
                        >
                          Choose File
                        </Button>
                        <p className="text-xs text-default-500 mt-2">
                          Accepted formats: PDF, DOC, DOCX (Max 10MB)
                        </p>
                      </div>

                      {/* Document List */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-default-700">
                          Available Documents ({documents.length})
                        </h4>
                        {documents.length > 0 ? (
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {documents.map((doc, index) => (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                  selectedCvUrl === doc.url
                                    ? "border-primary bg-primary/5"
                                    : "border-default-200 bg-default-50 hover:bg-default-100"
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <DocumentIcon className="w-5 h-5 text-default-600 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">
                                      {doc.fileName}
                                    </p>
                                    <p className="text-xs text-default-500">
                                      {(doc.size / 1024 / 1024).toFixed(2)} MB •{" "}
                                      {new Date(
                                        doc.uploadedAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    onPress={() =>
                                      window.open(doc.url, "_blank")
                                    }
                                  >
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    color={
                                      selectedCvUrl === doc.url
                                        ? "primary"
                                        : "default"
                                    }
                                    variant={
                                      selectedCvUrl === doc.url
                                        ? "solid"
                                        : "flat"
                                    }
                                    onPress={() => handleCvSelect(doc.url)}
                                  >
                                    {selectedCvUrl === doc.url
                                      ? "Selected"
                                      : "Select as CV"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="danger"
                                    onPress={() =>
                                      handleDocumentDelete(doc.url)
                                    }
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-default-500">
                            <DocumentIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No documents uploaded yet</p>
                          </div>
                        )}
                      </div>

                      {/* Selected CV Display */}
                      {selectedCvUrl && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <DocumentTextIcon className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">
                              Selected CV
                            </span>
                          </div>
                          <p className="text-sm text-default-600">
                            {documents.find((doc) => doc.url === selectedCvUrl)
                              ?.fileName || "Unknown file"}
                          </p>
                          <p className="text-xs text-default-500 mt-1">
                            This CV will be used in your portfolio navigation
                            and download links.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modals */}
      <ProjectEditModal
        isOpen={!!editingProject}
        project={editingProject?.id ? editingProject : null}
        onClose={() => setEditingProject(null)}
        onSave={handleProjectSave}
      />

      {editingSkill && (
        <SkillEditModal
          isOpen={!!editingSkill}
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSave={handleSkillSave}
        />
      )}

      {editingProgram && (
        <ProgramEditModal
          isOpen={!!editingProgram}
          program={editingProgram}
          onClose={() => setEditingProgram(null)}
          onSave={handleProgramSave}
        />
      )}

      {editingCourse && (
        <CourseEditModal
          academic_programs={programs}
          course={editingCourse}
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleCourseSave}
        />
      )}
    </div>
  );
}
