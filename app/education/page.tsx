"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  BookOpenIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  UserIcon,
  TrophyIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon, StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { title } from "@/components/primitives";
import { useEducationVisibility } from "@/lib/use-education-visibility";

interface AcademicProgram {
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
  credits: number;
  semester: string;
  year: number;
  status: string;
  grade?: string;
  description?: string;
}

export default function EducationPage() {
  const router = useRouter();
  const { isEducationVisible, isLoading: visibilityLoading } =
    useEducationVisibility();
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if education is not visible
  useEffect(() => {
    if (!visibilityLoading && !isEducationVisible) {
      router.push("/");
    }
  }, [isEducationVisible, visibilityLoading, router]);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const [programsResponse, coursesResponse] = await Promise.all([
          fetch("/api/academic/programs"),
          fetch("/api/academic/courses"),
        ]);

        if (programsResponse.ok) {
          const programsData = await programsResponse.json();

          setPrograms(programsData);
        }

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();

          setCourses(coursesData);
        }
      } catch (error) {
        console.error("Failed to fetch education data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

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

  const getActualProgress = (program: AcademicProgram) => {
    const actualYear = getCurrentAcademicYear();

    return Math.min((actualYear / program.totalYears) * 100, 100);
  };

  const getDaysUntilStart = () => {
    const now = new Date();
    const startDate = new Date(2025, 7, 1); // August 1st, 2025
    const timeDiff = startDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff > 0 ? daysDiff : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "current":
        return "success";
      case "completed":
        return "primary";
      case "planned":
        return "warning";
      default:
        return "default";
    }
  };

  const currentProgram = programs.find(
    (p) => p.status.toLowerCase() === "active",
  );
  const completedPrograms = programs.filter(
    (p) => p.status.toLowerCase() === "completed",
  );
  const plannedPrograms = programs.filter(
    (p) => p.status.toLowerCase() === "planned",
  );

  const currentCourses = courses.filter(
    (c) => c.status.toLowerCase() === "current",
  );
  const completedCourses = courses.filter(
    (c) => c.status.toLowerCase() === "completed",
  );

  if (loading || visibilityLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-default-300 rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-default-300 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if education is not visible
  if (!isEducationVisible) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={title({ size: "lg", className: "mb-4" })}>
            Educational Journey
          </h1>
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            A comprehensive overview of my academic pursuits, from completed
            programs to current studies and future educational goals.
          </p>
        </motion.div>

        {/* Current Program */}
        {currentProgram && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <AcademicCapIcon className="w-6 h-6 text-primary" />
              Current Studies
            </h2>
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {currentProgram.degree}
                    </h3>
                    <p className="text-lg text-primary font-medium mb-2">
                      {currentProgram.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-default-500" />
                      <span className="text-default-600">
                        {currentProgram.institution}
                      </span>
                    </div>
                    {currentProgram.accreditation && (
                      <div className="flex items-center gap-2 mt-1">
                        <TrophyIcon className="w-4 h-4 text-default-500" />
                        <span className="text-sm text-default-600">
                          {currentProgram.accreditation}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Chip
                      className="font-medium"
                      color={
                        getCurrentAcademicYear() === 0 ? "warning" : "success"
                      }
                      size="sm"
                      startContent={<BookmarkIcon className="w-3 h-3" />}
                      variant="flat"
                    >
                      {getCurrentAcademicYear() === 0
                        ? "Starting Soon"
                        : `Year ${getCurrentAcademicYear()} of ${currentProgram.totalYears}`}
                    </Chip>
                    <div className="text-xs text-default-500">
                      {getCurrentAcademicYear() === 0
                        ? "Upcoming"
                        : currentProgram.status}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-default-700 mb-4">
                      {currentProgram.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-default-500" />
                        <span>
                          Started: {formatDate(currentProgram.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ClockIcon className="w-4 h-4 text-default-500" />
                        <span>
                          Expected completion:{" "}
                          {formatDate(currentProgram.expectedEnd)}
                        </span>
                      </div>
                      {currentProgram.mode && (
                        <div className="flex items-center gap-2 text-sm">
                          <GlobeAltIcon className="w-4 h-4 text-default-500" />
                          <span>Mode: {currentProgram.mode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold">
                          Academic Progress
                        </span>
                        <span className="text-sm text-default-600 font-medium">
                          {Math.round(getActualProgress(currentProgram))}%
                        </span>
                      </div>
                      <Progress
                        className="max-w-md"
                        color="primary"
                        showValueLabel={false}
                        size="lg"
                        value={getActualProgress(currentProgram)}
                      />
                      <div className="flex justify-between text-xs text-default-500 mt-1">
                        <span>Started</span>
                        <span>Expected Completion</span>
                      </div>
                      {getActualProgress(currentProgram) === 0 && (
                        <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                          <div className="flex items-center gap-2 text-warning-700">
                            <ClockIcon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">
                                Course begins August 2025
                              </div>
                              <div className="text-xs">
                                {getDaysUntilStart() > 0
                                  ? `${getDaysUntilStart()} days to go`
                                  : "Starting soon!"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-default-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-semibold mb-3">
                        Quick Stats
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-default-600">Duration</span>
                          <span className="font-medium">
                            {currentProgram.totalYears} years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-600">
                            Current Courses
                          </span>
                          <span className="font-medium">
                            {currentCourses.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-600">
                            Total Credits
                          </span>
                          <span className="font-medium">
                            {courses.reduce(
                              (total, course) => total + course.credits,
                              0,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        as={Link}
                        className="font-medium"
                        color="primary"
                        endContent={<ChevronRightIcon className="w-4 h-4" />}
                        href="/degree"
                        variant="flat"
                      >
                        View Detailed Progress
                      </Button>
                      <Button
                        as={Link}
                        className="font-medium"
                        endContent={<ChevronRightIcon className="w-4 h-4" />}
                        href="/skills"
                        variant="bordered"
                      >
                        Academic Skills
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Courses or Upcoming Courses */}
          {currentCourses.length > 0 ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-success" />
                Current Courses
              </h2>
              <div className="space-y-4">
                {currentCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-default-200 hover:border-primary/30">
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-primary font-medium mb-1">
                              {course.code}
                            </p>
                            {course.description && (
                              <p className="text-sm text-default-600 mb-3 line-clamp-2">
                                {course.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-default-500">
                              <div className="flex items-center gap-1">
                                <TrophyIcon className="w-3 h-3" />
                                <span>{course.credits} credits</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>
                                  {course.semester} {course.year}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Chip
                              className="font-medium"
                              color={getStatusColor(course.status)}
                              size="sm"
                              variant="flat"
                            >
                              {course.status}
                            </Chip>
                            {course.grade && (
                              <div className="text-xs text-default-500">
                                Grade: {course.grade}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-warning" />
                Upcoming Academic Journey
              </h2>
              <Card className="border border-warning-200 bg-warning-50/50">
                <CardBody className="p-6">
                  <div className="text-center">
                    <AcademicCapIcon className="w-16 h-16 text-warning-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Ready to Begin
                    </h3>
                    <p className="text-default-600 mb-4">
                      My academic journey in International Relations begins in
                      August 2025. I'm preparing for an exciting exploration of
                      global politics, economics, and diplomatic relations.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4 text-warning-600" />
                        <span>Global Politics Focus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4 text-warning-600" />
                        <span>Research Methods</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-warning-600" />
                        <span>Diplomatic Studies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrophyIcon className="w-4 h-4 text-warning-600" />
                        <span>Honours Program</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Completed Programs */}
          {completedPrograms.length > 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-warning" />
                Completed Programs
              </h2>
              <div className="space-y-4">
                {completedPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-default-200 hover:border-primary/30">
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {program.degree}
                            </h3>
                            <p className="text-primary font-medium mb-1">
                              {program.name}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <BuildingOfficeIcon className="w-4 h-4 text-default-500" />
                              <span className="text-sm text-default-600">
                                {program.institution}
                              </span>
                            </div>
                            {program.description && (
                              <p className="text-sm text-default-600 mb-3 line-clamp-2">
                                {program.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-default-500">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>
                                  {formatDate(program.startDate)} -{" "}
                                  {formatDate(program.expectedEnd)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Chip
                              className="font-medium"
                              color="primary"
                              size="sm"
                              startContent={<StarIcon className="w-3 h-3" />}
                              variant="flat"
                            >
                              Completed
                            </Chip>
                            {program.accreditation && (
                              <div className="text-xs text-default-500">
                                {program.accreditation}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Planned Programs */}
          {plannedPrograms.length > 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-warning" />
                Future Studies
              </h2>
              <div className="space-y-4">
                {plannedPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-default-200 hover:border-warning/30">
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {program.degree}
                            </h3>
                            <p className="text-primary font-medium mb-1">
                              {program.name}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <BuildingOfficeIcon className="w-4 h-4 text-default-500" />
                              <span className="text-sm text-default-600">
                                {program.institution}
                              </span>
                            </div>
                            {program.description && (
                              <p className="text-sm text-default-600 mb-3 line-clamp-2">
                                {program.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-default-500">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>
                                  Expected: {formatDate(program.startDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Chip
                              className="font-medium"
                              color="warning"
                              size="sm"
                              startContent={<ClockIcon className="w-3 h-3" />}
                              variant="flat"
                            >
                              Planned
                            </Chip>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Academic Statistics */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6">Academic Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {programs.length}
                  </div>
                  <div className="text-sm text-default-600 font-medium">
                    Total Programs
                  </div>
                </CardBody>
              </Card>
            </motion.div>
            <motion.div
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {completedCourses.length}
                  </div>
                  <div className="text-sm text-default-600 font-medium">
                    Courses Completed
                  </div>
                </CardBody>
              </Card>
            </motion.div>
            <motion.div
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {currentCourses.length}
                  </div>
                  <div className="text-sm text-default-600 font-medium">
                    Current Courses
                  </div>
                </CardBody>
              </Card>
            </motion.div>
            <motion.div
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {courses.reduce(
                      (total, course) => total + course.credits,
                      0,
                    )}
                  </div>
                  <div className="text-sm text-default-600 font-medium">
                    Total Credits
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300">
            <CardBody className="p-10">
              <div className="mb-4">
                <AcademicCapIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3">
                  Want to know more about my academic journey?
                </h3>
                <p className="text-default-600 text-lg mb-6 max-w-2xl mx-auto">
                  Explore my detailed degree progress, course assessments, and
                  academic skills development throughout my educational journey.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    as={Link}
                    className="font-semibold px-8"
                    color="primary"
                    endContent={<ChevronRightIcon className="w-5 h-5" />}
                    href="/degree"
                    size="lg"
                  >
                    View Degree Details
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    as={Link}
                    className="font-semibold px-8"
                    endContent={<ChevronRightIcon className="w-5 h-5" />}
                    href="/skills"
                    size="lg"
                    variant="bordered"
                  >
                    Technical Skills
                  </Button>
                </motion.div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
