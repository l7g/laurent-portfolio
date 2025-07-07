"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  CalculatorIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface SkillProgression {
  id: string;
  name: string;
  category: string;
  level: number;
  currentLevel: number;
  targetLevel: number;
  year1Target?: number;
  year2Target?: number;
  year3Target?: number;
  year4Target?: number;
  icon?: string;
  color?: string;
  frequency: number;
  courses: any[];
  progression?: any;
}

interface Course {
  id: string;
  title: string;
  code: string;
  year: number;
  semester: string;
  status: string;
  grade?: string;
  credits: number;
}

interface AcademicSkillsDisplayProps {
  showProgressionTargets?: boolean;
  showCourseBreakdown?: boolean;
  maxSkillsPerCategory?: number;
}

const AcademicSkillsDisplay = ({
  showProgressionTargets = true,
  showCourseBreakdown = true,
  maxSkillsPerCategory = 10,
}: AcademicSkillsDisplayProps) => {
  const [skills, setSkills] = useState<SkillProgression[]>([]);
  const [skillsByCategory, setSkillsByCategory] = useState<
    Record<string, SkillProgression[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    try {
      const response = await fetch("/api/course-skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills);

        // Filter academic skills and group by category
        const academicSkills = data.skills.filter(
          (skill: SkillProgression) =>
            skill.category === "Academic Skills" ||
            skill.category === "International Relations" ||
            skill.category === "Language & Communication" ||
            skill.category === "Analytical Skills",
        );

        const categorized = academicSkills.reduce(
          (
            acc: Record<string, SkillProgression[]>,
            skill: SkillProgression,
          ) => {
            if (!acc[skill.category]) {
              acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
          },
          {},
        );

        // Sort skills within each category by frequency then level
        Object.keys(categorized).forEach((category) => {
          categorized[category] = categorized[category]
            .sort((a: SkillProgression, b: SkillProgression) => {
              if (a.frequency !== b.frequency) {
                return b.frequency - a.frequency;
              }
              return b.level - a.level;
            })
            .slice(0, maxSkillsPerCategory);
        });

        setSkillsByCategory(categorized);
      }
    } catch (error) {
      console.error("Failed to fetch skills data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAcademicYear = () => {
    const now = new Date();
    const startDate = new Date(2025, 7, 1); // August 1st, 2025

    if (now < startDate) return 0;

    const currentYear = now.getFullYear();
    const month = now.getMonth();

    let academicYear = currentYear - 2025;
    if (month < 7) academicYear -= 1;

    return Math.max(0, academicYear) + 1;
  };

  const getYearTargets = (skill: SkillProgression) => {
    const targets = [];
    if (skill.year1Target) targets.push({ year: 1, target: skill.year1Target });
    if (skill.year2Target) targets.push({ year: 2, target: skill.year2Target });
    if (skill.year3Target) targets.push({ year: 3, target: skill.year3Target });
    if (skill.year4Target) targets.push({ year: 4, target: skill.year4Target });
    return targets;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      "Academic Skills": <AcademicCapIcon className="w-6 h-6" />,
      "International Relations": <GlobeAltIcon className="w-6 h-6" />,
      "Language & Communication": (
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      ),
      "Analytical Skills": <CalculatorIcon className="w-6 h-6" />,
    };
    return (
      icons[category as keyof typeof icons] || (
        <BookOpenIcon className="w-6 h-6" />
      )
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Academic Skills": "success",
      "International Relations": "primary",
      "Language & Communication": "secondary",
      "Analytical Skills": "warning",
    };
    return colors[category as keyof typeof colors] || "default";
  };

  const filteredCategories =
    selectedCategory === "all"
      ? Object.keys(skillsByCategory)
      : [selectedCategory];

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-default-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-default-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Academic Skills Development</h2>
        <p className="text-default-600 max-w-2xl mx-auto">
          Comprehensive view of all academic skills being developed through
          coursework and independent study
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          variant={selectedCategory === "all" ? "solid" : "bordered"}
          color={selectedCategory === "all" ? "primary" : "default"}
          size="sm"
          onPress={() => setSelectedCategory("all")}
          startContent={<UserGroupIcon className="w-4 h-4" />}
        >
          All Skills
        </Button>
        {Object.keys(skillsByCategory).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "solid" : "bordered"}
            color={
              selectedCategory === category
                ? (getCategoryColor(category) as any)
                : "default"
            }
            size="sm"
            onPress={() => setSelectedCategory(category)}
            startContent={getCategoryIcon(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCategories.map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-${getCategoryColor(category)}/10 text-${getCategoryColor(category)}`}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{category}</h3>
                    <p className="text-sm text-default-500">
                      {skillsByCategory[category]?.length || 0} skills
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {skillsByCategory[category]?.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-default-200 hover:border-default-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{skill.icon || "📚"}</span>
                          <h4 className="font-semibold text-sm">
                            {skill.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-default-500">
                          <span>
                            Present in {skill.frequency} course
                            {skill.frequency > 1 ? "s" : ""}
                          </span>
                          <span>•</span>
                          <span>Year {getCurrentAcademicYear()}</span>
                        </div>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={getCategoryColor(category) as any}
                      >
                        {skill.level}%
                      </Chip>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <Progress
                        value={skill.level}
                        color={getCategoryColor(category) as any}
                        size="sm"
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-default-500">
                        <span>Current Level</span>
                        <span>Target: {skill.targetLevel || 90}%</span>
                      </div>
                    </div>

                    {/* Progression Targets */}
                    {showProgressionTargets &&
                      getYearTargets(skill).length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-default-500 mb-2 flex items-center gap-1">
                            <ArrowTrendingUpIcon className="w-3 h-3" />
                            Progression Targets
                          </p>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            {getYearTargets(skill).map((target) => (
                              <div
                                key={target.year}
                                className="flex justify-between p-1 rounded bg-default-50"
                              >
                                <span className="text-default-600">
                                  Year {target.year}
                                </span>
                                <span className="font-medium">
                                  {target.target}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Course Breakdown */}
                    {showCourseBreakdown && skill.courses.length > 0 && (
                      <div>
                        <p className="text-xs text-default-500 mb-2 flex items-center gap-1">
                          <BookOpenIcon className="w-3 h-3" />
                          Courses ({skill.courses.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {skill.courses.slice(0, 3).map((course: Course) => (
                            <Chip
                              key={course.id}
                              size="sm"
                              variant="flat"
                              color={
                                course.status === "COMPLETED"
                                  ? "success"
                                  : course.status === "IN_PROGRESS"
                                    ? "warning"
                                    : "default"
                              }
                            >
                              {course.code}
                            </Chip>
                          ))}
                          {skill.courses.length > 3 && (
                            <Chip size="sm" variant="flat" color="default">
                              +{skill.courses.length - 3} more
                            </Chip>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {(!skillsByCategory[category] ||
                  skillsByCategory[category].length === 0) && (
                  <div className="text-center py-8 text-default-500">
                    <AcademicCapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No skills found in this category</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardBody className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChartBarIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {Object.values(skillsByCategory).flat().length}
            </h3>
            <p className="text-default-600">Total Academic Skills</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrophyIcon className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {
                Object.values(skillsByCategory)
                  .flat()
                  .filter((s) => s.level >= 70).length
              }
            </h3>
            <p className="text-default-600">Advanced Skills (70%+)</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {
                Object.values(skillsByCategory)
                  .flat()
                  .filter((s) => s.level < 70).length
              }
            </h3>
            <p className="text-default-600">Developing Skills</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AcademicSkillsDisplay;
