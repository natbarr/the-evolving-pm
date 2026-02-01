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
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Explore our curated resources organized by topic. Each category is
            designed to help you build specific skills on your AI learning journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryEntries.map(([slug, category]) => (
            <Link key={slug} href={`/categories/${slug}`} className="group">
              <Card className="h-full group-hover:border-accent-300 transition-colors">
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
