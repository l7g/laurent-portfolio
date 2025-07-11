"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import {
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface CourseProgressData {
  summary: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    upcomingCourses: number;
    totalCredits: number;
    completedCredits: number;
    gpa: number;
    completionRate: number;
  };
  courses: Array<{
    id: string;
    code: string;
    title: string;
    year: number;
    semester: string;
    status: string;
    grade?: string;
    credits: number;
    skillsDelivered: string[];
  }>;
  coursesByYear: { [key: number]: any[] };
}

export default function CourseProgressTracker() {
  const [progressData, setProgressData] = useState<CourseProgressData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await fetch("/api/course-progress");

      if (response.ok) {
        const data = await response.json();

        setProgressData(data);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCourseProgress = async (
    courseId: string,
    status: string,
    grade?: string,
  ) => {
    setUpdating(courseId);
    try {
      const response = await fetch("/api/course-progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, status, grade }),
      });

      if (response.ok) {
        await fetchProgressData(); // Refresh data
        alert("Course updated successfully!");
      } else {
        alert("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "primary";
      case "UPCOMING":
        return "warning";
      case "DEFERRED":
        return "secondary";
      case "WITHDRAWN":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "IN_PROGRESS":
        return <ClockIcon className="w-5 h-5" />;
      case "UPCOMING":
        return <AcademicCapIcon className="w-5 h-5" />;
      default:
        return <AcademicCapIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Loading progress data...</div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No progress data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AcademicCapIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-bold">
              {progressData.summary.totalCourses}
            </p>
            <p className="text-sm text-gray-600">Total Courses</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircleIcon className="w-8 h-8 text-success" />
            </div>
            <p className="text-2xl font-bold">
              {progressData.summary.completedCourses}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrophyIcon className="w-8 h-8 text-warning" />
            </div>
            <p className="text-2xl font-bold">{progressData.summary.gpa}</p>
            <p className="text-sm text-gray-600">GPA</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ChartBarIcon className="w-8 h-8 text-secondary" />
            </div>
            <p className="text-2xl font-bold">
              {progressData.summary.completionRate}%
            </p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </CardBody>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Overall Progress</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Course Completion</span>
                <span className="text-sm text-gray-600">
                  {progressData.summary.completedCourses}/
                  {progressData.summary.totalCourses} courses
                </span>
              </div>
              <Progress
                className="h-2"
                color="success"
                value={progressData.summary.completionRate}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Credit Hours</span>
                <span className="text-sm text-gray-600">
                  {progressData.summary.completedCredits}/
                  {progressData.summary.totalCredits} credits
                </span>
              </div>
              <Progress
                className="h-2"
                color="primary"
                value={
                  (progressData.summary.completedCredits /
                    progressData.summary.totalCredits) *
                  100
                }
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Course List by Year */}
      <div className="space-y-6">
        {Object.keys(progressData.coursesByYear)
          .sort()
          .map((year) => (
            <Card key={year}>
              <CardHeader>
                <h3 className="text-lg font-semibold">Year {year}</h3>
                <Chip color="default" size="sm" variant="flat">
                  {progressData.coursesByYear[parseInt(year)].length} courses
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {progressData.coursesByYear[parseInt(year)].map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(course.status)}
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-gray-600">
                              {course.code} • {course.credits} credits •{" "}
                              {course.semester}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <select
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={updating === course.id}
                            value={course.status}
                            onChange={(e) =>
                              updateCourseProgress(course.id, e.target.value)
                            }
                          >
                            <option value="UPCOMING">Upcoming</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="DEFERRED">Deferred</option>
                            <option value="WITHDRAWN">Withdrawn</option>
                          </select>

                          {course.status === "COMPLETED" && (
                            <input
                              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-20"
                              disabled={updating === course.id}
                              placeholder="Grade"
                              type="text"
                              value={course.grade || ""}
                              onChange={(e) =>
                                updateCourseProgress(
                                  course.id,
                                  course.status,
                                  e.target.value,
                                )
                              }
                            />
                          )}
                        </div>

                        <Chip
                          color={getStatusColor(course.status)}
                          size="sm"
                          variant="flat"
                        >
                          {course.status.replace("_", " ")}
                        </Chip>

                        {course.grade && (
                          <Chip color="warning" size="sm" variant="flat">
                            {course.grade}
                          </Chip>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
      </div>
    </div>
  );
}
