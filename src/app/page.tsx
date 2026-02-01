import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/lib/supabase/types";

export default function HomePage() {
  const featuredCategories: Category[] = [
    "ai-fundamentals",
    "prompt-engineering",
    "technical-skills",
    "strategy-leadership",
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                    />
                  </svg>
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
