"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function SubmitPage() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          email: email || undefined,
          context: context || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setStatus("success");
      setUrl("");
      setEmail("");
      setContext("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-primary-200 px-4 py-3 text-primary-900 placeholder:text-primary-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500";

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            Submit a Resource
          </h1>
          <p className="text-lg text-primary-600">
            Know a great resource for Product Managers learning about AI? Share
            it with the community. We review every submission and add quality
            resources to the library.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-12 bg-green-50 rounded-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Thank You!
            </h2>
            <p className="text-green-700 mb-6">
              Your submission has been received. We&apos;ll review it and add it to
              the library if it&apos;s a good fit.
            </p>
            <Button onClick={() => setStatus("idle")} variant="outline">
              Submit Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-primary-700 mb-2"
              >
                Resource URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-700 mb-2"
              >
                Your Email{" "}
                <span className="text-primary-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
              <p className="mt-1 text-sm text-primary-500">
                We&apos;ll only use this to notify you if your resource is added.
              </p>
            </div>

            <div>
              <label
                htmlFor="context"
                className="block text-sm font-medium text-primary-700 mb-2"
              >
                Why is this resource valuable?{" "}
                <span className="text-primary-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="context"
                name="context"
                rows={4}
                placeholder="Tell us why you found this resource helpful..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className={inputClasses}
                maxLength={1000}
              />
              <p className="mt-1 text-sm text-primary-500">
                {context.length}/1000 characters
              </p>
            </div>

            {status === "error" && (
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Submit Resource"}
            </Button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-primary-200">
          <h2 className="text-lg font-semibold text-primary-900 mb-4">
            What makes a good submission?
          </h2>
          <ul className="space-y-3 text-primary-600">
            <li className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <strong>Relevant to PMs:</strong> Content that helps Product
                Managers understand or work with AI
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <strong>High quality:</strong> Well-written, accurate, and
                actionable content
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <strong>Accessible:</strong> Free or clearly priced content from
                reputable sources
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
