"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

function validateUrl(value: string): string | null {
  if (!value) return "URL is required";
  try {
    new URL(value);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
}

function validateEmail(value: string): string | null {
  if (!value) return null; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : "Please enter a valid email";
}

function validateContext(value: string): string | null {
  if (value.length > 1000) return "Context must be 1000 characters or less";
  return null;
}

export default function SubmitPage() {
  const [fields, setFields] = useState<{
    url: FieldState;
    email: FieldState;
    context: FieldState;
  }>({
    url: { value: "", touched: false, error: null },
    email: { value: "", touched: false, error: null },
    context: { value: "", touched: false, error: null },
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field: "url" | "email" | "context", value: string) => {
    setFields((prev) => ({
      ...prev,
      [field]: {
        value,
        touched: prev[field].touched,
        // For context, validate on change; for others, clear error on change
        error: field === "context" ? validateContext(value) : null,
      },
    }));
  };

  const handleBlur = (field: "url" | "email") => {
    const value = fields[field].value;
    const error = field === "url" ? validateUrl(value) : validateEmail(value);
    setFields((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched: true,
        error,
      },
    }));
  };

  const handleContextBlur = () => {
    setFields((prev) => ({
      ...prev,
      context: {
        ...prev.context,
        touched: true,
      },
    }));
  };

  const isFieldValid = (field: FieldState, validator?: (v: string) => string | null): boolean => {
    if (!field.touched) return false;
    if (field.error) return false;
    if (validator && validator(field.value)) return false;
    return field.value.length > 0;
  };

  const getInputClasses = (field: FieldState, validator?: (v: string) => string | null) => {
    const baseClasses =
      "w-full rounded-lg border px-4 py-3 text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-1";

    if (field.touched && field.error) {
      return cn(baseClasses, "border-red-300 focus:border-red-500 focus:ring-red-500");
    }
    if (isFieldValid(field, validator)) {
      return cn(baseClasses, "border-green-300 focus:border-green-500 focus:ring-green-500");
    }
    return cn(baseClasses, "border-primary-200 focus:border-accent-500 focus:ring-accent-500");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submit
    const urlError = validateUrl(fields.url.value);
    const emailError = validateEmail(fields.email.value);
    const contextError = validateContext(fields.context.value);

    if (urlError || emailError || contextError) {
      setFields({
        url: { ...fields.url, touched: true, error: urlError },
        email: { ...fields.email, touched: true, error: emailError },
        context: { ...fields.context, touched: true, error: contextError },
      });
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: fields.url.value,
          email: fields.email.value || undefined,
          context: fields.context.value || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setStatus("success");
      setFields({
        url: { value: "", touched: false, error: null },
        email: { value: "", touched: false, error: null },
        context: { value: "", touched: false, error: null },
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setFields({
      url: { value: "", touched: false, error: null },
      email: { value: "", touched: false, error: null },
      context: { value: "", touched: false, error: null },
    });
  };

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
          <div className="text-center py-12 bg-green-50 rounded-xl" role="status" aria-live="polite">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
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
            <Button onClick={resetForm} variant="outline">
              Submit Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                value={fields.url.value}
                onChange={(e) => handleChange("url", e.target.value)}
                onBlur={() => handleBlur("url")}
                className={getInputClasses(fields.url, validateUrl)}
                aria-invalid={fields.url.touched && !!fields.url.error}
                aria-describedby={fields.url.error ? "url-error" : undefined}
              />
              {fields.url.touched && fields.url.error && (
                <p id="url-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fields.url.error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-700 mb-2"
              >
                Your Email{" "}
                <span className="text-primary-500 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={fields.email.value}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={getInputClasses(fields.email, validateEmail)}
                aria-invalid={fields.email.touched && !!fields.email.error}
                aria-describedby={fields.email.error ? "email-error" : "email-hint"}
              />
              {fields.email.touched && fields.email.error ? (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fields.email.error}
                </p>
              ) : (
                <p id="email-hint" className="mt-1 text-sm text-primary-500">
                  We&apos;ll only use this to notify you if your resource is added.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="context"
                className="block text-sm font-medium text-primary-700 mb-2"
              >
                Why is this resource valuable?{" "}
                <span className="text-primary-500 font-normal">(optional)</span>
              </label>
              <textarea
                id="context"
                name="context"
                rows={4}
                placeholder="Tell us why you found this resource helpful..."
                value={fields.context.value}
                onChange={(e) => handleChange("context", e.target.value)}
                onBlur={handleContextBlur}
                className={getInputClasses(fields.context, validateContext)}
                aria-invalid={fields.context.touched && !!fields.context.error}
                aria-describedby="context-counter"
              />
              <p
                id="context-counter"
                className={cn(
                  "mt-1 text-sm",
                  fields.context.value.length > 1000
                    ? "text-red-600"
                    : fields.context.value.length > 900
                    ? "text-amber-600"
                    : "text-primary-500"
                )}
              >
                {fields.context.value.length}/1000 characters
                {fields.context.value.length > 900 && fields.context.value.length <= 1000 && (
                  <span> - approaching limit</span>
                )}
              </p>
            </div>

            {status === "error" && (
              <div className="rounded-lg bg-red-50 p-4" role="alert" aria-live="assertive">
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
                aria-hidden="true"
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
                aria-hidden="true"
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
                aria-hidden="true"
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
