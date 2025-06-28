"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  CircleStackIcon,
  PaintBrushIcon,
  ServerIcon,
  CloudIcon,
  CommandLineIcon,
  CogIcon,
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

interface Technology {
  name: string;
  icon: any;
  color?: string;
}

const SkillsSection = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping function
  const getIconForCategory = (categoryTitle: string) => {
    const iconMap: { [key: string]: any } = {
      "Frontend Development": <CodeBracketIcon className="w-6 h-6" />,
      "Backend Development": <ServerIcon className="w-6 h-6" />,
      "Database & ORM": <CircleStackIcon className="w-6 h-6" />,
      "Tools & Version Control": <CloudIcon className="w-6 h-6" />,
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
      // Additional skills from the updated seed data
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
    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills");
        if (response.ok) {
          const dbSkills = await response.json();

          // Mapping from database categories to display names
          const categoryMapping: { [key: string]: string } = {
            FRONTEND: "Frontend Development",
            BACKEND: "Backend Development",
            DATABASE: "Database & ORM",
            TOOLS: "Tools & Version Control",
            DESIGN: "Design",
            OTHER: "Other",
          };

          // Color mapping for categories
          const categoryColors: { [key: string]: string } = {
            "Frontend Development": "primary",
            "Backend Development": "secondary",
            "Database & ORM": "success",
            "Tools & Version Control": "warning",
            Design: "danger",
            Other: "default",
          };

          // Group skills by category and transform to match existing format
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

            // Add to technologies list if it's a main technology (has isFeatured field or high level)
            if (skill.level >= 80) {
              const techIconData = getTechIcon(skill.name);
              techList.push({
                name: skill.name,
                icon: techIconData.icon,
                color: techIconData.color,
              });
            }
          });

          // Convert map to array and add icons
          const categoriesArray = Object.values(categoriesMap).map((cat) => ({
            ...cat,
            icon: getIconForCategory(cat.title),
          }));

          setSkillCategories(categoriesArray);
          setTechnologies(techList);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        // Fallback to empty arrays
        setSkillCategories([]);
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-default-50/50" id="skills">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-default-50/50" id="skills">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {" "}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Skills & <span className="text-primary">Learning Journey</span>
          </h2>{" "}
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            3 years of dedicated self-study in web development, with strong
            foundations in JavaScript and modern web technologies. Recently
            completed a 3-month C#/.NET course that deepened my understanding of
            database theory and backend architecture, making me more versatile
            across different tech stacks.
          </p>
        </motion.div>

        {/* Skill Categories */}
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
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
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
                          <span className="text-sm text-default-500">
                            {skill.level}%
                          </span>
                        </div>{" "}
                        <Progress
                          aria-label={`${skill.name} skill level: ${skill.level}%`}
                          className="h-2"
                          color={category.color as any}
                          value={skill.level}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technologies Grid */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-bold mb-8">
            Technologies I&apos;m Working With
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {" "}
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

        {/* Additional Skills */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardBody className="p-8">
              {" "}
              <h3 className="text-2xl font-bold text-center mb-8">
                Growing Skills & Interests
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <PaintBrushIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">UI/UX Awareness</h4>
                  <p className="text-sm text-default-600">
                    Developing an eye for user-friendly interfaces and learning
                    design principles to create better user experiences
                  </p>
                </div>{" "}
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CommandLineIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Database Architecture</h4>
                  <p className="text-sm text-default-600">
                    Strong understanding of database design and theory gained
                    through C#/.NET course, now applying these concepts across
                    different tech stacks and ORMs
                  </p>
                </div>{" "}
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CogIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    Full-Stack Capabilities
                  </h4>
                  <p className="text-sm text-default-600">
                    Proven ability to build complete web applications from
                    database design to frontend implementation, with experience
                    across multiple technology stacks
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
