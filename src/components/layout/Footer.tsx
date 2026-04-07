import Link from 'next/link';
import { Twitter, Linkedin } from 'lucide-react';
import { siteConfig, computedSiteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/forms/SimpleNewsletterForm';

const footerLinks = [
  { href: '/categories', label: 'Categories' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/submit-tool', label: 'Submit Tool' },
];

const socialLinks = [
  {
    href: `https://linkedin.com/${siteConfig.social.linkedin}`,
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: `https://twitter.com/${siteConfig.social.twitter.replace(/^@/, '')}`,
    label: 'Twitter',
    icon: Twitter,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="max-w-md">
                <Link href="/" className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    AI
                  </span>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-slate-950">{siteConfig.name}</span>
                    <span className="text-sm text-slate-500">Commercial real estate software directory</span>
                  </div>
                </Link>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {computedSiteConfig.footer.description}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Curated for investors, brokers, developers, and operators
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Explore</p>
                  <nav className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600 md:grid-cols-1">
                    {footerLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="transition-colors hover:text-slate-950"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Follow</p>
                  <div className="mt-4 flex items-center gap-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-950"
                        >
                          <Icon size={18} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Stay updated</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                New CRE AI tools, without the inbox clutter.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Get occasional updates when new tools, categories, and write-ups are added.
              </p>

              <NewsletterForm
                source="footer"
                className="mt-5"
                fieldsClassName="flex-col sm:flex-row"
                inputClassName="h-11 rounded-xl border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-slate-200"
                buttonClassName="h-11 rounded-xl border-slate-950 bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800 hover:shadow-none hover:shadow-transparent"
              />

              <p className="mt-3 text-xs text-slate-500">
                No spam. Just practical updates for commercial real estate teams.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {currentYear} {computedSiteConfig.footer.copyright}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/privacy-policy" className="transition-colors hover:text-slate-950">Privacy</Link>
              <Link href="/terms-of-service" className="transition-colors hover:text-slate-950">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
