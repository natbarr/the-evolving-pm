import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { ResourceCard } from "@/components/ResourceCard";
import { CATEGORIES, LEVELS, FORMATS } from "@/lib/constants";
import { formatDate, getHostname, sanitizeUrl } from "@/lib/utils";
import type { Resource } from "@/lib/supabase/types";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("title, summary")
    .eq("slug", slug)
    .eq("status", "active")
    .single() as { data: { title: string; summary: string } | null };

  if (!resource) {
    return { title: "Resource Not Found" };
  }

  return {
    title: resource.title,
    description: resource.summary.substring(0, 160),
  };
}

async function getRelatedResources(
  supabase: Awaited<ReturnType<typeof createClient>>,
  resource: Resource
): Promise<Resource[]> {
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "active")
    .eq("category", resource.category)
    .neq("id", resource.id)
    .limit(10) as { data: Resource[] | null };

  if (!data || data.length === 0) return [];

  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export default async function ResourcePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single() as { data: Resource | null; error: Error | null };

  if (error || !resource) {
    notFound();
  }

  const relatedResources = await getRelatedResources(supabase, resource);

  const category = CATEGORIES[resource.category];
  const level = LEVELS[resource.level];
  const format = FORMATS[resource.format];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-primary-500">
            <li>
              <Link href="/resources" className="hover:text-primary-700">
                Resources
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/categories/${resource.category}`}
                className="hover:text-primary-700"
              >
                {category?.name || resource.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary-700 truncate max-w-[200px]">
              {resource.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="category">{category?.name || resource.category}</Badge>
            <Badge variant="level">{level?.name || resource.level}</Badge>
            <Badge variant="format">
              {format?.icon} {format?.name || resource.format}
            </Badge>
            {resource.access_type === "paid" && (
              <Badge className="bg-amber-100 text-amber-800">Paid</Badge>
            )}
            {resource.access_type === "freemium" && (
              <Badge className="bg-blue-100 text-blue-800">Freemium</Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            {resource.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-500 mb-6">
            {resource.author && (
              <span>
                By <span className="text-primary-700">{resource.author}</span>
              </span>
            )}
            {resource.source && (
              <span>
                via <span className="text-primary-700">{resource.source}</span>
              </span>
            )}
            {resource.publication_date && (
              <span>Published {formatDate(resource.publication_date)}</span>
            )}
          </div>

          {/* Quick action button */}
          <a
            href={sanitizeUrl(resource.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-white font-medium hover:bg-accent-600 transition-colors"
          >
            View Resource
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </header>

        {/* Summary */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">
            Summary
          </h2>
          <div className="prose prose-primary max-w-none">
            {resource.summary.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-primary-700 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Why This Matters */}
        <section className="mb-12">
          <div className="rounded-xl bg-white shadow-md ring-1 ring-primary-100 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100">
                  <svg className="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold text-primary-900">
                    Why This Matters
                  </h2>
                  <span className="rounded-full bg-primary-100 px-3 py-0.5 text-sm font-medium text-primary-700">
                    {level?.name}
                  </span>
                </div>
                <p className="text-primary-600 leading-relaxed">
                  {level?.name === "Beginner" && (
                    <>
                      This resource is ideal for PMs just starting their AI journey.
                      It provides foundational knowledge in{" "}
                      <span className="font-medium">{category?.name.toLowerCase()}</span>{" "}
                      that will help you build a solid understanding of how AI impacts
                      product management.
                    </>
                  )}
                  {level?.name === "Intermediate" && (
                    <>
                      Building on foundational concepts, this resource explores{" "}
                      <span className="font-medium">{category?.name.toLowerCase()}</span>{" "}
                      at a deeper level. It&apos;s designed for PMs who have some AI
                      experience and want to develop more sophisticated skills.
                    </>
                  )}
                  {level?.name === "Expert" && (
                    <>
                      This advanced resource dives deep into{" "}
                      <span className="font-medium">{category?.name.toLowerCase()}</span>.
                      It&apos;s best suited for experienced practitioners looking to master
                      complex topics and stay at the cutting edge.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resource Details */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">
            Details
          </h2>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-primary-200 p-4">
              <dt className="text-sm text-primary-500 mb-1">Format</dt>
              <dd className="font-medium text-primary-900">
                {format?.icon} {format?.name || resource.format}
              </dd>
            </div>
            <div className="bg-white rounded-lg border border-primary-200 p-4">
              <dt className="text-sm text-primary-500 mb-1">Level</dt>
              <dd className="font-medium text-primary-900">
                {level?.name || resource.level}
              </dd>
            </div>
            <div className="bg-white rounded-lg border border-primary-200 p-4">
              <dt className="text-sm text-primary-500 mb-1">Access</dt>
              <dd className="font-medium text-primary-900 capitalize">
                {resource.access_type}
              </dd>
            </div>
            <div className="bg-white rounded-lg border border-primary-200 p-4">
              <dt className="text-sm text-primary-500 mb-1">Source</dt>
              <dd className="font-medium text-primary-900 truncate">
                {resource.source || getHostname(resource.url)}
              </dd>
            </div>
            <div className="bg-white rounded-lg border border-primary-200 p-4">
              <dt className="text-sm text-primary-500 mb-1">Added</dt>
              <dd className="font-medium text-primary-900">
                {formatDate(resource.created_at)}
              </dd>
            </div>
          </dl>
        </section>

        {/* CTA */}
        <section className="mb-16 text-center py-8 border-t border-b border-primary-200">
          <p className="text-primary-600 mb-4">
            Ready to explore this resource?
          </p>
          <a
            href={sanitizeUrl(resource.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-900 px-8 py-4 text-white font-medium hover:bg-primary-800 transition-colors"
          >
            Go to {resource.source || getHostname(resource.url)}
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </section>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-primary-900 mb-6">
              More in {category?.name || resource.category}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedResources.map((related) => (
                <ResourceCard key={related.id} resource={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
