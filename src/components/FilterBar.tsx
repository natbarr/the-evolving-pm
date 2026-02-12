"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORIES, LEVELS, FORMATS } from "@/lib/constants";

type FilterBarProps = {
  basePath: string;
  showCategory?: boolean;
  showLevel?: boolean;
  showFormat?: boolean;
  showSort?: boolean;
};

export function FilterBar({
  basePath,
  showCategory = true,
  showLevel = true,
  showFormat = false,
  showSort = true,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentLevel = searchParams.get("level") || "";
  const currentFormat = searchParams.get("format") || "";
  const currentSort = searchParams.get("sort") || "recent";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `${basePath}?${queryString}` : basePath);
    },
    [basePath, router, searchParams]
  );

  const selectClasses =
    "rounded-lg border border-primary-200 bg-white px-3 py-2.5 text-sm text-primary-700 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {showCategory && (
        <select
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          className={selectClasses}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORIES).map(([slug, { name }]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      )}

      {showLevel && (
        <select
          value={currentLevel}
          onChange={(e) => updateFilter("level", e.target.value)}
          className={selectClasses}
          aria-label="Filter by level"
        >
          <option value="">All Levels</option>
          {Object.entries(LEVELS).map(([slug, { name }]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      )}

      {showFormat && (
        <select
          value={currentFormat}
          onChange={(e) => updateFilter("format", e.target.value)}
          className={selectClasses}
          aria-label="Filter by format"
        >
          <option value="">All Formats</option>
          {Object.entries(FORMATS).map(([slug, { name }]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      )}

      {showSort && (
        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className={selectClasses}
          aria-label="Sort by"
        >
          <option value="recent">Recently Added</option>
          <option value="alpha">Alphabetical</option>
        </select>
      )}
    </div>
  );
}
