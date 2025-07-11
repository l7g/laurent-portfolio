"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import Link from "next/link";
import LoadingSkeleton from "./loading-skeleton";
import {
  CodeBracketIcon,
  CircleStackIcon,
  PaintBrushIcon,
  ServerIcon,
  CloudIcon,
  CommandLineIcon,
  CogIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CalendarIcon,
  TrophyIcon,
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
import CompactAcademicSkills from "./compact-academic-skills";
import { useEducationVisibility } from "@/lib/use-education-visibility";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: any;
  color: string;
  skills: SkillItem[];
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
  actualGraduationDate?: string;
  dissertationStarted?: boolean;
  dissertationTitle?: string;
  dissertationSubmitted?: boolean;
}

interface Technology {
  name: string;
  icon: any;
  color?: string;
}

interface EducationSkillsSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showAcademicProgress?: boolean;
  showTechnicalSkills?: boolean;
  showCertifications?: boolean;
  layout?: "combined" | "separate";
}

const EducationSkillsSection = ({
  title = "Education & Skills",
  subtitle = "Learning Journey",
  description = "Building expertise through formal education and hands-on development.",
  showAcademicProgress = true,
  showTechnicalSkills = true,
  showCertifications = true,
  layout = "combined",
}: EducationSkillsSectionProps) => {
  const { isEducationVisible } = useEducationVisibility();
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [academic_programs, setacademic_programs] =
    useState<academic_programs | null>(null);
  const [loading, setLoading] = useState(true);

  // Override education-related props based on visibility toggle
  const effectiveShowAcademicProgress =
    isEducationVisible && showAcademicProgress;
  const effectiveShowCertifications = isEducationVisible && showCertifications;

  // Update title and description when education is hidden
  const effectiveTitle = isEducationVisible ? title : "Technical Skills";
  const effectiveSubtitle = isEducationVisible
    ? subtitle
    : "Technical Expertise";
  const effectiveDescription = isEducationVisible
    ? description
    : "Technical skills and proficiency across various technologies and tools.";

  // Helper function to get color for category
  const getColorForCategory = (categoryTitle: string) => {
    const colorMap: { [key: string]: string } = {
      "Frontend Development": "primary",
      "Backend Development": "secondary",
      "Database & ORM": "success",
      "Tools & Version Control": "warning",
      "Academic Skills": "success",
      "International Relations": "primary",
      "Language & Communication": "secondary",
      "Analytical Skills": "warning",
      Other: "default",
    };
    return colorMap[categoryTitle] || "primary";
  };

  // Helper function to get current academic year
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

  // Helper function to check if a skill is academic
  const isAcademicSkill = (categoryTitle: string) => {
    return (
      categoryTitle === "International Relations" ||
      categoryTitle === "Academic Skills" ||
      categoryTitle === "Analytical Skills" ||
      categoryTitle === "Communication Skills"
    );
  };

  // Icon mapping function
  const getIconForCategory = (categoryTitle: string) => {
    const iconMap: { [key: string]: any } = {
      "Frontend Development": <CodeBracketIcon className="w-6 h-6" />,
      "Backend Development": <ServerIcon className="w-6 h-6" />,
      "Database & ORM": <CircleStackIcon className="w-6 h-6" />,
      "Tools & Version Control": <CloudIcon className="w-6 h-6" />,
      "Academic Skills": <AcademicCapIcon className="w-6 h-6" />,
      "International Relations": <GlobeAltIcon className="w-6 h-6" />,
    };
    return iconMap[categoryTitle] || <CogIcon className="w-6 h-6" />;
  };

  // Technology icon mapping
  const getTechIcon = (techName: string) => {
    const iconMap: { [key: string]: { icon: any; color?: string } } = {
      JavaScript: {
        icon: <SiJavascript className="w-8 h-8" />,
        color: "#F7DF1E",
      },
      React: { icon: <SiReact className="w-8 h-8" />, color: "#61DAFB" },
      "Next.js": { icon: <SiNextdotjs className="w-8 h-8 dark:text-white" /> },
      TypeScript: {
        icon: <SiTypescript className="w-8 h-8" />,
        color: "#3178C6",
      },
      "Node.js": {
        icon: <SiNodedotjs className="w-8 h-8" />,
        color: "#339933",
      },
      Express: {
        icon: <SiExpress className="w-8 h-8 dark:text-white" />,
        color: "#000000",
      },
      "C# / .NET": { icon: <SiSharp className="w-8 h-8" />, color: "#512BD4" },
      SQL: { icon: <SiMysql className="w-8 h-8" />, color: "#4479A1" },
      PostgreSQL: {
        icon: <SiPostgresql className="w-8 h-8" />,
        color: "#336791",
      },
      Prisma: { icon: <SiPrisma className="w-8 h-8" />, color: "#2D3748" },
      Git: { icon: <SiGit className="w-8 h-8" />, color: "#F05032" },
      TailwindCSS: {
        icon: <SiTailwindcss className="w-8 h-8" />,
        color: "#06B6D4",
      },
      "React/Next.js": {
        icon: <SiReact className="w-8 h-8" />,
        color: "#61DAFB",
      },
      "Express.js": {
        icon: <SiExpress className="w-8 h-8 dark:text-white" />,
        color: "#000000",
      },
      "REST APIs": {
        icon: <CommandLineIcon className="w-8 h-8" />,
        color: "#4F46E5",
      },
      "MS SQL": { icon: <SiMysql className="w-8 h-8" />, color: "#CC2927" },
      "Git/GitHub": { icon: <SiGit className="w-8 h-8" />, color: "#F05032" },
      Vercel: { icon: <CloudIcon className="w-8 h-8" />, color: "#000000" },
      MongoDB: {
        icon: <CircleStackIcon className="w-8 h-8" />,
        color: "#47A248",
      },
      GraphQL: {
        icon: <CodeBracketIcon className="w-8 h-8" />,
        color: "#E10098",
      },
    };
    return iconMap[techName] || { icon: <CogIcon className="w-8 h-8" /> };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [skillsResponse, programResponse, skill_progressionsResponse] =
          await Promise.all([
            fetch("/api/skills"),
            fetch("/api/academic-program"),
            fetch("/api/skill-progression"),
          ]);

        if (skillsResponse.ok) {
          const dbSkills = await skillsResponse.json();

          // Category mapping
          const categoryMapping: { [key: string]: string } = {
            FRONTEND: "Frontend Development",
            BACKEND: "Backend Development",
            DATABASE: "Database & ORM",
            TOOLS: "Tools & Version Control",
            DESIGN: "Design",
            ACADEMIC: "International Relations",
            OTHER: "Other",
          };

          // Color mapping
          const categoryColors: { [key: string]: string } = {
            "Frontend Development": "primary",
            "Backend Development": "secondary",
            "Database & ORM": "success",
            "Tools & Version Control": "warning",
            Design: "danger",
            Other: "default",
            "International Relations": "success",
          };

          // Group skills by category
          const categoriesMap: {
            [key: string]: {
              title: string;
              color: string;
              skills: SkillItem[];
            };
          } = {};
          const techList: Technology[] = [];

          dbSkills.forEach((skill: any) => {
            const displayCategory =
              categoryMapping[skill.category] || skill.category;

            // Skip academic skills if education is not visible
            if (skill.category === "ACADEMIC" && !isEducationVisible) {
              return;
            }

            // Skip academic skills since we show them separately (only when education is visible)
            if (isAcademicSkill(displayCategory) && isEducationVisible) {
              return;
            }

            if (!categoriesMap[displayCategory]) {
              categoriesMap[displayCategory] = {
                title: displayCategory,
                color: categoryColors[displayCategory] || "primary",
                skills: [],
              };
            }

            categoriesMap[displayCategory].skills.push({
              name: skill.name,
              level: skill.level,
            });

            // Add to technologies list if high level and not academic
            if (skill.level >= 80 && skill.category !== "ACADEMIC") {
              const techIconData = getTechIcon(skill.name);
              techList.push({
                name: skill.name,
                icon: techIconData.icon,
                color: techIconData.color,
              });
            }
          });

          // Add course-delivered skills for academic categories
          if (skill_progressionsResponse.ok) {
            const skill_progressionsData =
              await skill_progressionsResponse.json();

            Object.keys(skill_progressionsData).forEach((skillName) => {
              const skillData = skill_progressionsData[skillName];
              const categoryName = skillData.category;

              // Skip academic skills if education is not visible
              if (isAcademicSkill(categoryName) && !isEducationVisible) {
                return;
              }

              // Skip academic skills since we show them separately (only when education is visible)
              if (isAcademicSkill(categoryName) && isEducationVisible) {
                return;
              }

              if (!categoriesMap[categoryName]) {
                categoriesMap[categoryName] = {
                  title: categoryName,
                  color: getColorForCategory(categoryName),
                  skills: [],
                };
              }

              // Add skill to the category
              const skillEntry = {
                name: skillName,
                level: Math.round(skillData.level),
              };

              // Check if skill already exists in category
              const existingSkillIndex = categoriesMap[
                categoryName
              ].skills.findIndex((s) => s.name === skillName);

              if (existingSkillIndex >= 0) {
                // Update existing skill level
                categoriesMap[categoryName].skills[existingSkillIndex].level =
                  skillEntry.level;
              } else {
                // Add new skill
                categoriesMap[categoryName].skills.push(skillEntry);
              }
            });
          }

          // Convert to array and add icons, but filter out academic skills since we show them separately
          const categoriesArray = Object.values(categoriesMap)
            .filter((cat) => !isAcademicSkill(cat.title)) // Filter out academic skills
            .map((cat) => ({
              ...cat,
              icon: getIconForCategory(cat.title),
            }));

          setSkillCategories(categoriesArray);
          setTechnologies(techList);
        }

        if (programResponse.ok) {
          const programData = await programResponse.json();
          setacademic_programs(programData[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="education" className="bg-default-50/50" />;
  }

  return (
    <section className="py-20 bg-default-50/50" id="education-skills">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {effectiveTitle.split(" ")[0]}{" "}
            <span className="text-primary">
              {effectiveTitle.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto mb-8">
            {effectiveDescription}
          </p>
        </motion.div>

        {/* Academic Progress Section */}
        {effectiveShowAcademicProgress && academic_programs && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Link href="/degree" className="block">
              <Card className="mb-8 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardBody className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-lg bg-success/10 text-success group-hover:bg-success/20 transition-colors">
                      <AcademicCapIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                            {academic_programs.degree}
                          </h3>
                          <Chip color="success" variant="flat" size="sm">
                            Year {getCurrentAcademicYear()}
                          </Chip>
                        </div>
                        <motion.div
                          className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ x: 5 }}
                        >
                          <GlobeAltIcon className="w-5 h-5" />
                        </motion.div>
                      </div>
                      <p className="text-lg text-default-600 mb-2">
                        <strong>{academic_programs.institution}</strong>
                      </p>
                      {academic_programs.accreditation && (
                        <p className="text-base text-default-500 mb-6">
                          {academic_programs.accreditation}
                        </p>
                      )}

                      {/* Enhanced Info Grid */}
                      <div className="grid md:grid-cols-1 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-default-500 mb-2">
                            Expected Graduation
                          </p>
                          <p className="font-medium">
                            {new Date(
                              academic_programs.expectedEnd,
                            ).getFullYear()}
                          </p>
                        </div>
                      </div>

                      {/* Academic Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Academic Progress
                          </span>
                          <span className="text-sm text-default-500">
                            {getCurrentAcademicYear()}/
                            {academic_programs.totalYears} years
                          </span>
                        </div>
                        <Progress
                          color="success"
                          value={
                            (getCurrentAcademicYear() /
                              academic_programs.totalYears) *
                            100
                          }
                          className="h-3"
                        />
                      </div>

                      {/* Call to Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-default-200">
                        <div className="text-sm text-default-600">
                          {academic_programs.status === "COMPLETED"
                            ? academic_programs.actualGraduationDate
                              ? `Graduated ${new Date(academic_programs.actualGraduationDate).getFullYear()} • Bridging Technology & Global Affairs`
                              : "Completed • Bridging Technology & Global Affairs"
                            : academic_programs.dissertationStarted
                              ? academic_programs.dissertationTitle
                                ? `Dissertation: "${academic_programs.dissertationTitle}"`
                                : "Dissertation Phase • Final Year"
                              : "Academic Journey • Bridging Technology & Global Affairs"}
                        </div>
                        <div className="text-sm text-primary font-medium group-hover:text-primary-600 transition-colors">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Academic Skills - Most Relevant */}
        {effectiveShowAcademicProgress && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <CompactAcademicSkills
              maxSkills={6}
              showViewAllLink={true}
              title="Most Relevant Academic Skills"
              description="Key skills being developed through coursework, prioritized by frequency across courses"
            />
          </motion.div>
        )}

        {/* Skills Categories */}
        {showTechnicalSkills && (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`p-2 rounded-lg bg-${category.color}/10 text-${category.color}`}
                      >
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                    </div>

                    <div className="space-y-4">
                      {category.skills.map((skill, skillIndex) => {
                        const isAcademic = isAcademicSkill(category.title);
                        const currentYear = getCurrentAcademicYear();

                        return (
                          <motion.div
                            key={`${category.title}-${skill.name}-${skillIndex}`}
                            initial={{ opacity: 0, x: -20 }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.1 + skillIndex * 0.1,
                            }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1, x: 0 }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                {skill.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-default-500">
                                  {skill.level}%
                                </span>
                                {isAcademic && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    Year {currentYear}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Progress
                              aria-label={`${skill.name} skill level: ${skill.level}%`}
                              className="h-2"
                              color={category.color as any}
                              value={skill.level}
                            />
                            {isAcademic && (
                              <div className="mt-2 text-xs text-default-400">
                                🎯 Expected by graduation: 85-90%
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Technologies Grid */}
        {technologies.length > 0 && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-8">Core Technologies</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-default-100 transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-300"
                    style={{ color: tech.color }}
                  >
                    {tech.icon}
                  </div>
                  <span className="text-sm font-medium text-center">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Professional Development */}
        {showCertifications && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <h3 className="text-2xl font-bold text-center mb-8">
                  Professional Development & Experience
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TrophyIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Accenture Internship</h4>
                    <p className="text-sm text-default-600">
                      6-month technology consulting internship, gaining
                      experience in enterprise solutions and professional
                      development practices
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <CodeBracketIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">
                      Self-Taught Development
                    </h4>
                    <p className="text-sm text-default-600">
                      3+ years of dedicated learning in modern web technologies,
                      building expertise through hands-on practice and
                      continuous education
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Academic Preparation</h4>
                    <p className="text-sm text-default-600">
                      Starting BSc International Relations in August 2025 to
                      bridge technical expertise with global strategic thinking
                      and international affairs
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EducationSkillsSection;
