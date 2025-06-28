import { NextRequest, NextResponse } from "next/server";

import { sendWorkInquiryEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, position, workType, timeline, description } =
      body;

    // Debug logging
    console.log("🔍 Environment check:");
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("CONTACT_EMAIL:", process.env.NEXT_PUBLIC_CONTACT_EMAIL);
    console.log("🔍 Form data received:", { name, email, company, workType });

    // Validate required fields
    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and description are required" },
        { status: 400 },
      );
    }

    // Save to database
    const demoRequest = await prisma.demoRequest.create({
      data: {
        name,
        email,
        company: company || null,
        projectType: workType || null,
        budget: null, // Not used in work inquiries
        timeline: timeline || null,
        description,
      },
    });

    // Send email using Resend
    console.log("📧 Attempting to send email...");
    const emailResult = await sendWorkInquiryEmail({
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "laurentgagne.dev@pm.me",
      subject: `Work Inquiry from ${company || name}`,
      name,
      email,
      message: description,
      company,
      position,
      workType,
      timeline,
    });

    console.log("📧 Email results:", {
      emailSuccess: emailResult.success,
      notificationSent: !!emailResult.notificationId,
      confirmationSent: !!emailResult.confirmationId,
      notificationError: emailResult.notificationError,
      confirmationError: emailResult.confirmationError,
    });

    if (!emailResult.success) {
      console.error("❌ Work inquiry email failed:", emailResult.error);
      // Continue anyway - inquiry is saved to database
    } else if (emailResult.notificationError || emailResult.confirmationError) {
      console.warn("⚠️ Some work inquiry emails had issues:", {
        notification: emailResult.notificationError ? "Failed" : "Success",
        confirmation: emailResult.confirmationError ? "Failed" : "Success",
      });
    }

    return NextResponse.json(
      { message: "Work inquiry submitted successfully", id: demoRequest.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Work inquiry error:", error);

    return NextResponse.json(
      { error: "Failed to submit work inquiry" },
      { status: 500 },
    );
  }
}
