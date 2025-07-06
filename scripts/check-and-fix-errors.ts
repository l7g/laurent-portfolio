import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { glob } from "glob";

const prisma = new PrismaClient();

interface ErrorReport {
  type: string;
  file: string;
  line?: number;
  issue: string;
  suggestion: string;
  severity: "critical" | "high" | "medium" | "low";
}

class ErrorChecker {
  private errors: ErrorReport[] = [];
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  // Check for Next.js 15 params issues
  async checkNextJSParamsIssues() {
    console.log("🔍 Checking Next.js 15 params issues...");

    const apiFiles = await glob("app/api/**/*.ts", { cwd: this.projectRoot });
    const pageFiles = await glob("app/**/page.tsx", { cwd: this.projectRoot });

    for (const file of [...apiFiles, ...pageFiles]) {
      const content = fs.readFileSync(
        path.join(this.projectRoot, file),
        "utf8",
      );

      // Check for old params destructuring in API routes
      const oldParamsPattern =
        /{\s*params\s*}:\s*{\s*params:\s*{\s*\w+:\s*string\s*}\s*}/g;
      let match;
      while ((match = oldParamsPattern.exec(content)) !== null) {
        this.errors.push({
          type: "nextjs-params",
          file,
          issue: "Using old Next.js params destructuring",
          suggestion:
            "Update to: context: { params: Promise<{ id: string }> } and await context.params",
          severity: "critical",
        });
      }

      // Check for missing await params
      if (
        content.includes("params:") &&
        !content.includes("await context.params") &&
        !content.includes("await params")
      ) {
        this.errors.push({
          type: "nextjs-params",
          file,
          issue: "Missing await for params in Next.js 15",
          suggestion:
            "Add: const params = await context.params; after function start",
          severity: "critical",
        });
      }
    }
  }

  // Check for Prisma model naming issues
  async checkPrismaModelNaming() {
    console.log("🔍 Checking Prisma model naming issues...");

    const allFiles = await glob("**/*.{ts,tsx,js,jsx}", {
      cwd: this.projectRoot,
      ignore: ["node_modules/**", ".next/**", "dist/**"],
    });

    // Define old vs new model names
    const modelMappings = {
      "prisma.demo_requests": "prisma.demo_requests",
      "prisma.projects": "prisma.projects",
      "prisma.skills": "prisma.skills",
      "prisma.contacts": "prisma.contacts",
      "prisma.users": "prisma.users",
      "prisma.blog_posts": "prisma.blog_posts",
      "prisma.blog_categories": "prisma.blog_categories",
      "prisma.portfolio_sections": "prisma.portfolio_sections",
      "prisma.portfolio_pages": "prisma.portfolio_pages",
      "prisma.site_settings": "prisma.site_settings",
      "prisma.courses": "prisma.courses",
      "prisma.academic_programs": "prisma.academic_programs",
      "prisma.skillsProgression": "prisma.skill_progressions",
      "prisma.coursesAssessment": "prisma.course_assessments",
    };

    for (const file of allFiles) {
      const content = fs.readFileSync(
        path.join(this.projectRoot, file),
        "utf8",
      );

      for (const [oldName, newName] of Object.entries(modelMappings)) {
        if (content.includes(oldName)) {
          this.errors.push({
            type: "prisma-model-naming",
            file,
            issue: `Using old model name: ${oldName}`,
            suggestion: `Replace with: ${newName}`,
            severity: "high",
          });
        }
      }
    }
  }

