require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const prisma = new PrismaClient();

async function deploymentSeed() {
  try {
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Admin";

    if (!adminEmail || !adminPassword) {
      console.log(
        "⚠️  ADMIN_EMAIL and ADMIN_PASSWORD environment variables required for deployment",
      );
      console.log("⚠️  Skipping admin user creation");
      return;
    }

    // Check if admin already exists
    const existingAdmin = await prisma.users.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: adminEmail,
        name: adminName,
        role: "ADMIN",
        password: hashedPassword,
      },
    });

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  deploymentSeed();
}

module.exports = { deploymentSeed };
