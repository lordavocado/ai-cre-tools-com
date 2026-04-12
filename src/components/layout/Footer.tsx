import Link from 'next/link';
import { Twitter, Linkedin } from 'lucide-react';
import { siteConfig } from '@/config/site';
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
    <footer className="bg-white border-t border-[#e0e0e0]">
      <div className="mx-auto max-w-[1200px] px-6">

        {/* Main 4-column grid */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1: Brand + tagline + social */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#629649] text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                AI
              </span>
              <span className="text-sm font-bold text-[#1f1f1f]">{siteConfig.name}</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-[#737373]">
              Find the best AI tools for commercial real estate.
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-[#737373]">
              Curated for investors, brokers &amp; operators
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href={`https://linkedin.com/${siteConfig.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#737373] hover:text-[#1f1f1f] transition-colors duration-100"
              >
                <Linkedin size={18} aria-hidden="true" />
              </Link>
              <Link
                href={`https://twitter.com/${siteConfig.social.twitter.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-[#737373] hover:text-[#1f1f1f] transition-colors duration-100"
              >
                <Twitter size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Col 2: Browse */}
          <div>
            <h3 className="text-sm font-semibold text-[#1f1f1f] mb-3 uppercase tracking-wide">
              Browse
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/categories', label: 'All Categories' },
                { href: '/categories/property-analysis-valuation', label: 'Property Analysis' },
                { href: '/categories/marketing-leasing-enablement', label: 'Marketing & Leasing' },
                { href: '/categories/asset-portfolio-management', label: 'Asset Management' },
                { href: '/categories/property-management-operations', label: 'Property Management' },
                { href: '/categories/transactions-brokerage', label: 'Transactions' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-[#737373] hover:text-[#1f1f1f] transition-colors duration-100"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="text-sm font-semibold text-[#1f1f1f] mb-3 uppercase tracking-wide">
              Resources
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/about', label: 'About' },
                { href: '/blog', label: 'Blog' },
                { href: '/submit-tool', label: 'Submit a Tool' },
                { href: '/favorites', label: 'Favorites' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-service', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-[#737373] hover:text-[#1f1f1f] transition-colors duration-100"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Submit a Tool CTA */}
          <div>
            <h3 className="text-sm font-semibold text-[#1f1f1f] mb-3 uppercase tracking-wide">
              Submit a Tool
            </h3>
            <p className="text-sm text-[#737373] mb-3">
              Know an AI tool for CRE? Add it to the directory.
            </p>
            <Link
              href="/submit-tool"
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#629649] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a7238] transition-colors duration-100"
            >
              Submit a Tool
            </Link>
          </div>

        </div>

        {/* Newsletter row */}
        <div className="border-t border-[#e0e0e0] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#737373]">Stay updated on new CRE AI tools</p>
          <NewsletterForm
            source="footer"
            fieldsClassName="gap-2"
            inputClassName="rounded-[6px] border border-[#e0e0e0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#629649] w-48 h-auto"
            buttonClassName="rounded-[6px] bg-[#629649] px-3 py-1.5 text-sm text-white hover:bg-[#4a7238] transition-colors duration-100 w-auto border-0"
          />
        </div>

        {/* Copyright bar */}
        <div className="border-t border-[#e0e0e0] flex flex-col items-center justify-between gap-4 py-5 text-xs text-[#737373] sm:flex-row">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-[#1f1f1f] transition-colors duration-100">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#1f1f1f] transition-colors duration-100">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
