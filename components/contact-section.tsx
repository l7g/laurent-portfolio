"use client";

import { useState } from "react";
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
  PhoneIcon,
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

const demoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  projectType: z.string().min(5, "Please describe your project type"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z
    .string()
    .min(20, "Please provide more details about your project"),
});

type DemoRequestForm = z.infer<typeof demoRequestSchema>;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [activeTab, setActiveTab] = useState<"contact" | "demo">("contact");

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const demoForm = useForm<DemoRequestForm>({
    resolver: zodResolver(demoRequestSchema),
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

  const handleDemoSubmit = async (data: DemoRequestForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        demoForm.reset();
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
            Ready to bring your ideas to life? Let&apos;s discuss your project
            and see how I can help you achieve your goals with modern web
            development solutions.
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
              <h3 className="text-2xl font-bold mb-6">Let&apos;s Connect</h3>
              <p className="text-default-600 mb-8">
                I&apos;m always open to discussing new opportunities,
                interesting projects, or just having a chat about technology and
                development.
              </p>
            </div>{" "}
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
              <Card>
                <CardBody className="p-6">
                  <h4 className="font-bold mb-4">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-default-600">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">3+</div>
                      <div className="text-sm text-default-600">Years Exp.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">24h</div>
                      <div className="text-sm text-default-600">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        100%
                      </div>
                      <div className="text-sm text-default-600">
                        Satisfaction
                      </div>
                    </div>
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
                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8">
                  <Button
                    color={activeTab === "contact" ? "primary" : "default"}
                    variant={activeTab === "contact" ? "solid" : "light"}
                    onPress={() => setActiveTab("contact")}
                  >
                    General Contact
                  </Button>
                  <Button
                    color={activeTab === "demo" ? "primary" : "default"}
                    variant={activeTab === "demo" ? "solid" : "light"}
                    onPress={() => setActiveTab("demo")}
                  >
                    Request Demo
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
                    <span>
                      Message sent successfully! I&apos;ll get back to you soon.
                    </span>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 mb-6 bg-danger/10 rounded-lg text-danger"
                    initial={{ opacity: 0, y: -10 }}
                  >
                    <ExclamationCircleIcon className="w-5 h-5" />
                    <span>
                      Failed to send message. Please try again or email me
                      directly.
                    </span>
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
                        placeholder="Tell me about your project, ideas, or just say hello!"
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
                )}

                {/* Demo Request Form */}
                {activeTab === "demo" && (
                  <form
                    className="space-y-6"
                    onSubmit={demoForm.handleSubmit(handleDemoSubmit)}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        placeholder="Enter your full name"
                        {...demoForm.register("name")}
                        errorMessage={demoForm.formState.errors.name?.message}
                        isInvalid={!!demoForm.formState.errors.name}
                      />
                      <Input
                        label="Email Address"
                        placeholder="your.email@example.com"
                        type="email"
                        {...demoForm.register("email")}
                        errorMessage={demoForm.formState.errors.email?.message}
                        isInvalid={!!demoForm.formState.errors.email}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Company (Optional)"
                        placeholder="Your company name"
                        {...demoForm.register("company")}
                      />
                      <Input
                        label="Project Type"
                        placeholder="e.g., E-commerce, Dashboard, etc."
                        {...demoForm.register("projectType")}
                        errorMessage={
                          demoForm.formState.errors.projectType?.message
                        }
                        isInvalid={!!demoForm.formState.errors.projectType}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Budget Range (Optional)"
                        placeholder="e.g., $5K - $10K"
                        {...demoForm.register("budget")}
                      />
                      <Input
                        label="Timeline (Optional)"
                        placeholder="e.g., 2-3 months"
                        {...demoForm.register("timeline")}
                      />
                    </div>{" "}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="demo-description"
                      >
                        Project Description
                      </label>
                      <textarea
                        className="w-full p-3 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        id="demo-description"
                        placeholder="Describe your project in detail. What are you looking to build? What features do you need?"
                        rows={6}
                        {...demoForm.register("description")}
                        aria-describedby={
                          demoForm.formState.errors.description
                            ? "demo-description-error"
                            : undefined
                        }
                      />
                      {demoForm.formState.errors.description && (
                        <p
                          className="text-danger text-sm mt-1"
                          id="demo-description-error"
                        >
                          {demoForm.formState.errors.description.message}
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
                      {isSubmitting ? "Submitting..." : "Request Demo & Quote"}
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
