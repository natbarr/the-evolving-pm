export function FilterBarSkeleton({ filterCount = 4 }: { filterCount?: number }) {
  return (
    <div className="flex flex-wrap gap-3 animate-pulse">
      {[...Array(filterCount)].map((_, i) => (
        <div
          key={i}
          className="h-10 w-32 rounded-lg bg-primary-100"
        />
      ))}
    </div>
  );
}
