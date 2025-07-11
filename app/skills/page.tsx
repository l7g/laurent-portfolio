"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  CircleStackIcon,
  PaintBrushIcon,
  ServerIcon,
  CloudIcon,
  CommandLineIcon,
  CogIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiSharp,
  SiPostgresql,
  SiPrisma,
  SiGit,
  SiTailwindcss,
  SiMysql,
} from "react-icons/si";
import { title } from "@/components/primitives";
import { useEducationVisibility } from "@/lib/use-education-visibility";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface SkillCategory {
  title: string;
  icon: any;
  color: string;
  skills: SkillItem[];
}

const iconMap: Record<string, any> = {
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiSharp,
  SiPostgresql,
  SiPrisma,
  SiGit,
  SiTailwindcss,
  SiMysql,
};

const categoryConfig: Record<
  string,
  { title: string; icon: any; color: string }
> = {
  FRONTEND: {
    title: "Frontend Development",
    icon: CodeBracketIcon,
    color: "primary",
  },
  BACKEND: {
    title: "Backend Development",
    icon: ServerIcon,
    color: "secondary",
  },
  DATABASE: {
    title: "Database & Storage",
    icon: CircleStackIcon,
    color: "success",
  },
  TOOLS: {
    title: "Tools & DevOps",
    icon: CommandLineIcon,
    color: "warning",
  },
  DESIGN: {
    title: "Design & UI/UX",
    icon: PaintBrushIcon,
    color: "danger",
  },
  ACADEMIC: {
    title: "Academic Skills",
    icon: GlobeAltIcon,
    color: "default",
  },
  OTHER: {
    title: "Other Technologies",
    icon: CogIcon,
    color: "default",
  },
};

export default function SkillsPage() {
  const { isEducationVisible } = useEducationVisibility();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/skills");
        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched skills:", data);
        setSkills(data.filter((skill: SkillItem) => skill.isActive));
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const groupSkillsByCategory = (skills: SkillItem[]): SkillCategory[] => {
    // Filter out academic skills if education is not visible
    const filteredSkills =
      isEducationVisible === true
        ? skills
        : skills.filter((skill) => skill.category !== "ACADEMIC");

    const grouped = filteredSkills.reduce(
      (acc: Record<string, SkillItem[]>, skill) => {
        const category = skill.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      },
      {},
    );

    return Object.entries(grouped).map(([category, skills]) => ({
      title: categoryConfig[category]?.title || category,
      icon: categoryConfig[category]?.icon || CogIcon,
      color: categoryConfig[category]?.color || "default",
      skills: skills.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    }));
  };

  const skillCategories = groupSkillsByCategory(skills);

  const getSkillColor = (level: number) => {
    if (level >= 90) return "success";
    if (level >= 80) return "primary";
    if (level >= 70) return "warning";
    return "default";
  };

  const getSkillIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading skills...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="flex justify-center items-center min-h-screen">
          <Card className="p-8">
            <CardBody className="text-center">
              <p className="text-danger mb-4">Error loading skills: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
        <div className="flex justify-center items-center min-h-screen">
          <Card className="p-8">
            <CardBody className="text-center">
              <p className="text-default-600 mb-4">No skills data available</p>
              <p className="text-sm text-default-500">
                Please check if the database is properly seeded with skills
                data.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className={title({ size: "lg" })}>Technical Skills</h1>
          <p className="text-lg text-default-600 mt-4 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency
            across various technologies and tools.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <Chip
              variant={selectedCategory === null ? "solid" : "flat"}
              color="primary"
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All Skills
            </Chip>
            {skillCategories.map((category) => (
              <Chip
                key={category.title}
                variant={selectedCategory === category.title ? "solid" : "flat"}
                color={category.color as any}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.title)}
              >
                {category.title}
              </Chip>
            ))}
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories
            .filter(
              (category) =>
                selectedCategory === null ||
                category.title === selectedCategory,
            )
            .map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="h-full"
              >
                <Card className="h-full bg-content1/50 backdrop-blur-sm border-1 border-default-200 hover:border-default-300 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-default-100">
                        <category.icon className="w-6 h-6 text-default-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {category.title}
                        </h3>
                        <p className="text-sm text-default-500">
                          {category.skills.length} skills
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-4">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getSkillIcon(skill.icon)}
                              <span className="text-sm font-medium">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-xs text-default-500">
                              {skill.level}%
                            </span>
                          </div>
                          <Progress
                            value={skill.level}
                            color={getSkillColor(skill.level)}
                            className="max-w-full"
                            size="sm"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-content1/50 backdrop-blur-sm border-1 border-default-200">
            <CardBody className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Skills Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {skills.length}
                    </div>
                    <div className="text-sm text-default-500">Total Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {skills.filter((s) => s.level >= 90).length}
                    </div>
                    <div className="text-sm text-default-500">Expert Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">
                      {
                        skills.filter((s) => s.level >= 80 && s.level < 90)
                          .length
                      }
                    </div>
                    <div className="text-sm text-default-500">Advanced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-default-600">
                      {skillCategories.length}
                    </div>
                    <div className="text-sm text-default-500">Categories</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
