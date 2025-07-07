"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import {
  CalendarDaysIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface skill_progressions {
  id: string;
  skillId: string;
  currentLevel: number;
  targetLevel: number;
  year1Target?: number;
  year2Target?: number;
  year3Target?: number;
  year4Target?: number;
  isAcademicSkill: boolean;
  isTechnicalSkill: boolean;
  lastUpdated: string;
  skill: {
    id: string;
    name: string;
    category: string;
    icon?: string;
    color?: string;
  };
  program?: {
    id: string;
    name: string;
    currentYear: number;
    startDate: string;
    expectedEnd: string;
  };
}

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

export default function DynamicSkillsSection() {
  const [skills, setSkills] = useState<skill_progressions[]>([]);
  const [programs, setPrograms] = useState<academic_programs[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [skillsRes, programsRes] = await Promise.all([
        fetch("/api/academic/skills"),
        fetch("/api/academic/programs"),
      ]);

      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        setSkills(
          skillsData.flatMap((skill: any) =>
            skill.progressions.map((prog: any) => ({
              ...prog,
              skill: skill,
            })),
          ),
        );
      }

      if (programsRes.ok) {
        const programsData = await programsRes.json();
        setPrograms(programsData);
      }
    } catch (error) {
      console.error("Failed to fetch skills data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateExpectedLevel = (progression: skill_progressions) => {
    if (!progression.program) return progression.currentLevel;

    const now = new Date();
    const startDate = new Date(progression.program.startDate);
    const monthsElapsed = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    const yearProgress = monthsElapsed / 12;

    // Calculate expected level based on progression targets
    if (yearProgress <= 1 && progression.year1Target) {
      return Math.min(
        progression.year1Target,
        progression.currentLevel + yearProgress * 10,
      );
    } else if (yearProgress <= 2 && progression.year2Target) {
      return Math.min(
        progression.year2Target,
        progression.currentLevel + yearProgress * 8,
      );
    } else if (yearProgress <= 3 && progression.year3Target) {
      return Math.min(
        progression.year3Target,
        progression.currentLevel + yearProgress * 6,
      );
    } else if (progression.year4Target) {
      return Math.min(
        progression.year4Target,
        progression.currentLevel + yearProgress * 5,
      );
    }

    return progression.currentLevel;
  };

  const getYearTargets = (progression: skill_progressions) => {
    return [
      { year: 1, target: progression.year1Target || 0, label: "Year 1" },
      { year: 2, target: progression.year2Target || 0, label: "Year 2" },
      { year: 3, target: progression.year3Target || 0, label: "Year 3" },
      { year: 4, target: progression.year4Target || 0, label: "Year 4" },
    ].filter((item) => item.target > 0);
  };

  const getCurrentYearProgress = (program: academic_programs) => {
    const now = new Date();
    const startDate = new Date(program.startDate);
    const monthsElapsed = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    return Math.min(monthsElapsed / 12, program.totalYears);
  };

  const filteredSkills = skills.filter((skill) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "academic") return skill.isAcademicSkill;
    if (selectedCategory === "technical") return skill.isTechnicalSkill;
    return true;
  });

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-default-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-default-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-64">
                <CardBody className="animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 bg-default-300 rounded w-3/4"></div>
                    <div className="h-3 bg-default-300 rounded w-1/2"></div>
                    <div className="h-2 bg-default-300 rounded w-full"></div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-background to-background/80">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Skills Development Journey
          </h2>
          <p className="text-default-600 max-w-2xl mx-auto">
            Tracking my skill progression through academic study and
            professional development
          </p>
        </motion.div>

        {/* Academic Program Info */}
        {programs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <AcademicCapIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {programs[0].degree}
                    </h3>
                    <p className="text-default-600 mb-1">
                      {programs[0].institution}
                    </p>
                    {programs[0].accreditation && (
                      <p className="text-sm text-default-500 mb-3">
                        {programs[0].accreditation}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>
                          Expected graduation:{" "}
                          {new Date(programs[0].expectedEnd).getFullYear()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>
                          Year {Math.ceil(getCurrentYearProgress(programs[0]))}{" "}
                          of {programs[0].totalYears}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { key: "all", label: "All Skills", icon: "🎯" },
            { key: "academic", label: "Academic Skills", icon: "📚" },
            { key: "technical", label: "Technical Skills", icon: "💻" },
          ].map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "solid" : "bordered"}
              color={selectedCategory === category.key ? "primary" : "default"}
              size="sm"
              onPress={() => setSelectedCategory(category.key)}
              startContent={<span>{category.icon}</span>}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((progression, index) => {
            const expectedLevel = calculateExpectedLevel(progression);
            const yearTargets = getYearTargets(progression);

            return (
              <motion.div
                key={progression.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {progression.skill.icon ||
                            (progression.isAcademicSkill ? "📚" : "💻")}
                        </span>
                        <h3 className="font-semibold text-sm leading-tight">
                          {progression.skill.name}
                        </h3>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          progression.isAcademicSkill ? "success" : "primary"
                        }
                        startContent={
                          progression.isAcademicSkill ? (
                            <AcademicCapIcon className="w-3 h-3" />
                          ) : (
                            <CodeBracketIcon className="w-3 h-3" />
                          )
                        }
                      >
                        {progression.isAcademicSkill ? "Academic" : "Technical"}
                      </Chip>
                    </div>
                  </CardHeader>

                  <CardBody className="pt-0">
                    {/* Current Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-default-600">
                          Current Level
                        </span>
                        <span className="text-sm font-semibold">
                          {progression.currentLevel}%
                        </span>
                      </div>
                      <Progress
                        value={progression.currentLevel}
                        color="primary"
                        size="sm"
                        className="mb-2"
                      />

                      {expectedLevel > progression.currentLevel && (
                        <>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-default-500">
                              Expected Progress
                            </span>
                            <span className="text-xs font-medium text-success-600">
                              {Math.round(expectedLevel)}%
                            </span>
                          </div>
                          <Progress
                            value={expectedLevel}
                            color="success"
                            size="sm"
                            className="opacity-60"
                          />
                        </>
                      )}
                    </div>

                    {/* Year Targets */}
                    {yearTargets.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-default-500 mb-2 flex items-center gap-1">
                          <ArrowTrendingUpIcon className="w-3 h-3" />
                          Progression Targets
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {yearTargets.map((target) => (
                            <div
                              key={target.year}
                              className="flex justify-between p-1 rounded bg-default-50"
                            >
                              <span className="text-default-600">
                                {target.label}
                              </span>
                              <span className="font-medium">
                                {target.target}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Final Target */}
                    <div className="border-t border-default-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-default-600">
                          Final Target
                        </span>
                        <Chip size="sm" variant="flat" color="secondary">
                          {progression.targetLevel}%
                        </Chip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">
              No skill progressions found
            </h3>
            <p className="text-default-600">
              Skills progression data will be populated as the academic program
              progresses.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
