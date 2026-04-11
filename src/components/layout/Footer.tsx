import Link from 'next/link';
import { Twitter, Linkedin } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/forms/SimpleNewsletterForm';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-[1200px] px-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-0 border-b border-stone-200 py-14 md:grid-cols-3 md:gap-12">

          {/* Brand + social */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                AI
              </span>
              <span className="text-sm font-bold text-gray-950">{siteConfig.name}</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Find the best AI tools for commercial real estate.
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              Curated for investors, brokers & operators
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href={`https://linkedin.com/${siteConfig.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition-colors hover:border-brand-200 hover:text-brand-600"
              >
                <Linkedin size={15} aria-hidden="true" />
              </Link>
              <Link
                href={`https://twitter.com/${siteConfig.social.twitter.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition-colors hover:border-brand-200 hover:text-brand-600"
              >
                <Twitter size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Browse links */}
          <div className="mt-10 md:mt-0">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              Browse
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/categories', label: 'Categories' },
                { href: '/blog', label: 'Blog' },
                { href: '/about', label: 'About' },
                { href: '/submit-tool', label: 'Submit a Tool' },
                { href: '/favorites', label: 'Favorites' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-stone-500 transition-colors hover:text-stone-900"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="mt-10 md:mt-0">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              Stay Updated
            </p>
            <p className="mb-4 text-sm leading-6 text-stone-500">
              New CRE AI tools, without the inbox clutter.
            </p>
            <NewsletterForm
              source="footer"
              inputClassName="rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-brand-100 focus-visible:outline-none"
              buttonClassName="rounded-xl border border-brand-600 bg-brand-600 text-white text-sm font-semibold shadow-none transition-colors hover:bg-brand-700"
            />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-stone-400 sm:flex-row">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-stone-700">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-stone-700">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
