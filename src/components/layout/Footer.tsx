import Link from 'next/link';
import { Twitter, Linkedin } from 'lucide-react';
import { siteConfig, computedSiteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/forms/SimpleNewsletterForm';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-neutral-900">{siteConfig.name}</span>
            </Link>
            <p className="mt-2 text-sm text-neutral-500">
              {computedSiteConfig.footer.description}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 mb-3">Stay updated</p>
            <NewsletterForm source="footer" />
          </div>
          <div className="flex flex-col md:items-end md:text-right gap-4">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
              <Link href="/categories" className="hover:text-neutral-900 transition-colors">Categories</Link>
              <Link href="/blog" className="hover:text-neutral-900 transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-neutral-900 transition-colors">About</Link>
              <Link href="/submit-tool" className="hover:text-neutral-900 transition-colors">Submit Tool</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="https://www.linkedin.com/in/nichlaskvist/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-neutral-400 hover:text-neutral-600 transition-colors"><Linkedin size={18} /></Link>
              <Link href="https://x.com/nkjorg" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-neutral-400 hover:text-neutral-600 transition-colors"><Twitter size={18} /></Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
          <p>&copy; {currentYear} {computedSiteConfig.footer.copyright}</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-neutral-600 transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-neutral-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
