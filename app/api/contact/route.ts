import { NextRequest, NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    } // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    }); // Send email using Resend
    const emailResult = await sendContactEmail({
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@laurentgagne.com",
      subject,
      name,
      email,
      message,
    });

    console.log("📧 Email results:", {
      emailSuccess: emailResult.success,
      notificationSent: !!emailResult.notificationId,
      confirmationSent: !!emailResult.confirmationId,
      notificationError: emailResult.notificationError,
      confirmationError: emailResult.confirmationError,
    });

    if (!emailResult.success) {
      console.error("❌ Email sending failed:", emailResult.error);
      // Continue anyway - contact is saved to database
    } else if (emailResult.notificationError || emailResult.confirmationError) {
      console.warn("⚠️ Some emails had issues:", {
        notification: emailResult.notificationError ? "Failed" : "Success",
        confirmation: emailResult.confirmationError ? "Failed" : "Success",
      });
    }

    return NextResponse.json(
      { message: "Contact form submitted successfully", id: contact.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
