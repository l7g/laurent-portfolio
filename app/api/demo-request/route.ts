import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { prisma } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, projectType, budget, timeline, description } =
      body;

    // Validate required fields
    if (!name || !email || !projectType || !description) {
      return NextResponse.json(
        { error: "Name, email, project type, and description are required" },
        { status: 400 },
      );
    }

    // Save to database
    const demoRequest = await prisma.demoRequest.create({
      data: {
        name,
        email,
        company,
        projectType,
        budget,
        timeline,
        description,
      },
    });

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_FROM, // Send to yourself
        subject: `New Demo Request: ${projectType}`,
        html: `
          <h2>New Demo Request Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not specified"}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Budget:</strong> ${budget || "Not specified"}</p>
          <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
          <p><strong>Description:</strong></p>
          <p>${description.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
      });

      // Send confirmation email to sender
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Demo Request Received - Let's Build Something Amazing!",
        html: `
          <h2>Thank you for your demo request!</h2>
          <p>Hi ${name},</p>
          <p>I've received your demo request for a <strong>${projectType}</strong> project and I'm excited to learn more about your vision!</p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>I'll review your project details within 24 hours</li>
            <li>I'll prepare a custom demo showcasing relevant features</li>
            <li>We'll schedule a call to discuss your specific needs</li>
            <li>You'll receive a detailed proposal with timeline and pricing</li>
          </ul>
          
          <p><strong>Your Project Summary:</strong></p>
          <p><em>"${description}"</em></p>
          
          <p>In the meantime, feel free to check out my featured project, Tracker, which demonstrates my expertise in building complex data-driven applications.</p>
          
          <p>Looking forward to bringing your ideas to life!</p>
          
          <p>Best regards,<br>Laurent</p>
        `,
      });
    } catch (emailError) {
      // Continue even if email fails - we still saved to database
      void emailError; // Suppress unused variable warning
    }

    return NextResponse.json(
      { message: "Demo request submitted successfully", id: demoRequest.id },
      { status: 201 },
    );
  } catch (error) {
    void error; // Suppress unused variable warning

    return NextResponse.json(
      { error: "Failed to submit demo request" },
      { status: 500 },
    );
  }
}
