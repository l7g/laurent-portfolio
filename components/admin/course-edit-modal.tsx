"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import {
  PlusIcon,
  TrashIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import React from "react";

interface Course {
  id?: string;
  code: string;
  title: string;
  description?: string;
  credits: number;
  programId?: string;
  year: number;
  semester: string;
  objectives: string[];
  topics: string[];
  prerequisites: string[];
  status: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  instructor?: string;
  instructorBio?: string;
  officeHours?: string;
  syllabus?: string;
  textbooks: string[];
  resources: string[];
  isPublic: boolean;
  featured: boolean;
  sortOrder: number;
  skillsDelivered?: string[];
  assessments?: any[];
  blogPosts?: any[];
  program?: {
    id: string;
    name: string;
    degree: string;
  };
}

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course;
  onSave: (courseData: Course) => void;
  academic_programss: any[];
}

const courseStatuses = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DEFERRED", label: "Deferred" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

const semesters = [
  { value: "Fall", label: "Fall" },
  { value: "Spring", label: "Spring" },
  { value: "Summer", label: "Summer" },
  { value: "Year-long", label: "Year-long" },
];

const gradeOptions = [
  { value: "A+", label: "A+ (90-100%)" },
  { value: "A", label: "A (85-89%)" },
  { value: "A-", label: "A- (80-84%)" },
  { value: "B+", label: "B+ (75-79%)" },
  { value: "B", label: "B (70-74%)" },
  { value: "B-", label: "B- (65-69%)" },
  { value: "C+", label: "C+ (60-64%)" },
  { value: "C", label: "C (55-59%)" },
  { value: "C-", label: "C- (50-54%)" },
  { value: "D", label: "D (40-49%)" },
  { value: "F", label: "F (0-39%)" },
  { value: "Pass", label: "Pass" },
  { value: "Fail", label: "Fail" },
  { value: "Incomplete", label: "Incomplete" },
];

// Skills that courses can develop, categorized
const availableSkills = {
  "International Relations": [
    "Diplomatic Theory",
    "International Law",
    "Global Governance",
    "Conflict Resolution",
    "International Security",
    "Economic Diplomacy",
    "Foreign Policy Analysis",
    "International Organizations",
    "Comparative Politics",
    "Regional Studies",
    "Geopolitics",
    "International Trade",
    "Human Rights",
    "Peace Studies",
    "Development Studies",
  ],
  "Academic Skills": [
    "Research Methods",
    "Critical Thinking",
    "Academic Writing",
    "Data Analysis",
    "Literature Review",
    "Citation & Referencing",
    "Presentation Skills",
    "Essay Writing",
    "Report Writing",
    "Thesis Development",
    "Peer Review",
    "Time Management",
    "Information Literacy",
    "Argumentation",
    "Synthesis",
  ],
  "Language & Communication": [
    "English Proficiency",
    "Professional Communication",
    "Public Speaking",
    "Debate",
    "Negotiation",
    "Cross-cultural Communication",
    "Media Communication",
    "Technical Writing",
    "Journalism",
    "Translation",
    "Interpretation",
  ],
  "Analytical Skills": [
    "Statistical Analysis",
    "Quantitative Methods",
    "Qualitative Analysis",
    "Policy Analysis",
    "Risk Assessment",
    "Scenario Planning",
    "Comparative Analysis",
    "Case Study Analysis",
    "SWOT Analysis",
    "Decision Making",
    "Problem Solving",
  ],
};

