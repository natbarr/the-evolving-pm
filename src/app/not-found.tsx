import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <p className="font-display text-8xl font-light tracking-tight text-primary-200 mb-2">404</p>
      <h1 className="font-display text-2xl font-normal tracking-tight text-primary-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-primary-500 mb-8 text-center max-w-md">
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
