"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ChevronRightIcon,
  UserIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import AcademicSkillsDisplay from "@/components/academic-skills-display";

interface academic_programs {
  id: string;
  name: string;
  degree: string;
  institution: string;
  accreditation?: string;
  description?: string;
  startDate: string;
  expectedEnd: string;
  currentYear: number;
  totalYears: number;
  mode?: string;
  status: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  credits: number;
  year: number;
  semester: string;
  objectives?: string[];
  topics?: string[];
  prerequisites?: string[];
  status: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  instructor?: string;
  instructorBio?: string;
  officeHours?: string;
  syllabus?: string;
  textbooks?: string[];
  resources?: string[];
  isPublic: boolean;
  featured: boolean;
  assessments?: CourseAssessment[];
  blogPosts?: BlogPost[];
}

interface CourseAssessment {
  id: string;
  title: string;
  type: string;
  weight: number;
  dueDate?: string;
  completed: boolean;
  grade?: string;
  feedback?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  status: string;
}

const DegreePage = () => {
  const [program, setProgram] = useState<academic_programs | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programResponse, coursesResponse] = await Promise.all([
          fetch("/api/academic-program"),
          fetch("/api/courses"),
        ]);

        if (programResponse.ok) {
          const programData = await programResponse.json();

          setProgram(programData[0] || null);
        }

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();

          setCourses(coursesData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentAcademicYear = () => {
    const now = new Date();
    const startDate = new Date(2025, 7, 1); // August 1st, 2025 (month is 0-indexed)

    // If we haven't started yet, return 0
    if (now < startDate) {
      return 0;
    }

    const currentYear = now.getFullYear();
    const month = now.getMonth();

    let academicYear = currentYear - 2025;

    // If we're before August, we're still in the previous academic year
    if (month < 7) {
      // July is month 6
      academicYear -= 1;
    }

    return Math.max(0, academicYear);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "upcoming":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "upcoming":
        return "Upcoming";
      default:
        return status;
    }
  };

  const groupCoursesByYear = (courses: Course[]) => {
    const grouped: { [key: number]: Course[] } = {};

    courses.forEach((course) => {
      if (!grouped[course.year]) {
        grouped[course.year] = [];
      }
      grouped[course.year].push(course);
    });

    return grouped;
  };

  const openCourseModal = (course: Course) => {
    setSelectedCourse(course);
    onOpen();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-default-50/50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-2xl font-bold">
            Loading degree information...
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-default-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">
            Academic Program Not Found
          </div>
          <Link href="/#education-skills">
            <Button color="primary">Back to Education & Skills</Button>
          </Link>
        </div>
      </div>
    );
  }

  const coursesByYear = groupCoursesByYear(courses);
  const currentYear = getCurrentAcademicYear();
  const progressPercentage = (currentYear / program.totalYears) * 100;

  return (
    <div className="min-h-screen bg-default-50/50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-default-200">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Link
                className="text-default-600 hover:text-primary transition-colors"
                href="/#education-skills"
              >
                Education & Skills
              </Link>
              <ChevronRightIcon className="w-4 h-4 text-default-400" />
              <span className="text-primary font-medium">Academic Program</span>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-4 rounded-xl bg-primary/10 text-primary">
                <AcademicCapIcon className="w-12 h-12" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-4xl md:text-5xl font-bold">
                    {program.degree}
                  </h1>
                  <Chip color="primary" size="lg" variant="flat">
                    Year {currentYear}
                  </Chip>
                </div>

                <p className="text-xl text-default-600 mb-2">
                  <strong>{program.institution}</strong>
                </p>

                {program.accreditation && (
                  <p className="text-default-500 mb-4">
                    {program.accreditation}
                  </p>
                )}

                {program.description && (
                  <p className="text-default-700 mb-6">{program.description}</p>
                )}

                <div className="grid md:grid-cols-1 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="w-5 h-5 text-default-500" />
                    <div>
                      <p className="text-sm text-default-500">
                        Expected Graduation
                      </p>
                      <p className="font-medium">
                        {new Date(program.expectedEnd).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Academic Progress</span>
                    <span className="text-sm text-default-500">
                      {currentYear}/{program.totalYears} years
                    </span>
                  </div>
                  <Progress
                    className="h-3"
                    color="primary"
                    value={progressPercentage}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <Tabs
          className="mb-8"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
        >
          <Tab key="overview" title="Overview">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Program Stats */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">Program Statistics</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-default-600">Total Courses</span>
                    <span className="font-bold">{courses.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-default-600">Completed</span>
                    <span className="font-bold text-success">
                      {courses.filter((c) => c.status === "COMPLETED").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-default-600">In Progress</span>
                    <span className="font-bold text-primary">
                      {courses.filter((c) => c.status === "IN_PROGRESS").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-default-600">Upcoming</span>
                    <span className="font-bold text-warning">
                      {courses.filter((c) => c.status === "UPCOMING").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-default-600">Total Credits</span>
                    <span className="font-bold">
                      {courses.reduce((sum, c) => sum + c.credits, 0)}
                    </span>
                  </div>
                </CardBody>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-default-50"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <BookOpenIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-default-600">
                            {course.code} • {course.credits} credits
                          </p>
                        </div>
                        <Chip
                          color={getStatusColor(course.status)}
                          size="sm"
                          variant="flat"
                        >
                          {getStatusText(course.status)}
                        </Chip>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="courses" title="Courses">
            <div className="space-y-8">
              {Object.keys(coursesByYear)
                .sort()
                .map((year) => (
                  <motion.div
                    key={year}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold">Year {year}</h2>
                      <Chip color="default" variant="flat">
                        {coursesByYear[parseInt(year)].length} courses
                      </Chip>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {coursesByYear[parseInt(year)].map((course) => (
                        <Card
                          key={course.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onPress={() => openCourseModal(course)}
                        >
                          <CardBody className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                  <BookOpenIcon className="w-5 h-5" />
                                </div>
                                {course.featured && (
                                  <StarIcon className="w-5 h-5 text-warning" />
                                )}
                              </div>
                              <Chip
                                color={getStatusColor(course.status)}
                                size="sm"
                                variant="flat"
                              >
                                {getStatusText(course.status)}
                              </Chip>
                            </div>

                            <h3 className="text-lg font-semibold mb-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-default-600 mb-3">
                              {course.code}
                            </p>

                            {course.description && (
                              <p className="text-sm text-default-700 mb-4 line-clamp-3">
                                {course.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-default-600">
                                  {course.credits} credits
                                </span>
                                <span className="text-sm text-default-600">
                                  {course.semester}
                                </span>
                              </div>
                              {course.blogPosts &&
                                course.blogPosts.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                      {course.blogPosts.length}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                ))}
            </div>
          </Tab>

          <Tab key="academic-skills" title="Academic Skills">
            <div className="space-y-8">
              <AcademicSkillsDisplay
                maxSkillsPerCategory={15}
                showCourseBreakdown={true}
                showProgressionTargets={true}
              />
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Course Detail Modal */}
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="5xl"
        onClose={onClose}
      >
        <ModalContent>
          {selectedCourse && (
            <>
              <ModalHeader className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpenIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCourse.title}</h3>
                  <p className="text-default-600">
                    {selectedCourse.code} • {selectedCourse.credits} credits
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="space-y-6">
                  {selectedCourse.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-default-700">
                        {selectedCourse.description}
                      </p>
                    </div>
                  )}

                  {selectedCourse.objectives &&
                    selectedCourse.objectives.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">
                          Learning Objectives
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedCourse.objectives.map((objective, index) => (
                            <li key={index} className="text-default-700">
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {selectedCourse.topics &&
                    selectedCourse.topics.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Topics Covered</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCourse.topics.map((topic, index) => (
                            <Chip
                              key={index}
                              color="primary"
                              size="sm"
                              variant="flat"
                            >
                              {topic}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedCourse.instructor && (
                    <div>
                      <h4 className="font-semibold mb-2">Instructor</h4>
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-default-500" />
                        <div>
                          <p className="font-medium">
                            {selectedCourse.instructor}
                          </p>
                          {selectedCourse.officeHours && (
                            <p className="text-sm text-default-600">
                              Office Hours: {selectedCourse.officeHours}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedCourse.assessments &&
                    selectedCourse.assessments.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Assessments</h4>
                        <div className="space-y-2">
                          {selectedCourse.assessments.map((assessment) => (
                            <div
                              key={assessment.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-default-50"
                            >
                              <div>
                                <p className="font-medium">
                                  {assessment.title}
                                </p>
                                <p className="text-sm text-default-600">
                                  {assessment.type} • {assessment.weight}%
                                </p>
                              </div>
                              <Chip
                                color={
                                  assessment.completed ? "success" : "warning"
                                }
                                size="sm"
                                variant="flat"
                              >
                                {assessment.completed ? "Completed" : "Pending"}
                              </Chip>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedCourse.blogPosts &&
                    selectedCourse.blogPosts.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">
                          Related Blog Posts
                        </h4>
                        <div className="space-y-2">
                          {selectedCourse.blogPosts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-default-50 hover:bg-default-100 transition-colors">
                                <DocumentTextIcon className="w-5 h-5 text-primary" />
                                <div className="flex-1">
                                  <p className="font-medium">{post.title}</p>
                                  {post.excerpt && (
                                    <p className="text-sm text-default-600 line-clamp-2">
                                      {post.excerpt}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DegreePage;
