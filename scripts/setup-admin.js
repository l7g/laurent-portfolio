const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function askSecretQuestion(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    let password = "";

    process.stdin.on("data", (char) => {
      char = char.toString();

      if (char === "\n" || char === "\r" || char === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "\u0003") {
        process.exit();
      } else if (char === "\b" || char === "\u007f") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        password += char;
        process.stdout.write("*");
      }
    });
  });
}

async function interactiveAdminSetup() {
  try {
    console.log("🔐 Admin User Setup for Production");
    console.log("===================================\n");

    const name = await askQuestion("Admin name: ");
    const email = await askQuestion("Admin email: ");
    const password = await askSecretQuestion("Admin password (hidden): ");

    if (!email || !password) {
      console.log("❌ Email and password are required");
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("⚠️  User with this email already exists");
      const overwrite = await askQuestion("Overwrite existing user? (y/N): ");

      if (overwrite.toLowerCase() !== "y") {
        console.log("❌ Setup cancelled");
        process.exit(0);
      }

      // Delete existing user
      await prisma.user.delete({
        where: { email },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name: name || "Admin",
        role: "ADMIN",
        password: hashedPassword,
      },
    });

    console.log("\n✅ Admin user created successfully!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

interactiveAdminSetup();
