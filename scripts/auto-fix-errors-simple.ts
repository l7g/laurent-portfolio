import fs from "fs";
import path from "path";
import { glob } from "glob";

console.log("🚀 Auto-fixer script loaded");

class AutoFixer {
  private projectRoot: string;
  private fixedFiles: string[] = [];

  constructor() {
    this.projectRoot = process.cwd();
    console.log("📁 Project root:", this.projectRoot);
  }

  // Fix Prisma model naming issues
  async fixPrismaModelNaming() {
    console.log("🔧 Fixing Prisma model naming issues...");

    const allFiles = await glob("**/*.{ts,tsx,js,jsx}", {
      cwd: this.projectRoot,
      ignore: ["node_modules/**", ".next/**", "dist/**"],
    });

    console.log(`📄 Found ${allFiles.length} files to check`);

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
      const filePath = path.join(this.projectRoot, file);
      let content = fs.readFileSync(filePath, "utf8");
      let modified = false;

      for (const [oldName, newName] of Object.entries(modelMappings)) {
        if (content.includes(oldName)) {
          content = content.replaceAll(oldName, newName);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        this.fixedFiles.push(file);
        console.log(`  ✅ Fixed: ${file}`);
      }
    }
  }

  // Main fix function
  async runAllFixes() {
    console.log("🚀 Starting automatic fixes...\n");

    try {
      await this.fixPrismaModelNaming();

      console.log("\n" + "=".repeat(50));
      console.log("✅ AUTO-FIX COMPLETE!");
      console.log("=".repeat(50));
      console.log(`📁 Fixed ${this.fixedFiles.length} files`);

      if (this.fixedFiles.length > 0) {
        this.fixedFiles.forEach((file) => console.log(`  - ${file}`));
      } else {
        console.log("  - No files needed fixing");
      }
    } catch (error) {
      console.error("❌ Error during auto-fix:", error);
    }
  }
}

// Run the fixes
async function main() {
  console.log("🚀 Auto-fixer starting...");
  const fixer = new AutoFixer();
  await fixer.runAllFixes();
  console.log("✅ Auto-fixer complete!");
}

// Auto-run the fixer
main().catch((error) => {
  console.error("❌ Auto-fixer error:", error);
  process.exit(1);
});

export { AutoFixer };
