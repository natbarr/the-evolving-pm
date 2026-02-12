import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResourceGrid } from "@/components/ResourceGrid";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { FilterBar } from "@/components/FilterBar";
import { ResourceCardSkeleton, FilterBarSkeleton } from "@/components/skeletons";
import { ITEMS_PER_PAGE, SITE_CONFIG } from "@/lib/constants";
import type { Category, Level, Format } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Resources",
  description: `Browse all curated resources for Product Managers learning about AI at ${SITE_CONFIG.name}.`,
};

type SearchParams = Promise<{
  page?: string;
  category?: string;
  level?: string;
  format?: string;
  sort?: string;
}>;

async function ResourcesContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const category = params.category as Category | undefined;
  const level = params.level as Level | undefined;
  const format = params.format as Format | undefined;
  const sort = params.sort || "recent";

  const supabase = await createClient();

  let query = supabase
    .from("resources")
    .select("*", { count: "exact" })
    .eq("status", "active");

  if (category) {
    query = query.eq("category", category);
  }
  if (level) {
    query = query.eq("level", level);
  }
  if (format) {
    query = query.eq("format", format);
  }

  if (sort === "alpha") {
    query = query.order("title", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: resources, count, error } = await query.range(from, to);

  if (error) {
    console.error("Error fetching resources:", error);
    return (
      <div className="text-center py-12">
        <p className="text-primary-500">Unable to load resources. Please try again later.</p>
      </div>
    );
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  const searchParamsObj: Record<string, string> = {};
  if (category) searchParamsObj.category = category;
  if (level) searchParamsObj.level = level;
  if (format) searchParamsObj.format = format;
  if (sort && sort !== "recent") searchParamsObj.sort = sort;

  const hasFilters = category || level || format;

  return (
    <>
      <ResourceGrid
        resources={resources || []}
        emptyState={
          hasFilters ? (
            <EmptyState
              icon="filter"
              title="No matching resources"
              description="Try adjusting your filters or browse all resources."
              action={{ label: "Clear filters", href: "/resources" }}
            />
          ) : (
            <EmptyState
              icon="inbox"
              title="No resources yet"
              description="We're building our library. Check back soon or suggest a resource!"
              action={{ label: "Submit a resource", href: "/submit" }}
            />
          )
        }
      />
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/resources"
            searchParams={searchParamsObj}
          />
        </div>
      )}
    </>
  );
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            Resource Library
          </h1>
          <p className="text-primary-600">
            Explore curated resources to accelerate your AI learning journey.
          </p>
        </div>

        <div className="mb-8">
          <Suspense fallback={<FilterBarSkeleton filterCount={4} />}>
            <FilterBar
              basePath="/resources"
              showCategory
              showLevel
              showFormat
              showSort
            />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <ResourceCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ResourcesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
