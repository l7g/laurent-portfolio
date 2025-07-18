﻿"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  EnvelopeIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { siteConfig } from "@/config/site";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const workInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(5, "Please describe the position"),
  workType: z.string().min(3, "Please specify work type"),
  timeline: z.string().optional(),
  description: z
    .string()
    .min(20, "Please provide more details about the opportunity"),
});

type WorkInquiryForm = z.infer<typeof workInquirySchema>;

interface ContactContent {
  title: string;
  description: string;
  journeyTitle: string;
  journeyStats: Array<{ label: string; value: string }>;
  tabGeneral: string;
  tabWork: string;
  successMessage: string;
  errorMessage: string;
  generalPlaceholder: string;
  workPlaceholder: string;
}

// Helper function to get setting value with proper null/undefined checking
const getSettingValue = (
  settings: Record<string, any>,
  key: string,
  defaultValue: any,
) => {
  return settings[key] !== undefined ? settings[key] : defaultValue;
};

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [activeTab, setActiveTab] = useState<"contact" | "work">("contact");
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const workForm = useForm<WorkInquiryForm>({
    resolver: zodResolver(workInquirySchema),
  });

  const handleContactSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        contactForm.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };
  const handleWorkSubmit = async (data: WorkInquiryForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        workForm.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  // Fetch content from database
  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch("/api/site-settings");

        if (response.ok) {
          const settings = await response.json();

          setContent({
            title: getSettingValue(settings, "contact_title", "Let's Connect"),
            description: getSettingValue(
              settings,
              "contact_description",
              "I'm enthusiastic about starting my professional journey and eager to learn from experienced developers. Whether you have entry-level opportunities, mentorship, or just want to discuss code - I'd love to hear from you!",
            ),
            journeyTitle: getSettingValue(
              settings,
              "contact_journey_title",
              "My Journey",
            ),
            journeyStats: getSettingValue(settings, "contact_journey_stats", [
              { label: "Years Learning", value: "3+" },
              { label: "Accenture Intern", value: "6mo" },
              { label: "Team Projects", value: "Real" },
              { label: "Ready for", value: "Impact" },
            ]),
            tabGeneral: getSettingValue(
              settings,
              "contact_tab_general",
              "General Contact",
            ),
            tabWork: getSettingValue(
              settings,
              "contact_tab_work",
              "Work Inquiry",
            ),
            successMessage: getSettingValue(
              settings,
              "contact_success_message",
              "Message sent successfully! I'll get back to you soon.",
            ),
            errorMessage: getSettingValue(
              settings,
              "contact_error_message",
              "Failed to send message. Please try again or email me directly.",
            ),
            generalPlaceholder: getSettingValue(
              settings,
              "contact_general_placeholder",
              "Tell me about opportunities, collaborations, or just say hello!",
            ),
            workPlaceholder: getSettingValue(
              settings,
              "contact_work_placeholder",
              "Tell me about the role, responsibilities, team, and what you're looking for in a candidate.",
            ),
          });
        }
      } catch (error) {
        console.error("Failed to fetch contact content:", error);
        // Use fallback content if fetch fails
        setContent({
          title: "Let's Connect",
          description:
            "I'm enthusiastic about starting my professional journey and eager to learn from experienced developers. Whether you have entry-level opportunities, mentorship, or just want to discuss code - I'd love to hear from you!",
          journeyTitle: "My Journey",
          journeyStats: [
            { label: "Years Learning", value: "3+" },
            { label: "Accenture Intern", value: "6mo" },
            { label: "Team Projects", value: "Real" },
            { label: "Ready for", value: "Impact" },
          ],
          tabGeneral: "General Contact",
          tabWork: "Work Inquiry",
          successMessage:
            "Message sent successfully! I'll get back to you soon.",
          errorMessage:
            "Failed to send message. Please try again or email me directly.",
          generalPlaceholder:
            "Tell me about opportunities, collaborations, or just say hello!",
          workPlaceholder:
            "Tell me about the role, responsibilities, team, and what you're looking for in a candidate.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  const contactInfo = [
    {
      icon: <EnvelopeIcon className="w-5 h-5" />,
      title: "Email",
      value: "laurentgagne.dev@pm.me",
      href: siteConfig.links.email,
    },
    /* {
      icon: <PhoneIcon className="w-5 h-5" />,
      title: "Phone",
      value: "+39 3791699005",
      href: "tel:+393791699005",
    }, */
    {
      icon: <MapPinIcon className="w-5 h-5" />,
      title: "Current Location",
      value: "Cagliari, IT",
      href: "#",
    },
  ];

  return (
    <section className="py-20" id="contact">
      <div className="container mx-auto px-6">
        {loading ? (
          <div className="text-center">
            <div className="animate-pulse">Loading contact information...</div>
          </div>
        ) : (
          <>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get In <span className="text-primary">Touch</span>
              </h2>
              <p className="text-xl text-default-600 max-w-3xl mx-auto">
                I&apos;m actively seeking my first professional opportunity in
                software development. Let&apos;s connect to discuss potential
                roles, collaborations, or just chat about technology and coding!
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <div>
                  <h3 className="text-2xl font-bold mb-6">{content?.title}</h3>
                  <p className="text-default-600 mb-8">
                    {content?.description}
                  </p>
                </div>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={item.title}
                      aria-label={`${item.title}: ${item.value}`}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-default-100 transition-colors"
                      href={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-default-600">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {" "}
                  <Card>
                    <CardBody className="p-6">
                      <h4 className="font-bold mb-4">
                        {content?.journeyTitle}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {content?.journeyStats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {stat.value}
                            </div>
                            <div className="text-sm text-default-600">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Contact Forms */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardBody className="p-8">
                    {/* Tab Navigation */}{" "}
                    <div className="flex gap-4 mb-8">
                      <Button
                        color={activeTab === "contact" ? "primary" : "default"}
                        variant={activeTab === "contact" ? "solid" : "light"}
                        onPress={() => setActiveTab("contact")}
                      >
                        {content?.tabGeneral}
                      </Button>
                      <Button
                        color={activeTab === "work" ? "primary" : "default"}
                        variant={activeTab === "work" ? "solid" : "light"}
                        onPress={() => setActiveTab("work")}
                      >
                        {content?.tabWork}
                      </Button>
                    </div>
                    {/* Status Messages */}
                    {submitStatus === "success" && (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 mb-6 bg-success/10 rounded-lg text-success"
                        initial={{ opacity: 0, y: -10 }}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{content?.successMessage}</span>
                      </motion.div>
                    )}
                    {submitStatus === "error" && (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 mb-6 bg-danger/10 rounded-lg text-danger"
                        initial={{ opacity: 0, y: -10 }}
                      >
                        <ExclamationCircleIcon className="w-5 h-5" />
                        <span>{content?.errorMessage}</span>
                      </motion.div>
                    )}
                    {/* Contact Form */}
                    {activeTab === "contact" && (
                      <form
                        className="space-y-6"
                        onSubmit={contactForm.handleSubmit(handleContactSubmit)}
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <Input
                            label="Your Name"
                            placeholder="Enter your full name"
                            {...contactForm.register("name")}
                            errorMessage={
                              contactForm.formState.errors.name?.message
                            }
                            isInvalid={!!contactForm.formState.errors.name}
                          />
                          <Input
                            label="Email Address"
                            placeholder="your.email@example.com"
                            type="email"
                            {...contactForm.register("email")}
                            errorMessage={
                              contactForm.formState.errors.email?.message
                            }
                            isInvalid={!!contactForm.formState.errors.email}
                          />
                        </div>
                        <Input
                          label="Subject"
                          placeholder="What's this about?"
                          {...contactForm.register("subject")}
                          errorMessage={
                            contactForm.formState.errors.subject?.message
                          }
                          isInvalid={!!contactForm.formState.errors.subject}
                        />{" "}
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="contact-message"
                          >
                            Message
                          </label>
                          <textarea
                            className="w-full p-3 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            id="contact-message"
                            placeholder={content?.generalPlaceholder}
                            rows={6}
                            {...contactForm.register("message")}
                            aria-describedby={
                              contactForm.formState.errors.message
                                ? "contact-message-error"
                                : undefined
                            }
                          />
                          {contactForm.formState.errors.message && (
                            <p
                              className="text-danger text-sm mt-1"
                              id="contact-message-error"
                            >
                              {contactForm.formState.errors.message.message}
                            </p>
                          )}
                        </div>
                        <Button
                          className="w-full"
                          color="primary"
                          isLoading={isSubmitting}
                          size="lg"
                          startContent={
                            !isSubmitting && (
                              <PaperAirplaneIcon className="w-5 h-5" />
                            )
                          }
                          type="submit"
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    )}{" "}
                    {/* Work Inquiry Form */}
                    {activeTab === "work" && (
                      <form
                        className="space-y-6"
                        onSubmit={workForm.handleSubmit(handleWorkSubmit)}
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <Input
                            label="Your Name"
                            placeholder="Enter your full name"
                            {...workForm.register("name")}
                            errorMessage={
                              workForm.formState.errors.name?.message
                            }
                            isInvalid={!!workForm.formState.errors.name}
                          />
                          <Input
                            label="Email Address"
                            placeholder="your.email@example.com"
                            type="email"
                            {...workForm.register("email")}
                            errorMessage={
                              workForm.formState.errors.email?.message
                            }
                            isInvalid={!!workForm.formState.errors.email}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {" "}
                          <Input
                            label="Company Name"
                            placeholder="Your company or organization"
                            {...workForm.register("company")}
                            errorMessage={
                              workForm.formState.errors.company?.message
                            }
                            isInvalid={!!workForm.formState.errors.company}
                          />
                          <Input
                            label="Position/Role"
                            placeholder="e.g., Junior Developer, Frontend Developer"
                            {...workForm.register("position")}
                            errorMessage={
                              workForm.formState.errors.position?.message
                            }
                            isInvalid={!!workForm.formState.errors.position}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {" "}
                          <Input
                            label="Work Type"
                            placeholder="e.g., Full-time, Part-time, Contract"
                            {...workForm.register("workType")}
                            errorMessage={
                              workForm.formState.errors.workType?.message
                            }
                            isInvalid={!!workForm.formState.errors.workType}
                          />
                          <Input
                            label="Timeline (Optional)"
                            placeholder="e.g., Immediate, 1-2 months"
                            {...workForm.register("timeline")}
                          />
                        </div>{" "}
                        <div>
                          {" "}
                          <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="work-description"
                          >
                            Opportunity Description
                          </label>
                          <textarea
                            className="w-full p-3 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            id="work-description"
                            placeholder={content?.workPlaceholder}
                            rows={6}
                            {...workForm.register("description")}
                            aria-describedby={
                              workForm.formState.errors.description
                                ? "work-description-error"
                                : undefined
                            }
                          />
                          {workForm.formState.errors.description && (
                            <p
                              className="text-danger text-sm mt-1"
                              id="work-description-error"
                            >
                              {workForm.formState.errors.description.message}
                            </p>
                          )}
                        </div>
                        <Button
                          className="w-full"
                          color="primary"
                          isLoading={isSubmitting}
                          size="lg"
                          startContent={
                            !isSubmitting && (
                              <PaperAirplaneIcon className="w-5 h-5" />
                            )
                          }
                          type="submit"
                        >
                          {isSubmitting ? "Submitting..." : "Send Work Inquiry"}
                        </Button>
                      </form>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
