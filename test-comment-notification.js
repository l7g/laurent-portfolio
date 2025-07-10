// Quick test for comment notifications - run this in Node.js console

import { sendCommentNotification } from "../lib/email.js";

// Test the notification
sendCommentNotification({
  postTitle: "Test Blog Post",
  postSlug: "test-blog-post",
  commentAuthor: "John Doe",
  commentEmail: "john@example.com",
  commentContent: "This is a test comment to verify notifications work!",
  commentWebsite: "https://johndoe.com",
  isApproved: true,
})
  .then((result) => {
    console.log("Test result:", result);
  })
  .catch((error) => {
    console.error("Test failed:", error);
  });
