import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE_CONFIG.name} - a curated resource library for Product Managers navigating AI's impact on their craft.`,
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Mission */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold text-primary-900 mb-6">
            About The Evolving PM
          </h1>
          <div className="prose prose-primary max-w-none">
            <p className="text-lg text-primary-700 leading-relaxed mb-4">
              The world of product management is changing rapidly. AI is
              reshaping how we build products, understand users, and make
              decisions. For PMs, keeping up with this transformation can feel
              overwhelming.
            </p>
            <p className="text-lg text-primary-700 leading-relaxed mb-4">
              The Evolving PM exists to cut through the noise. This is a
              hand-curated collection of resources designed to help Product
              Managers at every stage of their AI learning journey—from
              understanding the fundamentals to leading AI product strategy.
            </p>
            <p className="text-lg text-primary-700 leading-relaxed">
              Every resource here has been personally reviewed and evaluated. No
              sponsored content, no affiliate links—just quality resources
              organized to help you learn effectively.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            Curation Philosophy
          </h2>
          <div className="space-y-6">
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-primary-900 mb-2">
                Quality Over Quantity
              </h3>
              <p className="text-primary-700">
                Rather than an exhaustive list, this library focuses on the best
                resources in each category. Every addition is evaluated for
                accuracy, clarity, and practical value for PMs.
              </p>
            </div>

            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-primary-900 mb-2">
                Regularly Reviewed
              </h3>
              <p className="text-primary-700">
                AI moves fast. Resources are reviewed on a schedule based on
                their content type—evergreen content less frequently,
                model-dependent content more often—to ensure information stays
                relevant.
              </p>
            </div>

            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-primary-900 mb-2">
                PM-Focused Perspective
              </h3>
              <p className="text-primary-700">
                Technical depth matters, but so does practical application.
                Resources are selected based on how well they help PMs do their
                jobs better, not just how technically impressive they are.
              </p>
            </div>
          </div>
        </section>

        {/* Evaluation Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            How Resources Are Evaluated
          </h2>
          <div className="prose prose-primary max-w-none">
            <p className="text-primary-700 mb-4">
              Each resource goes through a consistent evaluation process:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-primary-700">
              <li>
                <strong>Initial review:</strong> Is this relevant and valuable
                for Product Managers learning about AI?
              </li>
              <li>
                <strong>Quality assessment:</strong> Is the content accurate,
                well-organized, and actionable?
              </li>
              <li>
                <strong>Categorization:</strong> What category, level, and
                format best describes this resource?
              </li>
              <li>
                <strong>Summary creation:</strong> A brief overview of what
                learners will gain from this resource.
              </li>
              <li>
                <strong>Ongoing review:</strong> Scheduled re-evaluation to
                ensure continued relevance.
              </li>
            </ol>
          </div>
        </section>

        {/* Categories Explanation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">
            Resource Categories
          </h2>
          <p className="text-primary-700 mb-6">
            Resources are organized into categories that reflect the key skill
            areas for AI-savvy Product Managers:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">AI Fundamentals</h3>
              <p className="text-sm text-primary-600 mt-1">
                Core concepts every PM should understand
              </p>
            </div>
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">Prompt Engineering</h3>
              <p className="text-sm text-primary-600 mt-1">
                Techniques for effective AI interaction
              </p>
            </div>
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">Technical Skills</h3>
              <p className="text-sm text-primary-600 mt-1">
                Hands-on tools and development workflows
              </p>
            </div>
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">Strategy & Leadership</h3>
              <p className="text-sm text-primary-600 mt-1">
                Leading AI initiatives and building strategy
              </p>
            </div>
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">Ethics & Governance</h3>
              <p className="text-sm text-primary-600 mt-1">
                Responsible AI practices and compliance
              </p>
            </div>
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">Career Development</h3>
              <p className="text-sm text-primary-600 mt-1">
                Growing as an AI-savvy PM
              </p>
            </div>
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">Tools & Workflows</h3>
              <p className="text-sm text-primary-600 mt-1">
                Practical AI integration in daily work
              </p>
            </div>
            <div className="border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900">Case Studies</h3>
              <p className="text-sm text-primary-600 mt-1">
                Real-world AI product examples
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-primary-200">
          <h2 className="text-xl font-bold text-primary-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-primary-600 mb-6">
            Browse the resource library or suggest a resource you&apos;ve found
            valuable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/resources" size="lg">
              Explore Resources
            </Button>
            <Button href="/submit" variant="outline" size="lg">
              Submit a Resource
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
