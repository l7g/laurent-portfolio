import { exec } from "child_process";
import { promisify } from "util";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is admin (you can also check against a specific admin email)
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session.user.email !== adminEmail) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Get the action from request body
    const body = await request.json();
    const { action, confirm } = body;

    if (!confirm) {
      return NextResponse.json(
        { error: "Confirmation required. Set confirm: true in request body." },
        { status: 400 },
      );
    }

    let result;
    let command;

    switch (action) {
      case "migrate":
        command = "npx prisma migrate deploy";
        break;
      case "generate":
        command = "npx prisma generate";
        break;
      case "seed":
        command = "npm run seed:deployment-seed";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action. Use: migrate, generate, or seed" },
          { status: 400 },
        );
    }

    console.log(`Admin ${session.user.email} is running: ${command}`);

    // Execute the command
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 60000, // 60 second timeout
    });

    result = {
      success: true,
      action,
      command,
      stdout: stdout || "Command completed successfully",
      stderr: stderr || null,
      timestamp: new Date().toISOString(),
      admin: session.user.email,
    };

    console.log("Migration result:", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Migration error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Migration failed",
        stderr: error.stderr || null,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session.user.email !== adminEmail) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Return available migration actions and their descriptions
    return NextResponse.json({
      availableActions: {
        migrate: {
          command: "npx prisma migrate deploy",
          description: "Deploy pending database migrations",
          warning: "This will modify the database schema. Use with caution!",
        },
        generate: {
          command: "npx prisma generate",
          description: "Regenerate Prisma client",
          warning: "Safe to run anytime",
        },
        seed: {
          command: "npm run seed:deployment-seed",
          description: "Seed missing data (idempotent)",
          warning: "Safe to run anytime",
        },
      },
      usage: {
        endpoint: "/api/admin/migrate",
        method: "POST",
        body: {
          action: "migrate|generate|seed",
          confirm: true,
        },
        example: `
          POST /api/admin/migrate
          {
            "action": "seed",
            "confirm": true
          }
        `,
      },
    });
  } catch (error: any) {
    console.error("Migration info error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to get migration info" },
      { status: 500 },
    );
  }
}
