import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_CONFIG.name} - how we handle your data.`,
};

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-primary max-w-none space-y-8">
          <p className="text-lg text-primary-700">
            The Evolving PM is committed to protecting your privacy. This policy
            explains what data we collect, how we use it, and your rights.
          </p>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              What We Collect
            </h2>
            <div className="space-y-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Resource Submissions
                </h3>
                <p className="text-primary-700">
                  When you{" "}
                  <Link href="/submit" className="text-accent-700 hover:text-accent-800 underline">
                    submit a resource
                  </Link>
                  , we collect:
                </p>
                <ul className="list-disc list-inside text-primary-700 mt-2 space-y-1">
                  <li>
                    <strong>Resource URL</strong> (required) - the link you&apos;re
                    suggesting
                  </li>
                  <li>
                    <strong>Your email</strong> (optional) - only if you want to
                    be notified when your resource is added
                  </li>
                  <li>
                    <strong>Context</strong> (optional) - your description of why
                    the resource is valuable
                  </li>
                </ul>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Anonymous Analytics
                </h3>
                <p className="text-primary-700">
                  We use{" "}
                  <a
                    href="https://vercel.com/analytics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-700 hover:text-accent-800 underline"
                  >
                    Vercel Analytics
                  </a>{" "}
                  to understand how people use the site. This collects anonymous,
                  aggregated data like page views and visitor counts. No personal
                  information or cookies are used for tracking.
                </p>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Error Tracking
                </h3>
                <p className="text-primary-700">
                  We use{" "}
                  <a
                    href="https://sentry.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-700 hover:text-accent-800 underline"
                  >
                    Sentry
                  </a>{" "}
                  to monitor errors and improve site reliability. When an error
                  occurs, technical information about the error is captured to
                  help us fix issues. This does not include personal information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              How We Use Your Data
            </h2>
            <ul className="list-disc list-inside text-primary-700 space-y-2">
              <li>
                <strong>Submitted emails</strong> are only used to notify you if
                your suggested resource is added to the library. We do not send
                marketing emails or share your email with third parties.
              </li>
              <li>
                <strong>Submitted URLs and context</strong> are reviewed to
                evaluate resources for inclusion in the library.
              </li>
              <li>
                <strong>Analytics data</strong> helps us understand which content
                is most useful so we can improve the site.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              Third-Party Services
            </h2>
            <p className="text-primary-700 mb-4">
              We use the following services to operate the site:
            </p>
            <ul className="list-disc list-inside text-primary-700 space-y-2">
              <li>
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-700 hover:text-accent-800 underline"
                >
                  Vercel
                </a>{" "}
                - Hosting and analytics
              </li>
              <li>
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-700 hover:text-accent-800 underline"
                >
                  Supabase
                </a>{" "}
                - Database hosting
              </li>
              <li>
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-700 hover:text-accent-800 underline"
                >
                  Resend
                </a>{" "}
                - Email delivery
              </li>
              <li>
                <a
                  href="https://sentry.io/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-700 hover:text-accent-800 underline"
                >
                  Sentry
                </a>{" "}
                - Error tracking
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              Data Retention
            </h2>
            <p className="text-primary-700">
              Submission data is retained as long as needed to review and process
              your suggestion. If your resource is added, your email (if provided)
              may be retained to send you a one-time notification. You can request
              deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              Your Rights
            </h2>
            <p className="text-primary-700">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-primary-700 mt-2 space-y-1">
              <li>Request access to any personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent for data processing at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary-900 mb-4">
              Contact
            </h2>
            <p className="text-primary-700">
              Questions about this privacy policy? Reach out via{" "}
              <a
                href="https://linkedin.com/in/nat-barr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-700 hover:text-accent-800 underline"
              >
                LinkedIn
              </a>
              .
            </p>
          </section>

          <section className="border-t border-primary-200 pt-8">
            <p className="text-sm text-primary-500">
              Last updated: February 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
