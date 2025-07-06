import { PrismaClient, CourseStatus } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function seedCourses() {
  try {
    // Get the academic program
    const program = await prisma.academic_programs.findFirst();
    if (!program) {
      console.error("No academic program found. Please create one first.");
      return;
    }

    // Sample courses for BSc International Relations
    const courses = [
      // Year 1 Courses
      {
        code: "IR101",
        title: "Introduction to International Relations",
        description:
          "An introduction to the fundamental concepts, theories, and issues in international relations.",
        credits: 15,
        year: 1,
        semester: "Fall",
        objectives: [
          "Understand key theories of international relations",
          "Analyze major historical events in IR",
          "Develop critical thinking about global politics",
        ],
        topics: [
          "Realism and Liberalism",
          "The Cold War",
          "International Organizations",
          "Globalization",
        ],
        prerequisites: [],
        status: "UPCOMING",
        skillsDelivered: [
          "Critical Analysis",
          "Research Methods",
          "Global Awareness",
          "Political Theory",
        ],
        instructor: "Dr. Sarah Johnson",
        instructorBio:
          "Professor of International Relations with 15 years of experience",
        officeHours: "Monday 2-4 PM",
        textbooks: [
          "Introduction to International Relations by Jackson & Sorensen",
        ],
        resources: ["Foreign Affairs Magazine", "UN Documents"],
        isPublic: true,
        featured: true,
        programId: program.id,
      },
      {
        code: "POLS105",
        title: "Comparative Politics",
        description:
          "Introduction to comparative political analysis and different political systems.",
        credits: 15,
        year: 1,
        semester: "Fall",
        objectives: [
          "Compare different political systems",
          "Understand democratic transitions",
          "Analyze political institutions",
        ],
        topics: [
          "Democracy vs Authoritarianism",
          "Political Parties",
          "Electoral Systems",
          "Federalism",
        ],
        prerequisites: [],
        status: "UPCOMING",
        skillsDelivered: [
          "Comparative Analysis",
          "Political Science",
          "Institutional Analysis",
          "Research Methods",
        ],
        instructor: "Dr. Michael Chen",
        instructorBio:
          "Comparative politics specialist with focus on Asian democracies",
        officeHours: "Tuesday 10-12 PM",
        textbooks: ["Comparative Politics by Caramani"],
        resources: ["Freedom House Reports", "V-Dem Database"],
        isPublic: true,
        featured: false,
        programId: program.id,
      },
      {
        code: "ECON110",
        title: "International Economics",
        description:
          "Economic principles applied to international trade and finance.",
        credits: 15,
        year: 1,
        semester: "Spring",
        objectives: [
          "Understand international trade theory",
          "Analyze exchange rates and monetary policy",
          "Examine economic integration",
        ],
        topics: [
          "Trade Theory",
          "Exchange Rates",
          "International Monetary System",
          "Economic Integration",
        ],
        prerequisites: [],
        status: "UPCOMING",
        skillsDelivered: [
          "Economic Analysis",
          "Quantitative Methods",
          "Financial Literacy",
          "Data Interpretation",
        ],
        instructor: "Dr. Emma Rodriguez",
        instructorBio: "International economist with World Bank experience",
        officeHours: "Wednesday 1-3 PM",
        textbooks: ["International Economics by Krugman"],
        resources: ["World Bank Data", "IMF Reports"],
        isPublic: true,
        featured: false,
        programId: program.id,
      },
      {
        code: "HIST120",
        title: "Modern World History",
        description:
          "Historical foundations of the contemporary international system.",
        credits: 15,
        year: 1,
        semester: "Spring",
        objectives: [
          "Understand historical context of current events",
          "Analyze cause and effect in history",
          "Develop historical thinking skills",
        ],
        topics: ["World Wars", "Decolonization", "Cold War", "Globalization"],
        prerequisites: [],
        status: "UPCOMING",
        skillsDelivered: [
          "Historical Analysis",
          "Critical Thinking",
          "Research Skills",
          "Writing Skills",
        ],
        instructor: "Dr. James Wilson",
        instructorBio:
          "Modern historian specializing in 20th century international affairs",
        officeHours: "Thursday 2-4 PM",
        textbooks: ["The Modern World by Palmer"],
        resources: ["Historical Archives", "Primary Source Documents"],
        isPublic: true,
        featured: false,
        programId: program.id,
      },

      // Year 2 Courses
      {
        code: "IR201",
        title: "International Security",
        description:
          "Analysis of security challenges in the contemporary international system.",
        credits: 15,
        year: 2,
        semester: "Fall",
        objectives: [
          "Understand security theories and concepts",
          "Analyze contemporary security challenges",
          "Examine conflict resolution mechanisms",
        ],
        topics: [
          "Security Dilemma",
          "Terrorism",
          "Cyber Security",
          "Nuclear Proliferation",
        ],
        prerequisites: ["IR101"],
        status: "UPCOMING",
        skillsDelivered: [
          "Security Analysis",
          "Risk Assessment",
          "Strategic Thinking",
          "Policy Analysis",
        ],
        instructor: "Dr. Robert Brown",
        instructorBio:
          "Former defense analyst with expertise in security studies",
        officeHours: "Monday 3-5 PM",
        textbooks: ["Security Studies by Williams"],
        resources: ["SIPRI Database", "Defense Journals"],
        isPublic: true,
        featured: true,
        programId: program.id,
      },
      {
        code: "LAW205",
        title: "International Law",
        description:
          "Principles and practice of international law in global governance.",
        credits: 15,
        year: 2,
        semester: "Spring",
        objectives: [
          "Understand international legal principles",
          "Analyze legal case studies",
          "Examine international courts and tribunals",
        ],
        topics: [
          "Treaties and Agreements",
          "Human Rights Law",
          "International Criminal Law",
          "Dispute Resolution",
        ],
        prerequisites: ["IR101"],
        status: "UPCOMING",
        skillsDelivered: [
          "Legal Analysis",
          "International Law",
          "Case Study Analysis",
          "Legal Writing",
        ],
        instructor: "Dr. Lisa Anderson",
        instructorBio: "International lawyer with ICJ experience",
        officeHours: "Friday 10-12 PM",
        textbooks: ["International Law by Shaw"],
        resources: ["ICJ Cases", "UN Treaty Collection"],
        isPublic: true,
        featured: false,
        programId: program.id,
      },
    ];

    // Create courses
    for (const courseData of courses) {
      const course = await prisma.courses.create({
        data: {
          ...courseData,
          id: randomUUID(),
          status: courseData.status as CourseStatus,
          updatedAt: new Date(),
        },
      });
      console.log(`Created course: ${course.code} - ${course.title}`);
    }

    console.log("Course seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding courses:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCourses();
