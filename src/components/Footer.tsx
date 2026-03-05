import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary-200 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer row */}
        <div className="flex flex-col gap-12 py-14 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              <span className="font-display text-lg font-medium tracking-tight text-primary-900">
                The Evolving <span className="text-accent-600">PM</span>
              </span>
            </Link>
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-primary-500">
              Curated resources for Product Managers navigating AI&apos;s impact on their craft.
            </p>
          </div>

          {/* Nav groups */}
          <div className="flex gap-12 sm:gap-16">
            <div>
              <h4 className="mb-4 font-mono text-[0.625rem] font-medium uppercase tracking-widest text-primary-400">
                Browse
              </h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Resources", href: "/resources" },
                  { label: "Categories", href: "/categories" },
                  { label: "Submit a Resource", href: "/submit" },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-primary-500 transition-colors hover:text-primary-900 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-mono text-[0.625rem] font-medium uppercase tracking-widest text-primary-400">
                About
              </h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Privacy", href: "/privacy" },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-primary-500 transition-colors hover:text-primary-900 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 border-t border-primary-200 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-primary-400">
            &copy; {new Date().getFullYear()} The Evolving PM. All resources remain property of their original creators.
          </p>
          <div className="flex gap-5">
            <a
              href="https://natbarr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-400 transition-colors hover:text-primary-900 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              natbarr.com
            </a>
            <a
              href="https://linkedin.com/in/nat-barr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-400 transition-colors hover:text-primary-900 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
