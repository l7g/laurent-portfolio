"use client";

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

const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <CodeBracketIcon className="w-6 h-6" />,
      color: "primary",
      skills: [
        { name: "React/Next.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "TailwindCSS", level: 88 },
        { name: "JavaScript", level: 92 },
      ],
    },
    {
      title: "Backend Development",
      icon: <ServerIcon className="w-6 h-6" />,
      color: "secondary",
      skills: [
        { name: "Node.js", level: 87 },
        { name: "Express.js", level: 85 },
        { name: "REST APIs", level: 90 },
        { name: "GraphQL", level: 75 },
      ],
    },
    {
      title: "Database & ORM",
      icon: <CircleStackIcon className="w-6 h-6" />,
      color: "success",
      skills: [
        { name: "PostgreSQL", level: 88 },
        { name: "Prisma", level: 90 },
        { name: "MongoDB", level: 82 },
        { name: "Redis", level: 75 },
      ],
    },
    {
      title: "DevOps & Tools",
      icon: <CloudIcon className="w-6 h-6" />,
      color: "warning",
      skills: [
        { name: "Git/GitHub", level: 92 },
        { name: "Docker", level: 80 },
        { name: "AWS", level: 75 },
        { name: "Vercel", level: 88 },
      ],
    },
  ];

  const technologies = [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "TypeScript", icon: "📘" },
    { name: "Node.js", icon: "💚" },
    { name: "Prisma", icon: "🔺" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "TailwindCSS", icon: "🎨" },
    { name: "Git", icon: "📝" },
    { name: "Docker", icon: "🐳" },
    { name: "AWS", icon: "☁️" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Express", icon: "🚀" },
  ];

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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Skills & <span className="text-primary">Expertise</span>
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            I&apos;m proficient in a wide range of modern technologies and
            tools, constantly learning and adapting to the latest industry
            trends.
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
          <h3 className="text-2xl font-bold mb-8">Technologies I Work With</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
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
              <h3 className="text-2xl font-bold text-center mb-8">
                Additional Competencies
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <PaintBrushIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">UI/UX Design</h4>
                  <p className="text-sm text-default-600">
                    Creating intuitive and visually appealing user interfaces
                    with attention to user experience
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CommandLineIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Version Control</h4>
                  <p className="text-sm text-default-600">
                    Proficient in Git workflows, branching strategies, and
                    collaborative development practices
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CogIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Problem Solving</h4>
                  <p className="text-sm text-default-600">
                    Strong analytical skills and ability to debug complex issues
                    and optimize performance
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
