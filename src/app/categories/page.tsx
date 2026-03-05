import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categories",
  description: `Explore resources by category at ${SITE_CONFIG.name}. Find curated AI learning resources for Product Managers.`,
};

export default function CategoriesPage() {
  const categoryEntries = Object.entries(CATEGORIES);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-accent-600 mb-2">
            Browse
          </p>
          <h1 className="font-display text-3xl font-normal tracking-tight text-primary-900 mb-3">
            Browse by Category
          </h1>
          <p className="text-primary-500 max-w-xl">
            Explore our curated resources organized by topic. Each category is
            designed to help you build specific skills on your AI learning journey.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryEntries.map(([slug, category]) => (
            <Link key={slug} href={`/categories/${slug}`} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2">
              <Card className="h-full group-hover:border-accent-600 transition-colors">
                <CardHeader>
                  <CardTitle className="group-hover:text-accent-600 transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
