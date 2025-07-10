import { title } from "@/components/primitives";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className={title({ size: "lg" })}>Privacy Policy</h1>
      <p className="text-default-500 mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h2>Information We Collect</h2>
        <h3>Information You Provide</h3>
        <ul>
          <li>
            <strong>Contact Forms:</strong> When you contact us, we collect your
            name and email address to respond to your inquiry.
          </li>
          <li>
            <strong>Comments:</strong> When you comment on blog posts, we
            collect your name, email, and comment content.
          </li>
        </ul>

        <h3>Information Automatically Collected</h3>
        <ul>
          <li>
            <strong>Browser Storage:</strong> We use localStorage to remember
            your preferences (like which posts you've liked) without tracking
            your identity.
          </li>
          <li>
            <strong>Usage Data:</strong> Basic website analytics to improve our
            content and user experience.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to your contact inquiries</li>
          <li>To display and manage blog comments</li>
          <li>To improve our website and content</li>
          <li>To ensure website security and prevent spam</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <ul>
          <li>
            Your data is stored securely using industry-standard practices
          </li>
          <li>
            We do not sell, trade, or share your personal information with third
            parties
          </li>
          <li>Comments require approval before being displayed publicly</li>
          <li>
            Like preferences are stored only in your browser, not on our servers
          </li>
        </ul>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we have about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Clear your browser's stored preferences at any time</li>
        </ul>

        <h2>Cookies and Local Storage</h2>
        <p>We use browser localStorage to:</p>
        <ul>
          <li>
            Remember which posts you've liked (stored locally, not tracked)
          </li>
          <li>Prevent spam by rate-limiting interactions</li>
        </ul>
        <p>You can clear this data anytime by:</p>
        <ul>
          <li>Clearing your browser's local storage</li>
          <li>
            Running <code>clearAllLikes()</code> in your browser console
          </li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>This website may use:</p>
        <ul>
          <li>
            <strong>Vercel:</strong> For hosting and performance analytics
          </li>
          <li>
            <strong>Resend:</strong> For sending contact form emails
          </li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>
          This website is not directed to children under 13. We do not knowingly
          collect personal information from children under 13.
        </p>

        <h2>Data Controller</h2>
        <p>The data controller for this website is:</p>
        <ul>
          <li>
            <strong>Name:</strong> Laurent Gagné
          </li>
          <li>
            <strong>Email:</strong> laurentgagne.portfolio@gmail.com
          </li>
          <li>
            <strong>Location:</strong> Italy
          </li>
        </ul>

        <h2>Legal Basis for Processing</h2>
        <p>We process your personal data based on:</p>
        <ul>
          <li>
            <strong>Consent:</strong> For localStorage preferences and analytics
            (Article 6(1)(a) GDPR)
          </li>
          <li>
            <strong>Legitimate Interest:</strong> For contact form responses and
            website security (Article 6(1)(f) GDPR)
          </li>
        </ul>

        <h2>Data Retention</h2>
        <ul>
          <li>
            <strong>Contact inquiries:</strong> Retained for 2 years or until
            resolved
          </li>
          <li>
            <strong>Comments:</strong> Retained while the blog post exists
          </li>
          <li>
            <strong>Browser preferences:</strong> Stored locally until you clear
            them
          </li>
        </ul>

        <h2>Your GDPR Rights</h2>
        <p>Under GDPR, you have the right to:</p>
        <ul>
          <li>
            <strong>Access:</strong> Request a copy of your personal data
          </li>
          <li>
            <strong>Rectification:</strong> Correct inaccurate data
          </li>
          <li>
            <strong>Erasure:</strong> Request deletion of your data
          </li>
          <li>
            <strong>Portability:</strong> Receive your data in a structured
            format
          </li>
          <li>
            <strong>Object:</strong> Object to processing based on legitimate
            interests
          </li>
          <li>
            <strong>Withdraw consent:</strong> Revoke consent at any time
          </li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify
          you of any changes by posting the new policy on this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or want to
          exercise your GDPR rights, please contact us at:
        </p>
        <p>Email: laurentgagne.portfolio@gmail.com</p>
        <p>
          We will respond to your request within 30 days as required by GDPR.
        </p>

        <h2>Manage Your Consent</h2>
        <p>
          You can change your consent preferences at any time by visiting our{" "}
          <a href="/consent" className="text-primary underline">
            Consent Management page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
