"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Categories">
      <Link
        href="/resources"
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/resources"
            ? "bg-primary-900 text-white"
            : "bg-primary-100 text-primary-700 hover:bg-primary-200"
        )}
      >
        All
      </Link>
      {Object.entries(CATEGORIES).map(([slug, { name }]) => (
        <Link
          key={slug}
          href={`/categories/${slug}`}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            pathname === `/categories/${slug}`
              ? "bg-primary-900 text-white"
              : "bg-primary-100 text-primary-700 hover:bg-primary-200"
          )}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
