import type { Metadata } from "next";
import {
  MagnifyingGlass,
  UserCircle,
  EnvelopeSimple,
  Bell,
  GitBranch,
  Wheelchair,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "See what's coming to The Evolving PM — planned features and improvements to the resource library.",
};

const upNext = [
  {
    icon: MagnifyingGlass,
    name: "Search",
    description:
      "Find resources by keyword across titles, summaries, authors, and sources — from any page, without navigating first.",
  },
  {
    icon: UserCircle,
    name: "Accounts & Bookmarks",
    description:
      "Sign in to bookmark resources for later and track which ones you've completed. Your learning, your pace.",
  },
];

const planned = [
  {
    icon: EnvelopeSimple,
    name: "Newsletter",
    description:
      "A regular digest of newly added resources and notable reads — curated picks delivered to your inbox.",
  },
  {
    icon: Bell,
    name: "Submission Notifications",
    description:
      "Real-time alerts when community members suggest new resources, so nothing sits in the queue unnoticed.",
  },
  {
    icon: GitBranch,
    name: "Automated Ingest",
    description:
      "A scheduled pipeline to keep the library up to date without manual effort — faster additions, fewer gaps.",
  },
  {
    icon: Wheelchair,
    name: "Accessibility Statement",
    description:
      "A dedicated page documenting our accessibility commitments and how to report any barriers you encounter.",
  },
];

export default function RoadmapPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-16">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-accent-600 mb-3">
            Roadmap
          </p>
          <h1 className="font-display text-3xl font-normal tracking-tight text-primary-900 mb-6">
            What&apos;s Coming
          </h1>
          <p className="text-lg text-primary-600 leading-relaxed">
            The Evolving PM is an ongoing project. Here&apos;s what I&apos;m
            working toward — features that will make the library more useful,
            personalized, and sustainable over time.
          </p>
        </section>

        {/* Up Next */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl font-normal tracking-tight text-primary-900">
              Up Next
            </h2>
            <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-accent-600 bg-accent-100 px-2 py-0.5 rounded">
              In progress
            </span>
          </div>
          <div className="space-y-4">
            {upNext.map((item) => (
              <div
                key={item.name}
                className="flex gap-4 bg-surface rounded-xl p-6"
              >
                <div className="shrink-0 mt-0.5">
                  <item.icon
                    className="h-5 w-5 text-accent-600"
                    weight="duotone"
                  />
                </div>
                <div>
                  <h3 className="font-display font-medium text-primary-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-primary-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Planned */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl font-normal tracking-tight text-primary-900">
              Planned
            </h2>
            <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-primary-500 bg-primary-100 px-2 py-0.5 rounded">
              Coming later
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {planned.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-3 border border-primary-200 rounded-xl p-5"
              >
                <item.icon
                  className="h-5 w-5 text-primary-400"
                  weight="duotone"
                />
                <div>
                  <h3 className="font-display font-medium text-primary-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-primary-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Note */}
        <section className="border-t border-primary-200 pt-10">
          <p className="text-sm text-primary-500 leading-relaxed">
            This roadmap reflects current priorities and may shift as the
            library grows. Have a feature idea? Share it via the{" "}
            <a
              href="/submit"
              className="text-accent-600 underline underline-offset-2 hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 rounded"
            >
              resource submission form
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
