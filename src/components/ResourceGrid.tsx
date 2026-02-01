import { ResourceCard } from "@/components/ResourceCard";
import type { Resource } from "@/lib/supabase/types";

type ResourceGridProps = {
  resources: Resource[];
  emptyMessage?: string;
};

export function ResourceGrid({
  resources,
  emptyMessage = "No resources found.",
}: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-500">{emptyMessage}</p>
      </div>
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
