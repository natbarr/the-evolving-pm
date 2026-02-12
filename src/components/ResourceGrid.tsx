import { ResourceCard } from "@/components/ResourceCard";
import { EmptyState } from "@/components/EmptyState";
import type { Resource } from "@/lib/supabase/types";

type ResourceGridProps = {
  resources: Resource[];
  emptyState?: React.ReactNode;
  /** @deprecated Use emptyState prop instead */
  emptyMessage?: string;
};

export function ResourceGrid({
  resources,
  emptyState,
  emptyMessage,
}: ResourceGridProps) {
  if (resources.length === 0) {
    if (emptyState) {
      return <>{emptyState}</>;
    }
    // Fallback for legacy usage
    return (
      <EmptyState
        icon="inbox"
        title="No resources found"
        description={emptyMessage || "No resources found."}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
