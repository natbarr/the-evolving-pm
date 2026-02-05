"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-2xl font-semibold text-primary-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-primary-600 mb-8 text-center max-w-md">
        We encountered an unexpected error. Please try again.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Button href="/" variant="outline">
          Go Home
        </Button>
      </div>
    </div>
  );
}
