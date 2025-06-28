﻿"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowDownTrayIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/solid";

import { siteConfig } from "@/config/site";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-saffron-50 via-background to-saffron-100 dark:from-background dark:via-saffron-950/20 dark:to-background" />
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-saffron-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          className="absolute top-40 right-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hi, I&apos;m <span className="text-primary">Laurent</span>
          </motion.h1>{" "}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl text-default-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Aspiring Full-Stack Developer building modern web applications
            through 3 years of self-study and hands-on learning
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              className="font-semibold"
              color="primary"
              endContent={<ArrowRightIcon className="w-5 h-5 flex-shrink-0" />}
              size="lg"
              variant="shadow"
              onPress={() => {
                document.getElementById("projects")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              View My Work
            </Button>
            <Button
              as="a"
              className="font-semibold"
              href="/Laurent_Cv.pdf"
              rel="noopener noreferrer"
              size="lg"
              startContent={
                <ArrowDownTrayIcon className="w-5 h-5 flex-shrink-0" />
              }
              target="_blank"
              variant="bordered"
            >
              View CV
            </Button>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {" "}
            <motion.a
              aria-label="Visit GitHub Profile"
              className="text-default-500 hover:text-primary transition-colors"
              href={siteConfig.links.github}
              rel="noopener noreferrer"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </motion.a>
            <motion.a
              aria-label="Visit LinkedIn Profile"
              className="text-default-500 hover:text-primary transition-colors"
              href={siteConfig.links.linkedin}
              rel="noopener noreferrer"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </motion.a>{" "}
            <motion.a
              aria-label="Send Email"
              className="text-default-500 hover:text-primary transition-colors"
              href={`mailto:${siteConfig.links.email.replace("mailto:", "")}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>{" "}
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            className="cursor-pointer"
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <ArrowDownCircleIcon className="w-12 h-12 text-default-500 hover:text-primary transition-colors" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
