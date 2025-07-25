"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import CourseEditModal from "./course-edit-modal";

interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  credits: number;
  programId?: string;
  year: number;
  semester: string;
  status: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  instructor?: string;
  instructorBio?: string;
  officeHours?: string;
  syllabus?: string;
  isPublic: boolean;
  featured: boolean;
  sortOrder: number;
  objectives: string[];
  topics: string[];
  prerequisites: string[];
  textbooks: string[];
  resources: string[];
  skillsDelivered: string[];
  assessments: any[];
  blogPosts: any[];
  course_assessments?: any[];
  blog_posts?: any[];
  program?: {
    id: string;
    name: string;
    degree: string;
  };
}

interface academic_programs {
  id: string;
  name: string;
  degree: string;
  institution: string;
  currentYear: number;
  totalYears: number;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicPrograms, setAcademicPrograms] = useState<academic_programs[]>(
    [],
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesResponse, programsResponse] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/academic-program"),
      ]);

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();

        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } else {
        console.error("Failed to fetch courses");
        setCourses([]);
      }

      if (programsResponse.ok) {
        const programsData = await programsResponse.json();

        setAcademicPrograms(Array.isArray(programsData) ? programsData : []);
      } else {
        console.error("Failed to fetch academic programs");
        setAcademicPrograms([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setCourses([]);
      setAcademicPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    onOpen();
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    onOpen();
  };

  const handleSaveCourse = async (courseData: any) => {
    try {
      const method = selectedCourse ? "PUT" : "POST";
      const url = selectedCourse
        ? `/api/courses/${selectedCourse.id}`
        : "/api/courses";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        await fetchData();
        onClose();
      } else {
        throw new Error("Failed to save course");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      throw error;
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchData();
        } else {
          throw new Error("Failed to delete course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course");
      }
    }
  };

  const toggleCourseVisibility = async (
    courseId: string,
    isPublic: boolean,
  ) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating course visibility:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "upcoming":
        return "warning";
      case "deferred":
        return "secondary";
      case "withdrawn":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "in_progress":
        return <ClockIcon className="w-4 h-4" />;
      case "upcoming":
        return <ClockIcon className="w-4 h-4" />;
      case "deferred":
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case "withdrawn":
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor &&
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" ||
      course.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesYear =
      filterYear === "all" || course.year.toString() === filterYear;

    return matchesSearch && matchesStatus && matchesYear;
  });

  const coursesByYear = (filteredCourses || []).reduce(
    (acc, course) => {
      const year = course.year;

      if (!acc[year]) acc[year] = [];
      acc[year].push(course);

      return acc;
    },
    {} as Record<number, Course[]>,
  );

  const courseStats = {
    total: (courses || []).length,
    completed: (courses || []).filter((c) => c.status === "COMPLETED").length,
    inProgress: (courses || []).filter((c) => c.status === "IN_PROGRESS")
      .length,
    upcoming: (courses || []).filter((c) => c.status === "UPCOMING").length,
    totalCredits: (courses || []).reduce((sum, c) => sum + (c.credits || 0), 0),
    completedCredits: (courses || [])
      .filter((c) => c.status === "COMPLETED")
      .reduce((sum, c) => sum + (c.credits || 0), 0),
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Management</h1>
          <p className="text-default-600">
            Manage your academic courses and track progress
          </p>
        </div>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={handleCreateCourse}
        >
          Add New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-default-600">Total Courses</p>
                <p className="text-2xl font-bold">{courseStats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-default-600">Completed</p>
                <p className="text-2xl font-bold">{courseStats.completed}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-default-600">In Progress</p>
                <p className="text-2xl font-bold">{courseStats.inProgress}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10 text-warning">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-default-600">Upcoming</p>
                <p className="text-2xl font-bold">{courseStats.upcoming}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <ChartBarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-default-600">Credits</p>
                <p className="text-2xl font-bold">
                  {courseStats.completedCredits}/{courseStats.totalCredits}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-default-500" />
              <Input
                className="w-64"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-default-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="deferred">Deferred</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-default-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Courses by Year */}
      <div className="space-y-8">
        {Object.keys(coursesByYear).length === 0 ? (
          <Card>
            <CardBody className="p-8 text-center">
              <BookOpenIcon className="w-12 h-12 text-default-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-default-600 mb-4">
                {searchTerm || filterStatus !== "all" || filterYear !== "all"
                  ? "No courses match your current filters."
                  : "You haven't added any courses yet."}
              </p>
              <Button
                color="primary"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={handleCreateCourse}
              >
                Add Your First Course
              </Button>
            </CardBody>
          </Card>
        ) : (
          Object.keys(coursesByYear)
            .sort()
            .map((year) => (
              <motion.div
                key={year}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold">Year {year}</h2>
                  <Chip color="default" variant="flat">
                    {(coursesByYear[parseInt(year)] || []).length} courses
                  </Chip>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(coursesByYear[parseInt(year)] || []).map((course) => (
                    <Card
                      key={course.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <BookOpenIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-default-600">
                                {course.code}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {course.featured && (
                              <StarIcon className="w-4 h-4 text-warning" />
                            )}
                            <Chip
                              color={getStatusColor(course.status)}
                              size="sm"
                              startContent={getStatusIcon(course.status)}
                              variant="flat"
                            >
                              {course.status}
                            </Chip>
                          </div>
                        </div>
                      </CardHeader>

                      <CardBody className="pt-0">
                        <div className="space-y-3">
                          {course.description && (
                            <p className="text-sm text-default-700 line-clamp-2">
                              {course.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-default-600">
                              {course.credits} credits • {course.semester}
                            </span>
                            {course.grade && (
                              <span className="font-medium text-success">
                                Grade: {course.grade}
                              </span>
                            )}
                          </div>

                          {course.instructor && (
                            <p className="text-sm text-default-600">
                              Instructor: {course.instructor}
                            </p>
                          )}

                          {course.skillsDelivered &&
                            Array.isArray(course.skillsDelivered) &&
                            course.skillsDelivered.length > 0 && (
                              <div>
                                <p className="text-xs text-default-500 mb-1">
                                  Skills Delivered:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {course.skillsDelivered
                                    .slice(0, 3)
                                    .map((skill) => (
                                      <Chip
                                        key={skill}
                                        color="secondary"
                                        size="sm"
                                        variant="flat"
                                      >
                                        {skill}
                                      </Chip>
                                    ))}
                                  {course.skillsDelivered.length > 3 && (
                                    <Chip
                                      color="default"
                                      size="sm"
                                      variant="flat"
                                    >
                                      +{course.skillsDelivered.length - 3} more
                                    </Chip>
                                  )}
                                </div>
                              </div>
                            )}

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-default-500">
                                {Array.isArray(course.course_assessments)
                                  ? course.course_assessments.length
                                  : 0}{" "}
                                assessments
                              </span>
                              <span className="text-xs text-default-500">
                                {Array.isArray(course.blog_posts)
                                  ? course.blog_posts.length
                                  : 0}{" "}
                                blog posts
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="light"
                                onPress={() =>
                                  toggleCourseVisibility(
                                    course.id,
                                    course.isPublic,
                                  )
                                }
                              >
                                {course.isPublic ? (
                                  <EyeIcon className="w-4 h-4" />
                                ) : (
                                  <EyeSlashIcon className="w-4 h-4" />
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant="light"
                                onPress={() => handleEditCourse(course)}
                              >
                                <PencilIcon className="w-4 h-4" />
                              </Button>

                              <Button
                                color="danger"
                                size="sm"
                                variant="light"
                                onPress={() => handleDeleteCourse(course.id)}
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
              </motion.div>
            ))
        )}
      </div>

      {/* Course Edit Modal */}
      <CourseEditModal
        academic_programs={academicPrograms}
        course={selectedCourse || undefined}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default CourseManagement;
