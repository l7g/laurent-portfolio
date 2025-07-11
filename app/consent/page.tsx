import { title } from "@/components/primitives";
import ConsentManager from "@/components/consent-manager";

export default function ConsentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className={title({ size: "lg" })}>Manage Your Consent</h1>
      <p className="text-default-500 mb-8">
        You can change your consent preferences at any time. This will only
        affect future data collection.
      </p>

      <ConsentManager />

      <div className="mt-8 prose prose-lg dark:prose-invert max-w-none">
        <h2>What This Means</h2>
        <ul>
          <li>
            <strong>Necessary:</strong> Required for basic website functionality
            (always enabled)
          </li>
          <li>
            <strong>Preferences:</strong> Remembers your likes, settings, and
            choices for a better experience
          </li>
          <li>
            <strong>Analytics:</strong> Helps us understand how visitors use our
            site to improve it
          </li>
        </ul>

        <h2>Your Rights</h2>
        <p>You can:</p>
        <ul>
          <li>Change your preferences at any time</li>
          <li>Revoke all consent and clear stored data</li>
          <li>Request deletion of any data we have about you</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          For questions about data processing or to exercise your GDPR rights:
        </p>
        <p>Email: laurentgagne.portfolio@gmail.com</p>
      </div>
    </div>
  );
}
