"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface RelevantSkill {
  id: string;
  name: string;
  category: string;
  level: number;
  currentLevel: number;
  targetLevel: number;
  icon?: string;
  color?: string;
  frequency: number;
  courses: any[];
}

interface CompactAcademicSkillsProps {
  maxSkills?: number;
  showViewAllLink?: boolean;
  title?: string;
  description?: string;
}

const CompactAcademicSkills = ({
  maxSkills = 6,
  showViewAllLink = true,
  title = "Most Relevant Academic Skills",
  description = "Key skills being developed through coursework, prioritized by frequency across courses",
}: CompactAcademicSkillsProps) => {
  const [skills, setSkills] = useState<RelevantSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelevantSkills();
  }, []);

  const fetchRelevantSkills = async () => {
    try {
      const response = await fetch("/api/academic/most-relevant-skills");

      if (response.ok) {
        const data = await response.json();

        setSkills(data.mostRelevantSkills.slice(0, maxSkills));
      }
    } catch (error) {
      console.error("Failed to fetch relevant skills:", error);
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

  const getSkillRelevanceColor = (frequency: number) => {
    if (frequency >= 4) return "success";
    if (frequency >= 3) return "primary";
    if (frequency >= 2) return "warning";

    return "default";
  };

  const getSkillRelevanceText = (frequency: number) => {
    if (frequency >= 4) return "Highly relevant";
    if (frequency >= 3) return "Very relevant";
    if (frequency >= 2) return "Relevant";

    return "Emerging";
  };

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-default-300 rounded w-1/2" />
          <div className="h-4 bg-default-300 rounded w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-default-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <AcademicCapIcon className="w-16 h-16 mx-auto mb-4 text-default-300" />
        <h3 className="text-lg font-semibold mb-2">No Academic Skills Found</h3>
        <p className="text-default-600">
          Skills will appear here as courses are added and progress is made.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-default-600">{description}</p>
        </div>
        {showViewAllLink && (
          <Link href="/degree?tab=academic-skills">
            <Button
              color="primary"
              endContent={<ArrowRightIcon className="w-4 h-4" />}
              size="sm"
              variant="light"
            >
              View All Skills
            </Button>
          </Link>
        )}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{skill.icon || "📚"}</span>
                    <h4 className="font-semibold text-sm leading-tight">
                      {skill.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      color={getSkillRelevanceColor(skill.frequency)}
                      size="sm"
                      startContent={<StarIcon className="w-3 h-3" />}
                      variant="flat"
                    >
                      {skill.frequency}
                    </Chip>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-0">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-default-500">
                      Current Level
                    </span>
                    <span className="text-xs font-semibold">
                      {skill.currentLevel || skill.level}%
                    </span>
                  </div>
                  <Progress
                    className="mb-1"
                    color={getSkillRelevanceColor(skill.frequency)}
                    size="sm"
                    value={skill.currentLevel || skill.level}
                  />
                  <div className="flex justify-between items-center text-xs text-default-500">
                    <span>Target: {skill.targetLevel}%</span>
                    <span>Year {getCurrentAcademicYear()}</span>
                  </div>
                </div>

                {/* Relevance Info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <BookOpenIcon className="w-3 h-3" />
                    <span>{skill.courses.length} courses</span>
                  </div>
                  <Chip
                    color={getSkillRelevanceColor(skill.frequency)}
                    size="sm"
                    variant="flat"
                  >
                    {getSkillRelevanceText(skill.frequency)}
                  </Chip>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center p-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <ChartBarIcon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-lg font-bold">{skills.length}</p>
            <p className="text-sm text-default-600">Top Skills</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-4">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <StarIcon className="w-5 h-5 text-success" />
            </div>
            <p className="text-lg font-bold">
              {skills.filter((s) => s.frequency >= 3).length}
            </p>
            <p className="text-sm text-default-600">High Relevance</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-4">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <AcademicCapIcon className="w-5 h-5 text-warning" />
            </div>
            <p className="text-lg font-bold">
              {Math.round(
                skills.reduce(
                  (sum, s) => sum + (s.currentLevel || s.level),
                  0,
                ) / skills.length,
              )}
              %
            </p>
            <p className="text-sm text-default-600">Avg Level</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CompactAcademicSkills;
