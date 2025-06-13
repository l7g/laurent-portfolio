"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import { Code2, Database, Globe, Zap } from "lucide-react";

const AboutSection = () => {
  const highlights = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Full-Stack Development",
      description:
        "Expertise in modern web technologies including React, Next.js, Node.js, and TypeScript",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Database Design",
      description:
        "Proficient in Prisma, PostgreSQL databases, with experience in C#, .NET, and MongoDB",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Web Applications",
      description:
        "Building scalable, responsive applications with focus on performance and user experience",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Modern Tools",
      description:
        "Utilizing the latest development tools and frameworks to deliver cutting-edge solutions",
    },
  ];

  const skills = [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Prisma",
    "PostgreSQL",
    "TailwindCSS",
    "C#",
    ".NET",
    "MVC",
    "Git",
    "MongoDB",
  ];

  return (
    <section className="py-20 bg-default-50/50" id="about">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-primary">Me</span>
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            I&apos;m a passionate full-stack developer with a love for creating
            innovative web applications. With expertise in modern technologies
            and a keen eye for detail, I transform ideas into digital solutions
            that make a difference.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6">My Journey</h3>
            <p className="text-default-600 mb-6 leading-relaxed">
              My passion for technology began early, and over the years
              I&apos;ve developed expertise in both frontend and backend
              development. I specialize in creating seamless user experiences
              backed by robust, scalable architecture.
            </p>
            <p className="text-default-600 mb-6 leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me exploring new
              technologies, reading tech blogs, or experimenting with new
              frameworks. I believe in continuous learning and staying at the
              forefront of web development trends.
            </p>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  <Chip className="text-sm" color="primary" variant="flat">
                    {skill}
                  </Chip>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <CardBody className="flex flex-row items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h4>
                      <p className="text-default-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
