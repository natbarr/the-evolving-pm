import Link from "next/link";
import { CheckCircle, ArrowsClockwise, GraduationCap } from "@phosphor-icons/react/dist/ssr";
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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl md:text-6xl">
              Your AI Learning Journey Starts Here
            </h1>
            <p className="mt-6 text-lg text-primary-600 md:text-xl">
              A curated collection of resources to help Product Managers navigate
              AI&apos;s impact on their craft. Hand-picked, regularly reviewed, and
              organized for your learning path.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/resources" size="lg">
                Start Exploring
              </Button>
              <Button href="/about" variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900">
              Explore by Category
            </h2>
            <p className="mt-4 text-lg text-primary-600">
              Find resources tailored to where you are in your AI journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((categorySlug) => {
              const category = CATEGORIES[categorySlug];
              return (
                <Link
                  key={categorySlug}
                  href={`/categories/${categorySlug}`}
                  className="group"
                >
                  <Card className="h-full group-hover:border-accent-300 transition-colors">
                    <CardHeader>
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

          <div className="mt-10 text-center">
            <Button href="/categories" variant="outline">
              View All Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Why This Library */}
      <section className="bg-primary-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">
              Why This Library?
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600 mb-4">
                  <CheckCircle size={24} weight="regular" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">
                  Hand-Curated
                </h3>
                <p className="text-sm text-primary-600">
                  Every resource is personally reviewed and evaluated for
                  quality and relevance.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600 mb-4">
                  <ArrowsClockwise size={24} weight="regular" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">
                  Regularly Updated
                </h3>
                <p className="text-sm text-primary-600">
                  Content is reviewed on a schedule based on how quickly the
                  topic evolves.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600 mb-4">
                  <GraduationCap size={24} weight="regular" />
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">
                  PM-Focused
                </h3>
                <p className="text-sm text-primary-600">
                  Built specifically for Product Managers at every stage of
                  their AI learning journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">
              Know a Great Resource?
            </h2>
            <p className="text-primary-600 mb-6">
              Help grow this library by suggesting resources that have helped
              you on your AI journey.
            </p>
            <Button href="/submit" variant="secondary">
              Submit a Resource
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