export default function CourseEditModal({
  isOpen,
  onClose,
  course,
  onSave,
  academic_programss,
}: CourseEditModalProps) {
  const [formData, setFormData] = useState<Course>({
    code: "",
    title: "",
    description: "",
    credits: 15,
    programId: "",
    year: 1,
    semester: "Fall",
    objectives: [],
    topics: [],
    prerequisites: [],
    status: "UPCOMING",
    startDate: "",
    endDate: "",
    grade: "",
    instructor: "",
    instructorBio: "",
    officeHours: "",
    syllabus: "",
    textbooks: [],
    resources: [],
    isPublic: true,
    featured: false,
    sortOrder: 0,
    skillsDelivered: [],
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [newObjective, setNewObjective] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newTextbook, setNewTextbook] = useState("");
  const [newResource, setNewResource] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState(
    "International Relations",
  );

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        startDate: course.startDate ? course.startDate.split("T")[0] : "",
        endDate: course.endDate ? course.endDate.split("T")[0] : "",
        skillsDelivered: course.skillsDelivered || [],
      });
    } else {
      setFormData({
        code: "",
        title: "",
        description: "",
        credits: 15,
        programId: academic_programss[0]?.id || "",
        year: 1,
        semester: "Fall",
        objectives: [],
        topics: [],
        prerequisites: [],
        status: "UPCOMING",
        startDate: "",
        endDate: "",
        grade: "",
        instructor: "",
        instructorBio: "",
        officeHours: "",
        syllabus: "",
        textbooks: [],
        resources: [],
        isPublic: true,
        featured: false,
        sortOrder: 0,
        skillsDelivered: [],
      });
    }
  }, [course, academic_programss]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.code) {
      alert("Title and code are required");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const generateCourseCode = (title: string) => {
    // Simple course code generation based on title
    const words = title.split(" ");
    const prefix = words[0].substring(0, 3).toUpperCase();
    const year = formData.year;
    const number = Math.floor(Math.random() * 900) + 100;
    return `${prefix}${year}${number}`;
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      code: !course ? generateCourseCode(value) : prev.code,
    }));
  };

  const addArrayItem = (
    field: keyof Course,
    value: string,
    setter: (value: string) => void,
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
      setter("");
    }
  };

  const removeArrayItem = (field: keyof Course, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skillsDelivered?.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skillsDelivered: [...(prev.skillsDelivered || []), skill],
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsDelivered: (prev.skillsDelivered || []).filter((s) => s !== skill),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {course ? "Edit Course" : "Create New Course"}
              </h3>
              <p className="text-sm text-default-600">
                {course
                  ? "Update course information and settings"
                  : "Add a new course to your academic program"}
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="px-6">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="w-full"
          >
            <Tab key="basic" title="Basic Info">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Course Title"
                    placeholder="Introduction to International Relations"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    isRequired
                  />

                  <Input
                    label="Course Code"
                    placeholder="IR101"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    description="Unique identifier for the course"
                    isRequired
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Course description and overview"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Academic Program
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.programId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          programId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Program</option>
                      {academic_programss.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Credits"
                    type="number"
                    placeholder="15"
                    value={formData.credits.toString()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        credits: parseInt(e.target.value) || 15,
                      }))
                    }
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Year
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          year: parseInt(e.target.value),
                        }))
                      }
                    >
                      {[1, 2, 3, 4].map((year) => (
                        <option key={year} value={year}>
                          Year {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Semester
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          semester: e.target.value,
                        }))
                      }
                    >
                      {semesters.map((semester) => (
                        <option key={semester.value} value={semester.value}>
                          {semester.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      {courseStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.status === "COMPLETED" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Grade
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.grade}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            grade: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Grade</option>
                        {gradeOptions.map((grade) => (
                          <option key={grade.value} value={grade.value}>
                            {grade.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />

                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center gap-6">
                  <Switch
                    isSelected={formData.isPublic}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, isPublic: value }))
                    }
                  >
                    <span className="text-sm">Public Course</span>
                  </Switch>

                  <Switch
                    isSelected={formData.featured}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, featured: value }))
                    }
                  >
                    <span className="text-sm">Featured Course</span>
                  </Switch>
                </div>
              </div>
            </Tab>

            <Tab key="academic" title="Academic Details">
              <div className="space-y-6">
                {/* Learning Objectives */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Learning Objectives
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add learning objective..."
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          addArrayItem(
                            "objectives",
                            newObjective,
                            setNewObjective,
                          )
                        }
                      />
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() =>
                          addArrayItem(
                            "objectives",
                            newObjective,
                            setNewObjective,
                          )
                        }
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.objectives.map((objective, index) => (
                        <Chip
                          key={index}
                          color="primary"
                          variant="flat"
                          onClose={() => removeArrayItem("objectives", index)}
                        >
                          {objective}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Topics Covered */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Topics Covered
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add topic..."
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          addArrayItem("topics", newTopic, setNewTopic)
                        }
                      />
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() =>
                          addArrayItem("topics", newTopic, setNewTopic)
                        }
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.topics.map((topic, index) => (
                        <Chip
                          key={index}
                          color="secondary"
                          variant="flat"
                          onClose={() => removeArrayItem("topics", index)}
                        >
                          {topic}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Prerequisites
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add prerequisite..."
                        value={newPrerequisite}
                        onChange={(e) => setNewPrerequisite(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          addArrayItem(
                            "prerequisites",
                            newPrerequisite,
                            setNewPrerequisite,
                          )
                        }
                      />
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() =>
                          addArrayItem(
                            "prerequisites",
                            newPrerequisite,
                            setNewPrerequisite,
                          )
                        }
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.prerequisites.map((prerequisite, index) => (
                        <Chip
                          key={index}
                          color="warning"
                          variant="flat"
                          onClose={() =>
                            removeArrayItem("prerequisites", index)
                          }
                        >
                          {prerequisite}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills Delivered */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Skills Delivered
                  </label>
                  <p className="text-sm text-default-600 mb-4">
                    Select the skills that students will develop through this
                    course. These will be reflected in the homepage skills
                    section.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Skill Category
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedSkillCategory}
                        onChange={(e) =>
                          setSelectedSkillCategory(e.target.value)
                        }
                      >
                        {Object.keys(availableSkills).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Available Skills</h4>
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                          {availableSkills[
                            selectedSkillCategory as keyof typeof availableSkills
                          ]?.map((skill) => (
                            <button
                              key={skill}
                              onClick={() => addSkill(skill)}
                              disabled={formData.skillsDelivered?.includes(
                                skill,
                              )}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                formData.skillsDelivered?.includes(skill)
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Selected Skills</h4>
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                          {formData.skillsDelivered?.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                              No skills selected
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {formData.skillsDelivered?.map((skill) => (
                                <div
                                  key={skill}
                                  className="flex items-center justify-between bg-primary/10 text-primary px-3 py-2 rounded-lg"
                                >
                                  <span className="text-sm">{skill}</span>
                                  <button
                                    onClick={() => removeSkill(skill)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab key="instructor" title="Instructor & Resources">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Instructor Name"
                    placeholder="Dr. Jane Smith"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instructor: e.target.value,
                      }))
                    }
                  />

                  <Input
                    label="Office Hours"
                    placeholder="Mondays 2-4 PM, Wednesdays 10-12 PM"
                    value={formData.officeHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        officeHours: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Instructor Bio
                  </label>
                  <textarea
                    placeholder="Brief instructor biography and qualifications"
                    value={formData.instructorBio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instructorBio: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <Input
                  label="Syllabus URL"
                  placeholder="https://example.com/syllabus.pdf"
                  value={formData.syllabus}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      syllabus: e.target.value,
                    }))
                  }
                />

                {/* Textbooks */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Required Textbooks
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add textbook..."
                        value={newTextbook}
                        onChange={(e) => setNewTextbook(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          addArrayItem("textbooks", newTextbook, setNewTextbook)
                        }
                      />
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() =>
                          addArrayItem("textbooks", newTextbook, setNewTextbook)
                        }
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.textbooks.map((textbook, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          <span className="text-sm">{textbook}</span>
                          <button
                            onClick={() => removeArrayItem("textbooks", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Additional Resources
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add resource..."
                        value={newResource}
                        onChange={(e) => setNewResource(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          addArrayItem("resources", newResource, setNewResource)
                        }
                      />
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() =>
                          addArrayItem("resources", newResource, setNewResource)
                        }
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          <span className="text-sm">{resource}</span>
                          <button
                            onClick={() => removeArrayItem("resources", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            {course ? "Update Course" : "Create Course"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
