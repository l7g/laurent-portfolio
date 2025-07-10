import { title } from "@/components/primitives";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className={title({ size: "lg" })}>Terms of Service</h1>
      <p className="text-default-500 mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>

        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily view the materials on Laurent's
          Portfolio for personal, non-commercial transitory viewing only. This
          is the grant of a license, not a transfer of title, and under this
          license you may not:
        </p>
        <ul>
          <li>modify or copy the materials</li>
          <li>
            use the materials for any commercial purpose or for any public
            display (commercial or non-commercial)
          </li>
          <li>
            attempt to decompile or reverse engineer any software contained on
            the website
          </li>
          <li>
            remove any copyright or other proprietary notations from the
            materials
          </li>
        </ul>

        <h2>Content</h2>
        <h3>User-Generated Content</h3>
        <ul>
          <li>You are responsible for the content you post in comments</li>
          <li>Comments must be respectful and appropriate</li>
          <li>
            We reserve the right to remove any content that violates these terms
          </li>
          <li>Spam, harassment, or inappropriate content will be removed</li>
          <li>
            By submitting comments, you consent to email notifications being
            sent to the site administrator
          </li>
          <li>
            Comments are moderated and may require approval before appearing
            publicly
          </li>
        </ul>

        <h3>Website Content</h3>
        <ul>
          <li>
            All content on this website is the intellectual property of Laurent
            Gagné unless otherwise stated
          </li>
          <li>
            Blog posts, projects, and other original content may not be
            reproduced without permission
          </li>
          <li>
            Code examples may be used for educational purposes with proper
            attribution
          </li>
        </ul>

        <h2>Disclaimer</h2>
        <p>
          The materials on this website are provided on an 'as is' basis.
          Laurent's Portfolio makes no warranties, expressed or implied, and
          hereby disclaims and negates all other warranties including without
          limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights.
        </p>

        <h2>Limitations</h2>
        <p>
          In no event shall Laurent's Portfolio or its suppliers be liable for
          any damages (including, without limitation, damages for loss of data
          or profit, or due to business interruption) arising out of the use or
          inability to use the materials on this website, even if Laurent's
          Portfolio or its authorized representative has been notified orally or
          in writing of the possibility of such damage.
        </p>

        <h2>Accuracy of Materials</h2>
        <p>
          The materials appearing on this website could include technical,
          typographical, or photographic errors. Laurent's Portfolio does not
          warrant that any of the materials on its website are accurate,
          complete, or current.
        </p>

        <h2>Links</h2>
        <p>
          Laurent's Portfolio has not reviewed all of the sites linked to our
          website and is not responsible for the contents of any such linked
          site. The inclusion of any link does not imply endorsement by
          Laurent's Portfolio of the site.
        </p>

        <h2>Modifications</h2>
        <p>
          Laurent's Portfolio may revise these terms of service for its website
          at any time without notice. By using this website, you are agreeing to
          be bound by the then current version of these terms of service.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with the laws of Canada and you irrevocably submit to the exclusive
          jurisdiction of the courts in that state or location.
        </p>

        <h2>Email Communications</h2>
        <ul>
          <li>
            We may send you emails related to your interactions with the website
            (such as comment confirmations)
          </li>
          <li>
            By using our contact form or commenting system, you consent to
            receive relevant email communications
          </li>
          <li>
            We use Resend as our email service provider to deliver these
            communications
          </li>
          <li>
            Email communications are sent for legitimate business purposes only
          </li>
        </ul>

        <h2>Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us at:
        </p>
        <p>Email: laurentgagne.portfolio@gmail.com</p>
      </div>
    </div>
  );
}
