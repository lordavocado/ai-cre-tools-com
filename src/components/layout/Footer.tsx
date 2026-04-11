import Link from 'next/link';
import { Twitter, Linkedin } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/forms/SimpleNewsletterForm';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-white">
      <div className="mx-auto max-w-[1200px] px-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-0 border-b border-white/10 py-14 md:grid-cols-3 md:gap-12">

          {/* Brand + social */}
          <div>
            <Link href="/" className="inline-block font-serif text-xl font-bold text-white">
              {siteConfig.name}
            </Link>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Find the best AI tools for commercial real estate
            </p>
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-white/30">
              Curated for investors, brokers, developers, and operators
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href={`https://linkedin.com/${siteConfig.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/50 transition-colors hover:text-white"
              >
                <Linkedin size={18} aria-hidden="true" />
              </Link>
              <Link
                href={`https://twitter.com/${siteConfig.social.twitter.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-white/50 transition-colors hover:text-white"
              >
                <Twitter size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Browse links */}
          <div className="mt-10 md:mt-0">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-white/40">
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
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="mt-10 md:mt-0">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-white/40">
              Stay Updated
            </p>
            <p className="mb-4 text-sm leading-6 text-white/60">
              New CRE AI tools, without the inbox clutter.
            </p>
            <NewsletterForm
              source="footer"
              inputClassName="rounded-none border-2 border-white/30 bg-white/10 text-white placeholder:text-white/30 focus:ring-0 focus:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              buttonClassName="rounded-none border-2 border-white bg-white text-black font-bold shadow-none transition-colors hover:bg-transparent hover:text-white hover:shadow-none"
            />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-white/30 sm:flex-row">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
