import { PrismaClient } from "@prisma/client";

async function debugPrisma() {
  console.log("=== PRISMA DEBUG SCRIPT ===");

  try {
    // Test 1: Check if PrismaClient imports correctly
    console.log("✓ PrismaClient imported successfully");
    console.log("PrismaClient type:", typeof PrismaClient);

    // Test 2: Try to instantiate Prisma
    const prisma = new PrismaClient();
    console.log("✓ PrismaClient instantiated");
    console.log("Prisma instance type:", typeof prisma);

    // Test 3: Check available models
    console.log("\n=== AVAILABLE MODELS ===");
    const availableModels = Object.keys(prisma as any).filter(
      (key: string) =>
        typeof (prisma as any)[key] === "object" &&
        (prisma as any)[key] !== null &&
        "findMany" in (prisma as any)[key],
    );
    console.log("Available models:", availableModels);

    // Test 4: Check specific models
    console.log("\n=== MODEL CHECKS ===");
    console.log("academic_programs exists:", "academic_programs" in prisma);
    console.log("course exists:", "course" in prisma);
    console.log("portfolio_sections exists:", "portfolio_sections" in prisma);
    console.log("skill exists:", "skill" in prisma);
    console.log("site_settings exists:", "site_settings" in prisma);

    // Test 5: Try a simple query on existing model
    console.log("\n=== TESTING EXISTING MODELS ===");

    if ("contact" in prisma) {
      try {
        const contactCount = await (prisma as any).contact.count();
        console.log("✓ Contact model works, count:", contactCount);
      } catch (error: any) {
        console.log("✗ Contact model error:", error.message);
      }
    }

    if ("user" in prisma) {
      try {
        const userCount = await (prisma as any).user.count();
        console.log("✓ User model works, count:", userCount);
      } catch (error: any) {
        console.log("✗ User model error:", error.message);
      }
    }

    // Test 6: Try the problematic models
    console.log("\n=== TESTING PROBLEMATIC MODELS ===");

    if ("academic_programs" in prisma) {
      try {
        const programCount = await (prisma as any).academic_programs.count();
        console.log("✓ academic_programs model works, count:", programCount);
      } catch (error: any) {
        console.log("✗ academic_programs model error:", error.message);
      }
    } else {
      console.log("✗ academic_programs model not found in prisma instance");
    }

    if ("course" in prisma) {
      try {
        const courseCount = await (prisma as any).course.count();
        console.log("✓ Course model works, count:", courseCount);
      } catch (error: any) {
        console.log("✗ Course model error:", error.message);
      }
    } else {
      console.log("✗ course model not found in prisma instance");
    }

    // Test 7: Database connection
    console.log("\n=== DATABASE CONNECTION ===");
    try {
      await prisma.$connect();
      console.log("✓ Database connection successful");
    } catch (error: any) {
      console.log("✗ Database connection failed:", error.message);
    }

    // Test 8: Raw query test
    console.log("\n=== RAW QUERY TEST ===");
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log("✓ Raw query works:", result);
    } catch (error: any) {
      console.log("✗ Raw query failed:", error.message);
    }

    // Test 9: Check Prisma version
    console.log("\n=== PRISMA INFO ===");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("NODE_ENV:", process.env.NODE_ENV);

    await prisma.$disconnect();
    console.log("\n✓ Debug completed successfully");
  } catch (error: any) {
    console.error("\n✗ Debug failed:", error);
    console.error("Error stack:", error.stack);
  }
}

debugPrisma();
