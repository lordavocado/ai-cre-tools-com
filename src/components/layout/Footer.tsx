import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getAllSeoPersonas } from '@/config/seo-personas';
import { NewsletterForm } from '@/components/forms/SimpleNewsletterForm';

/**
 * Site-wide footer with 4-column layout:
 * - Brand + tagline + social icons
 * - Browse (category links)
 * - Resources (utility links)
 * - Submit a Tool CTA
 * Includes a newsletter subscription row above the copyright bar.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-6">

        {/* Main 4-column grid */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1: Brand + tagline + social */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                AI
              </span>
              <span className="text-sm font-bold text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Find the best AI tools for commercial real estate.
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Curated for investors, brokers &amp; operators
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="https://www.linkedin.com/in/nichlaskvist/?skipRedirect=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn — Made by Nichlas, feel free to connect"
                className="inline-flex min-h-10 items-center gap-2 rounded-md text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Linkedin size={16} aria-hidden="true" />
                <span className="text-xs">Made by Nichlas — feel free to connect</span>
              </Link>
              <Link
                href="https://x.com/nkjorg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="inline-flex min-h-10 items-center gap-2 rounded-md text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* X (formerly Twitter) icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.638 5.9-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                </svg>
                <span className="text-xs">@nkjorg</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Browse */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Browse
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/all-tools', label: 'All Tools (A–Z)' },
                { href: '/categories', label: 'All Categories' },
                { href: '/for', label: 'Tools by Role' },
                { href: '/use-cases', label: 'Workflow × Role Use Cases' },
                { href: '/asset-classes', label: 'Tools by Asset Class' },
                { href: '/integrations', label: 'Software Integrations' },
                { href: '/tags', label: 'Browse by Capability' },
                { href: '/compare', label: 'Tool Comparisons' },
                { href: '/glossary', label: 'CRE Glossary' },
                { href: '/categories/property-search-acquisition', label: 'Deal Sourcing' },
                { href: '/categories/property-analysis-valuation', label: 'Investment Analysis' },
                { href: '/categories/legal-compliance-due-diligence', label: 'Due Diligence' },
                { href: '/categories/development-construction', label: 'Development' },
                { href: '/categories/marketing-leasing-enablement', label: 'Leasing' },
                { href: '/categories/asset-portfolio-management', label: 'Portfolio Management' },
                { href: '/categories/property-management-operations', label: 'Property Management' },
                { href: '/categories/transactions-brokerage', label: 'Transactions & CRM' },
                { href: '/categories/productivity-copilots', label: 'AI Copilots' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-sm text-sm text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: By role */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              By role
            </h3>
            <nav className="flex flex-col gap-2.5">
              {getAllSeoPersonas().map((persona) => (
                <Link
                  key={persona.slug}
                  href={`/for/${persona.slug}`}
                  className="rounded-sm text-sm text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {persona.shortLabel}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Resources — merged into grid; Submit stays separate below */}

          {/* Col 4: Resources & Submit */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Resources
            </h3>
            <nav className="mb-6 flex flex-col gap-2.5">
              {[
                { href: '/about', label: 'About' },
                { href: '/blog', label: 'Blog' },
                { href: '/favorites', label: 'Favorites' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-service', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-sm text-sm text-muted-foreground transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Submit a tool
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Know an AI tool for CRE? Add it to the directory.
            </p>
            <Link
              href="/submit-tool"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-[background-color,transform] duration-150 motion-safe:active:scale-[0.97] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Submit a tool
            </Link>
          </div>

        </div>

        {/* Newsletter row */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-5 sm:flex-row">
          <p className="text-xs text-muted-foreground sm:text-sm">Stay updated on new CRE AI tools</p>
          <NewsletterForm source="footer" variant="brand" size="sm" />
        </div>

        {/* Copyright bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="rounded-sm transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="rounded-sm transition-colors duration-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