  // Check for missing required fields in Prisma operations
  async checkPrismaRequiredFields() {
    console.log("🔍 Checking Prisma required fields...");

    const allFiles = await glob("**/*.{ts,tsx,js,jsx}", {
      cwd: this.projectRoot,
      ignore: ["node_modules/**", ".next/**", "dist/**"],
    });

    for (const file of allFiles) {
      const content = fs.readFileSync(
        path.join(this.projectRoot, file),
        "utf8",
      );

      // Check for create operations without id
      if (content.includes("prisma.") && content.includes(".create({")) {
        const createPattern =
          /prisma\.\w+\.create\(\{[\s\S]*?data:\s*\{[\s\S]*?\}/g;
        let match;
        while ((match = createPattern.exec(content)) !== null) {
          if (!match[0].includes("id:") && !match[0].includes("id,")) {
            this.errors.push({
              type: "prisma-required-fields",
              file,
              issue: "Prisma create operation missing required 'id' field",
              suggestion:
                "Add: id: randomUUID(), to the data object and import { randomUUID } from 'crypto'",
              severity: "high",
            });
          }
        }
      }

      // Check for missing randomUUID import
      if (
        content.includes("randomUUID()") &&
        !content.includes("import") &&
        !content.includes("randomUUID")
      ) {
        this.errors.push({
          type: "missing-import",
          file,
          issue: "Using randomUUID() without import",
          suggestion: "Add: import { randomUUID } from 'crypto';",
          severity: "high",
        });
      }
    }
  }

  // Check for TypeScript compilation errors
  async checkTypeScriptErrors() {
    console.log("🔍 Checking TypeScript compilation...");

    try {
      const { spawn } = require("child_process");
      const tsc = spawn("npx", ["tsc", "--noEmit"], { cwd: this.projectRoot });

      let output = "";
      tsc.stdout.on("data", (data: Buffer) => {
        output += data.toString();
      });

      tsc.stderr.on("data", (data: Buffer) => {
        output += data.toString();
      });

      await new Promise((resolve) => {
        tsc.on("close", (code: number) => {
          if (code !== 0 && output) {
            const lines = output.split("\n");
            for (const line of lines) {
              if (line.includes("error TS")) {
                this.errors.push({
                  type: "typescript-error",
                  file: line.split("(")[0] || "unknown",
                  issue: line,
                  suggestion: "Fix TypeScript error based on message",
                  severity: "critical",
                });
              }
            }
          }
          resolve(code);
        });
      });
    } catch (error) {
      console.warn("Could not run TypeScript check:", error);
    }
  }

  // Check for build errors
  async checkBuildErrors() {
    console.log("🔍 Checking build errors...");

    try {
      const { spawn } = require("child_process");
      const build = spawn("npm", ["run", "build"], { cwd: this.projectRoot });

      let output = "";
      build.stdout.on("data", (data: Buffer) => {
        output += data.toString();
      });

      build.stderr.on("data", (data: Buffer) => {
        output += data.toString();
      });

      await new Promise((resolve) => {
        build.on("close", (code: number) => {
          if (code !== 0) {
            const lines = output.split("\n");
            for (const line of lines) {
              if (
                line.includes("Type error:") ||
                line.includes("Failed to compile")
              ) {
                this.errors.push({
                  type: "build-error",
                  file: "build",
                  issue: line,
                  suggestion: "Fix build error based on message",
                  severity: "critical",
                });
              }
            }
          }
          resolve(code);
        });
      });
    } catch (error) {
      console.warn("Could not run build check:", error);
    }
  }

  // Check database schema consistency
  async checkDatabaseSchema() {
    console.log("🔍 Checking database schema consistency...");

    try {
      // Check if we can connect to database
      await prisma.$connect();

      // Check for common model existence
      const models = [
        "users",
        "blog_posts",
        "blog_categories",
        "contacts",
        "demo_requests",
        "projects",
        "skills",
        "courses",
        "academic_programs",
        "portfolio_sections",
        "portfolio_pages",
        "site_settings",
        "skill_progressions",
        "course_assessments",
      ];

      for (const model of models) {
        try {
          // @ts-ignore - Dynamic model access
          await prisma[model].findFirst();
        } catch (error) {
          this.errors.push({
            type: "database-schema",
            file: "database",
            issue: `Model '${model}' not found or inaccessible`,
            suggestion: `Check if model '${model}' exists in schema.prisma and run 'npx prisma db push'`,
            severity: "critical",
          });
        }
      }
    } catch (error) {
      this.errors.push({
        type: "database-connection",
        file: "database",
        issue: "Cannot connect to database",
        suggestion:
          "Check database connection string and ensure database is running",
        severity: "critical",
      });
    }
  }

  // Check for environment variables
  async checkEnvironmentVariables() {
    console.log("🔍 Checking environment variables...");

    const requiredEnvVars = [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",
      "RESEND_API_KEY",
      "NEXT_PUBLIC_CONTACT_EMAIL",
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        this.errors.push({
          type: "environment-variable",
          file: ".env",
          issue: `Missing required environment variable: ${envVar}`,
          suggestion: `Add ${envVar}=your_value to .env.local`,
          severity: "high",
        });
      }
    }
  }

  // Generate report
  generateReport() {
    console.log("\n" + "=".repeat(60));
    console.log("🔍 ERROR ANALYSIS REPORT");
    console.log("=".repeat(60));

    if (this.errors.length === 0) {
      console.log("✅ No errors found! Your project looks good.");
      return;
    }

    // Group errors by severity
    const groupedErrors = this.errors.reduce(
      (acc, error) => {
        if (!acc[error.severity]) acc[error.severity] = [];
        acc[error.severity].push(error);
        return acc;
      },
      {} as Record<string, ErrorReport[]>,
    );

    // Display by severity
    const severityOrder = ["critical", "high", "medium", "low"] as const;

    for (const severity of severityOrder) {
      const errorGroup = groupedErrors[severity];
      if (!errorGroup || errorGroup.length === 0) continue;

      console.log(
        `\n🚨 ${severity.toUpperCase()} ERRORS (${errorGroup.length}):`,
      );
      console.log("-".repeat(40));

      errorGroup.forEach((error, index) => {
        console.log(`${index + 1}. ${error.type.toUpperCase()}`);
        console.log(`   📁 File: ${error.file}`);
        console.log(`   ❌ Issue: ${error.issue}`);
        console.log(`   💡 Suggestion: ${error.suggestion}`);
        console.log();
      });
    }

    // Summary
    console.log("=".repeat(60));
    console.log("📊 SUMMARY:");
    console.log(`Total errors found: ${this.errors.length}`);
    console.log(`Critical: ${groupedErrors.critical?.length || 0}`);
    console.log(`High: ${groupedErrors.high?.length || 0}`);
    console.log(`Medium: ${groupedErrors.medium?.length || 0}`);
    console.log(`Low: ${groupedErrors.low?.length || 0}`);
    console.log("=".repeat(60));

    // Priority action items
    console.log("\n🎯 PRIORITY ACTION ITEMS:");
    console.log(
      "1. Fix all CRITICAL errors first (these prevent the app from working)",
    );
    console.log("2. Fix HIGH priority errors (these cause runtime issues)");
    console.log("3. Address MEDIUM and LOW priority errors when time permits");
    console.log(
      "\n💡 TIP: Run this script again after fixing errors to track progress!",
    );
  }

  // Main check function
  async runAllChecks() {
    console.log("🚀 Starting comprehensive error check...\n");

    try {
      await this.checkNextJSParamsIssues();
      await this.checkPrismaModelNaming();
      await this.checkPrismaRequiredFields();
      await this.checkEnvironmentVariables();
      await this.checkDatabaseSchema();
      await this.checkTypeScriptErrors();
      await this.checkBuildErrors();

      this.generateReport();
    } catch (error) {
      console.error("❌ Error during checks:", error);
    } finally {
      await prisma.$disconnect();
    }
  }
}

// Run the checks
async function main() {
  const checker = new ErrorChecker();
  await checker.runAllChecks();
}

// Auto-run if this is the main module
main().catch(console.error);

export { ErrorChecker };
