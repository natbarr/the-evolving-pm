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
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2",
          pathname === "/resources"
            ? "bg-accent-600 text-white"
            : "bg-primary-100 text-primary-600 hover:bg-primary-200 hover:text-primary-900"
        )}
      >
        All
      </Link>
      {Object.entries(CATEGORIES).map(([slug, { name }]) => (
        <Link
          key={slug}
          href={`/categories/${slug}`}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2",
            pathname === `/categories/${slug}`
              ? "bg-accent-600 text-white"
              : "bg-primary-100 text-primary-600 hover:bg-primary-200 hover:text-primary-900"
          )}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
