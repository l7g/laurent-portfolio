#!/usr/bin/env node

/**
 * Environment Check Script
 *
 * Quick script to verify all environment variables are properly configured
 */

import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

console.log("🔍 Environment Configuration Check");
console.log("==================================\n");

const requiredVars = [
  { name: "DATABASE_URL", description: "Development database connection" },
  { name: "PROD_DATABASE_URL", description: "Production database connection" },
  { name: "RESEND_API_KEY", description: "Email service API key" },
  { name: "RESEND_FROM_EMAIL", description: "Verified sender email" },
  { name: "ADMIN_EMAIL", description: "Admin user email" },
  { name: "ADMIN_PASSWORD", description: "Admin user password" },
  { name: "NEXTAUTH_SECRET", description: "Authentication secret" },
];

let allValid = true;

console.log("📋 Checking required environment variables:\n");

for (const { name, description } of requiredVars) {
  const value = process.env[name];
  const status = value ? "✅" : "❌";
  const display = value
    ? name.includes("PASSWORD") || name.includes("SECRET")
      ? "[HIDDEN]"
      : name.includes("URL")
        ? `${value.substring(0, 30)}...`
        : value.length > 50
          ? `${value.substring(0, 30)}...`
          : value
    : "NOT SET";

  console.log(`${status} ${name}`);
  console.log(`   ${description}`);
  console.log(`   Value: ${display}\n`);

  if (!value) {
    allValid = false;
  }
}

if (allValid) {
  console.log("🎉 All environment variables are configured!");
  console.log("✅ Ready for deployment");
} else {
  console.log("❌ Some environment variables are missing");
  console.log("💡 Please check your .env.local file");
  process.exit(1);
}

// Test database connections
console.log("\n🔗 Testing database connections...");

try {
  const { PrismaClient } = await import("@prisma/client");

  // Test development database
  console.log("🧪 Testing development database...");
  const devPrisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

  await devPrisma.$connect();
  console.log("✅ Development database connection successful");
  await devPrisma.$disconnect();

  // Test production database
  console.log("🏭 Testing production database...");
  const prodPrisma = new PrismaClient({
    datasources: { db: { url: process.env.PROD_DATABASE_URL } },
  });

  await prodPrisma.$connect();
  console.log("✅ Production database connection successful");
  await prodPrisma.$disconnect();

  console.log("\n🎯 Environment setup complete!");
  console.log("Ready to proceed with deployment");
} catch (error) {
  console.error("\n❌ Database connection test failed:");
  console.error(error.message);
  console.log("\n💡 Please verify your database URLs are correct");
  process.exit(1);
}
