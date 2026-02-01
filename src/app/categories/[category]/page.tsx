import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ResourceGrid } from "@/components/ResourceGrid";
import { Pagination } from "@/components/Pagination";
import { FilterBar } from "@/components/FilterBar";
import { CATEGORIES, ITEMS_PER_PAGE } from "@/lib/constants";
import type { Category, Level, Format } from "@/lib/supabase/types";

type Params = Promise<{ category: string }>;
type SearchParams = Promise<{
  page?: string;
  level?: string;
  format?: string;
  sort?: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = CATEGORIES[categorySlug as Category];

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

async function CategoryContent({
  categorySlug,
  searchParams,
}: {
  categorySlug: string;
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const level = params.level as Level | undefined;
  const format = params.format as Format | undefined;
  const sort = params.sort || "recent";

  const supabase = await createClient();

  let query = supabase
    .from("resources")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .eq("category", categorySlug);

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
  if (level) searchParamsObj.level = level;
  if (format) searchParamsObj.format = format;
  if (sort && sort !== "recent") searchParamsObj.sort = sort;

  return (
    <>
      <ResourceGrid
        resources={resources || []}
        emptyMessage="No resources in this category yet. Check back soon!"
      />
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/categories/${categorySlug}`}
            searchParams={searchParamsObj}
          />
        </div>
      )}
    </>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES[categorySlug as Category];

  if (!category) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-primary-500">
            <li>
              <Link href="/categories" className="hover:text-primary-700">
                Categories
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary-700">{category.name}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-primary-600 max-w-3xl">
            {category.description}
          </p>
        </div>

        <div className="mb-8">
          <Suspense fallback={<div className="h-10" />}>
            <FilterBar
              basePath={`/categories/${categorySlug}`}
              showCategory={false}
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
                <div
                  key={i}
                  className="h-64 rounded-xl bg-primary-100 animate-pulse"
                />
              ))}
            </div>
          }
        >
          <CategoryContent
            categorySlug={categorySlug}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}
