export function ResourceCardSkeleton() {
  return (
    <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm h-full flex flex-col animate-pulse">
      {/* Header */}
      <div className="flex-1 mb-4">
        {/* Badges */}
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-20 rounded-full bg-primary-100" />
          <div className="h-5 w-16 rounded-full bg-primary-100" />
        </div>
        {/* Title - 2 lines */}
        <div className="space-y-2 mb-3">
          <div className="h-5 w-full rounded bg-primary-100" />
          <div className="h-5 w-3/4 rounded bg-primary-100" />
        </div>
        {/* Description - 3 lines */}
        <div className="space-y-2 mt-3">
          <div className="h-4 w-full rounded bg-primary-100" />
          <div className="h-4 w-full rounded bg-primary-100" />
          <div className="h-4 w-2/3 rounded bg-primary-100" />
        </div>
      </div>
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-primary-100 flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-primary-100" />
        <div className="h-4 w-24 rounded bg-primary-100" />
      </div>
    </div>
  );
}
