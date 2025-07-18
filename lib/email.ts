﻿import { Resend } from "resend";

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface EmailData {
  to: string;
  subject: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  position?: string;
  workType?: string;
  timeline?: string;
}

export async function sendContactEmail(data: EmailData) {
  const { to, subject, name, email, message } = data;

  // Return early if Resend is not available (e.g., during build)
  if (!resend) {
    console.log("⚠️ Resend not available - skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  try {
    console.log("📧 Starting sendContactEmail for:", { name, email, to });
    console.log("🔑 Resend API key exists:", !!process.env.RESEND_API_KEY); // Send notification to you
    console.log("📤 Sending notification email to owner:", to);
    const notificationResult = await resend.emails.send({
      from: `Portfolio Contact <${process.env.RESEND_FROM_EMAIL || "contact@mail.laurentgagne.com"}>`, // Your verified domain
      to: [to], // Your email
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            New Portfolio Contact
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Message:</h3>
            <p style="line-height: 1.6; background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
              ${message.replace(/\n/g, "<br>")}
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              This email was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Notification email sent:", {
      success: !!notificationResult.data?.id,
      id: notificationResult.data?.id,
      error: notificationResult.error,
    }); // Send confirmation to the person who contacted you    console.log("📤 Sending confirmation email to user:", email);
    const confirmationResult = await resend.emails.send({
      from: `Laurent Gagné <${process.env.RESEND_NOREPLY_EMAIL || "noreply@mail.laurentgagne.com"}>`,
      to: [email],
      subject: "Thank you for reaching out - Laurent Gagné",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            Thank You for Your Message!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out through my portfolio! I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
          </div>
            <p>I typically respond within 24-48 hours. Looking forward to connecting with you!</p>
          
          <p>Best regards,<br>
          <strong>Laurent Gagné</strong><br>
          Full-Stack Developer</p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              You can also reach me directly at: laurentgagne.dev@pm.me
            </p>
            <p style="color: #666; font-size: 12px;">
              Your contact information is stored securely and will only be used to respond to your inquiry. 
              View our <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #f59e0b;">Privacy Policy</a> for more details.
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Confirmation email result:", {
      success: !!confirmationResult.data?.id,
      id: confirmationResult.data?.id,
      error: confirmationResult.error,
    });

    // Check for any errors in either email
    const hasErrors = notificationResult.error || confirmationResult.error;

    if (hasErrors) {
      console.warn("⚠️ Some emails had errors:", {
        notificationError: notificationResult.error,
        confirmationError: confirmationResult.error,
      });
    }

    // Return comprehensive results
    return {
      success: true,
      notificationId: notificationResult.data?.id,
      confirmationId: confirmationResult.data?.id,
      notificationError: notificationResult.error,
      confirmationError: confirmationResult.error,
    };
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendWorkInquiryEmail(data: EmailData) {
  const { to, name, email, message, company, position, workType, timeline } =
    data;

  // Return early if Resend is not available (e.g., during build)
  if (!resend) {
    console.log("⚠️ Resend not available - skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  console.log("📧 sendWorkInquiryEmail called with:", {
    to,
    name,
    email,
    company,
  });
  console.log("🔑 Resend API key exists:", !!process.env.RESEND_API_KEY);

  try {
    // Send work inquiry notification to you
    console.log("📤 Sending work inquiry email to owner:", to);
    const notificationResult = await resend.emails.send({
      from: `Work Inquiry <${process.env.RESEND_FROM_EMAIL || "contact@mail.laurentgagne.com"}>`,
      to: [to],
      subject: `Work Opportunity: ${company || "New Inquiry"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            New Work Opportunity
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Contact:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || "Not specified"}</p>
            <p><strong>Position:</strong> ${position || "Not specified"}</p>
            <p><strong>Work Type:</strong> ${workType || "Not specified"}</p>
            <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Opportunity Details:</h3>
            <p style="line-height: 1.6; background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
              ${message.replace(/\n/g, "<br>")}
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              This is a work inquiry from your portfolio.
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Work inquiry notification sent:", {
      success: !!notificationResult.data?.id,
      id: notificationResult.data?.id,
      error: notificationResult.error,
    }); // Send confirmation to the company/person
    console.log("📤 Sending confirmation email to inquirer:", email);
    const confirmationResult = await resend.emails.send({
      from: `Laurent Gagné <${process.env.RESEND_NOREPLY_EMAIL || "noreply@mail.laurentgagne.com"}>`,
      to: [email],
      subject: "Work Inquiry Received - Laurent Gagné",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            Thank You for Your Interest!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for considering me for this opportunity! I've received your work inquiry and am excited to learn more about the position.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Inquiry:</h3>
            <p><strong>Company:</strong> ${company || "Not specified"}</p>
            <p><strong>Position:</strong> ${position || "Not specified"}</p>
            <p><strong>Work Type:</strong> ${workType || "Not specified"}</p>
          </div>
            <p>I'll review the details and get back to you within 24 hours to discuss how I can contribute to your team.</p>
          
          <p>Best regards,<br>
          <strong>Laurent Gagné</strong><br>
          Full-Stack Developer</p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Direct contact: laurentgagne.dev@pm.me
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Work inquiry confirmation result:", {
      success: !!confirmationResult.data?.id,
      id: confirmationResult.data?.id,
      error: confirmationResult.error,
    });

    // Check for any errors in either email
    const hasErrors = notificationResult.error || confirmationResult.error;

    if (hasErrors) {
      console.warn("⚠️ Some work inquiry emails had errors:", {
        notificationError: notificationResult.error,
        confirmationError: confirmationResult.error,
      });
    }

    return {
      success: true,
      notificationId: notificationResult.data?.id,
      confirmationId: confirmationResult.data?.id,
      notificationError: notificationResult.error,
      confirmationError: confirmationResult.error,
    };
  } catch (error) {
    console.error("❌ Work inquiry email failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendCommentNotification(data: {
  postTitle: string;
  postSlug: string;
  commentAuthor: string;
  commentEmail: string;
  commentContent: string;
  commentWebsite?: string;
  isApproved: boolean;
}) {
  const {
    postTitle,
    postSlug,
    commentAuthor,
    commentEmail,
    commentContent,
    commentWebsite,
    isApproved,
  } = data;

  // Return early if Resend is not available (e.g., during build)
  if (!resend) {
    console.log("⚠️ Resend not available - skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  try {
    console.log("📧 Sending comment notification for post:", postTitle);

    const notificationResult = await resend.emails.send({
      from: `Blog Comments <${process.env.RESEND_FROM_EMAIL || "comments@mail.laurentgagne.com"}>`,
      to: [
        process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
          "laurentgagne.portfolio@gmail.com",
      ],
      subject: `${isApproved ? "New Comment" : "Comment Pending Approval"}: ${postTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            ${isApproved ? "✅ New Comment Posted" : "⏳ Comment Pending Approval"}
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Post:</strong> ${postTitle}</p>
            <p><strong>Author:</strong> ${commentAuthor}</p>
            <p><strong>Email:</strong> ${commentEmail}</p>
            ${commentWebsite ? `<p><strong>Website:</strong> ${commentWebsite}</p>` : ""}
            <p><strong>Status:</strong> ${isApproved ? "✅ Auto-approved" : "⏳ Pending review"}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Comment:</h3>
            <div style="line-height: 1.6; background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${isApproved ? "#10b981" : "#f59e0b"};">
              ${commentContent.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}" 
               style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              View Post & Comments
            </a>
            ${
              !isApproved
                ? `
            <br><br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/blog/comments" 
               style="background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Review in Admin Panel
            </a>
            `
                : ""
            }
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              ${
                isApproved
                  ? "This comment was automatically approved and is now live on your blog."
                  : "This comment requires your approval before appearing on the blog."
              }
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Comment notification sent:", {
      success: !!notificationResult.data?.id,
      id: notificationResult.data?.id,
      error: notificationResult.error,
    });

    return {
      success: !!notificationResult.data?.id,
      id: notificationResult.data?.id,
      error: notificationResult.error,
    };
  } catch (error) {
    console.error("❌ Comment notification failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
