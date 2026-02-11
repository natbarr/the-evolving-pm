import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary-200 bg-primary-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <Link
              href="/"
              className="text-lg font-semibold text-primary-900"
            >
              The Evolving PM
            </Link>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/resources"
                className="text-primary-600 hover:text-primary-900 transition-colors"
              >
                Resources
              </Link>
              <Link
                href="/categories"
                className="text-primary-600 hover:text-primary-900 transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/submit"
                className="text-primary-600 hover:text-primary-900 transition-colors"
              >
                Submit a Resource
              </Link>
              <Link
                href="/about"
                className="text-primary-600 hover:text-primary-900 transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-primary-600 hover:text-primary-900 transition-colors"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-200 pt-8">
          <p className="text-sm text-primary-500">
            Curated resources for Product Managers navigating AI&apos;s impact on their craft.
          </p>
          <p className="mt-2 text-sm text-primary-500">
            Built by{" "}
            <a
              href="https://natbarr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-primary-900 transition-colors"
            >
              Nat
            </a>
            {" · "}
            <a
              href="https://linkedin.com/in/nat-barr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-primary-900 transition-colors"
            >
              LinkedIn
            </a>
          </p>
          <p className="mt-2 text-xs text-primary-400">
            &copy; {new Date().getFullYear()} The Evolving PM. All resources remain property of their original creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
