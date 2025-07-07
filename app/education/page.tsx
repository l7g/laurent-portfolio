"use client";

import { useState, useEffect } from "react";
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
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-default-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-default-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <AcademicCapIcon className="w-6 h-6 text-primary" />
              Current Studies
            </h2>
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between w-full">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {currentProgram.degree}
                    </h3>
                    <p className="text-lg text-primary font-medium">
                      {currentProgram.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-default-500" />
                      <span className="text-default-600">
                        {currentProgram.institution}
                      </span>
                    </div>
                  </div>
                  <Chip
                    size="sm"
                    color="success"
                    variant="flat"
                    startContent={<BookmarkIcon className="w-3 h-3" />}
                  >
                    Year {currentProgram.currentYear} of{" "}
                    {currentProgram.totalYears}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
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
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-default-600">
                          {Math.round(
                            (currentProgram.currentYear /
                              currentProgram.totalYears) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (currentProgram.currentYear /
                            currentProgram.totalYears) *
                          100
                        }
                        color="primary"
                        className="max-w-md"
                      />
                    </div>
                    <Button
                      as={Link}
                      href="/degree"
                      color="primary"
                      variant="flat"
                      endContent={<ChevronRightIcon className="w-4 h-4" />}
                    >
                      View Detailed Progress
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Courses */}
          {currentCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-success" />
                Current Courses
              </h2>
              <div className="space-y-3">
                {currentCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-default-600">
                            {course.code}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-default-500">
                            <span>{course.credits} credits</span>
                            <span>
                              {course.semester} {course.year}
                            </span>
                          </div>
                        </div>
                        <Chip
                          size="sm"
                          color={getStatusColor(course.status)}
                          variant="flat"
                        >
                          {course.status}
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed Programs */}
          {completedPrograms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-warning" />
                Completed Programs
              </h2>
              <div className="space-y-4">
                {completedPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{program.degree}</h3>
                          <p className="text-primary font-medium">
                            {program.name}
                          </p>
                          <p className="text-sm text-default-600 mt-1">
                            {program.institution}
                          </p>
                          <div className="text-xs text-default-500 mt-2">
                            {formatDate(program.startDate)} -{" "}
                            {formatDate(program.expectedEnd)}
                          </div>
                        </div>
                        <Chip
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={<StarIcon className="w-3 h-3" />}
                        >
                          Completed
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Academic Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold mb-6">Academic Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {programs.length}
                </div>
                <div className="text-sm text-default-600">Total Programs</div>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10">
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedCourses.length}
                </div>
                <div className="text-sm text-default-600">
                  Courses Completed
                </div>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10">
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {currentCourses.length}
                </div>
                <div className="text-sm text-default-600">Current Courses</div>
              </CardBody>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10">
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {courses.reduce((total, course) => total + course.credits, 0)}
                </div>
                <div className="text-sm text-default-600">Total Credits</div>
              </CardBody>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardBody className="p-8">
              <h3 className="text-xl font-semibold mb-2">
                Want to know more about my academic journey?
              </h3>
              <p className="text-default-600 mb-4">
                Explore my detailed degree progress, course assessments, and
                academic skills.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  as={Link}
                  href="/degree"
                  color="primary"
                  endContent={<ChevronRightIcon className="w-4 h-4" />}
                >
                  View Degree Details
                </Button>
                <Button
                  as={Link}
                  href="/skills"
                  variant="bordered"
                  endContent={<ChevronRightIcon className="w-4 h-4" />}
                >
                  Technical Skills
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
