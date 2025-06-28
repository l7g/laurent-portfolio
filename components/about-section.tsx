"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  CircleStackIcon,
  GlobeAltIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

interface Highlight {
  icon: any;
  title: string;
  description: string;
}

interface AboutSectionData {
  title: string;
  subtitle: string;
  description: string;
  content?: {
    highlights?: Array<{
      title: string;
      description: string;
      iconType?: string;
    }>;
    skills?: string[];
  };
}

const AboutSection = () => {
  const [sectionData, setSectionData] = useState<AboutSectionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Icon mapping function
  const getIcon = (iconType?: string) => {
    const iconMap: { [key: string]: any } = {
      code: <CodeBracketIcon className="w-6 h-6" />,
      database: <CircleStackIcon className="w-6 h-6" />,
      globe: <GlobeAltIcon className="w-6 h-6" />,
      bolt: <BoltIcon className="w-6 h-6" />,
    };
    return (
      iconMap[iconType || "code"] || <CodeBracketIcon className="w-6 h-6" />
    );
  };

  useEffect(() => {
    async function fetchSectionData() {
      try {
        const response = await fetch("/api/sections");
        if (response.ok) {
          const sections = await response.json();
          const aboutSection = sections.find(
            (section: any) => section.name === "about",
          );

          if (aboutSection) {
            setSectionData(aboutSection);
          }
        }
      } catch (error) {
        console.error("Failed to fetch about section:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSectionData();
  }, []);

  if (loading) {
    return (
      <section className="py-20" id="about">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  // Fallback to hardcoded data if database data is not available
  const highlights: Highlight[] = sectionData?.content?.highlights?.map(
    (h) => ({
      icon: getIcon(h.iconType),
      title: h.title,
      description: h.description,
    }),
  ) || [
    {
      icon: <CodeBracketIcon className="w-6 h-6" />,
      title: "Full-Stack Development",
      description:
        "Expertise in modern web technologies including React, Next.js, Node.js, and TypeScript",
    },
    {
      icon: <CircleStackIcon className="w-6 h-6" />,
      title: "Database Design",
      description:
        "Proficient in Prisma, PostgreSQL databases, with experience in C#, .NET, and MongoDB",
    },
    {
      icon: <GlobeAltIcon className="w-6 h-6" />,
      title: "Software Solutions",
      description:
        "Building scalable, responsive applications with focus on performance and user experience",
    },
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: "Modern Tools",
      description:
        "Utilizing the latest development tools and frameworks to deliver cutting-edge solutions",
    },
  ];

  const skills: string[] = sectionData?.content?.skills || [
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
    "REST APIs",
    "Git/GitHub",
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
            {sectionData?.title || "About"}{" "}
            <span className="text-primary">
              {sectionData?.subtitle || "Me"}
            </span>
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            {sectionData?.description ||
              "I'm a passionate full-stack developer with a love for creating innovative software solutions. With expertise in modern technologies and a keen eye for detail, I transform ideas into digital applications that make a difference."}
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
              forefront of software development and emerging technologies.
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
