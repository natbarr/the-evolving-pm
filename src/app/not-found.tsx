import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-primary-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-primary-900 mb-2">
        Page Not Found
      </h2>
      <p className="text-primary-600 mb-8 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button href="/">Go Home</Button>
        <Button href="/resources" variant="outline">
          Browse Resources
        </Button>
      </div>
    </div>
  );
}
