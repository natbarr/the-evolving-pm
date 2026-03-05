import Link from "next/link";
import {
  CheckCircle, ArrowsClockwise, GraduationCap,
  Brain, TrendUp, Code, ChartLine,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/supabase/types";

export default function HomePage() {
  const featuredCategories: Category[] = [
    "ai-fundamentals",
    "ai-product-strategy",
    "technical-skills",
    "business-economics",
  ];

  const categoryIcons: Partial<Record<Category, React.ElementType>> = {
    "ai-fundamentals":     Brain,
    "ai-product-strategy": TrendUp,
    "technical-skills":    Code,
    "business-economics":  ChartLine,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b border-primary-200 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-7 bg-accent-600 flex-shrink-0" />
            <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-accent-600">
              For Product Managers
            </span>
          </div>
          <h1 className="font-display text-5xl font-normal tracking-tight text-primary-900 sm:text-6xl md:text-7xl max-w-3xl mb-7 leading-[1.06]">
            Your AI learning journey,{" "}
            <em className="italic text-accent-600">curated.</em>
          </h1>
          <p className="text-lg text-primary-500 max-w-lg mb-10 leading-relaxed">
            Hand-picked resources for PMs navigating AI&apos;s impact on their
            craft. Reviewed, organized, and updated as the field evolves.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Button href="/resources" size="lg">
              Start Exploring
            </Button>
            <Button href="/about" variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-accent-600 mb-2">
              Browse
            </p>
            <h2 className="font-display text-3xl font-normal tracking-tight text-primary-900">
              Explore by Category
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((categorySlug) => {
              const category = CATEGORIES[categorySlug];
              const CategoryIcon = categoryIcons[categorySlug];
              return (
                <Link
                  key={categorySlug}
                  href={`/categories/${categorySlug}`}
                  className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  <Card className="h-full group-hover:border-accent-600 transition-colors">
                    <CardHeader>
                      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                        {CategoryIcon && <CategoryIcon size={20} weight="regular" />}
                      </div>
                      <CardTitle className="group-hover:text-accent-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Button href="/categories" variant="outline">
              View All Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Why This Library */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-accent-600 mb-2">
              Why us
            </p>
            <h2 className="font-display text-3xl font-normal tracking-tight text-primary-900">
              Why This Library?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-100 text-accent-600 mb-5">
                <CheckCircle size={22} weight="regular" />
              </div>
              <h3 className="font-display font-medium text-primary-900 mb-2">
                Hand-Curated
              </h3>
              <p className="text-sm text-primary-500 leading-relaxed">
                Every resource is personally reviewed and evaluated for
                quality and relevance.
              </p>
            </div>

            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-100 text-accent-600 mb-5">
                <ArrowsClockwise size={22} weight="regular" />
              </div>
              <h3 className="font-display font-medium text-primary-900 mb-2">
                Regularly Updated
              </h3>
              <p className="text-sm text-primary-500 leading-relaxed">
                Content is reviewed on a schedule based on how quickly the
                topic evolves.
              </p>
            </div>

            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-100 text-accent-600 mb-5">
                <GraduationCap size={22} weight="regular" />
              </div>
              <h3 className="font-display font-medium text-primary-900 mb-2">
                PM-Focused
              </h3>
              <p className="text-sm text-primary-500 leading-relaxed">
                Built specifically for Product Managers at every stage of
                their AI learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border border-primary-200 rounded-xl px-8 py-12 md:px-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-normal tracking-tight text-primary-900 mb-2">
                Know a great resource?
              </h2>
              <p className="text-primary-500 text-sm leading-relaxed max-w-sm">
                Help grow this library by suggesting resources that have helped
                you on your AI journey.
              </p>
            </div>
            <Button href="/submit" size="lg">
              Submit a Resource
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
