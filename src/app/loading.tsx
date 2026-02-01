export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-accent-500" />
        <p className="text-primary-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
