import Link from 'next/link';
import { Rocket, Twitter, Linkedin, Github, Heart } from 'lucide-react';
import { siteConfig, computedSiteConfig } from '@/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-neutral-900">{siteConfig.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-600">
              {computedSiteConfig.footer.description}
            </p>
            <div className="pt-2 border-t border-neutral-200">
              <div className="flex flex-col space-y-1 text-xs text-neutral-500">
                <Link href="/privacy-policy" className="hover:text-neutral-700 transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-neutral-700 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-900">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="/categories" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Categories</Link>
                <Link href="/blog" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Blog</Link>
                <Link href="/about" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">About</Link>
                <Link href="/submit-tool" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Submit Tool</Link>
              </nav>
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-3">Connect</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Made with <Heart className="h-4 w-4 text-red-500" /> by Nichlas
              </div>
              <div className="flex space-x-4">
                <Link href="https://www.linkedin.com/in/nichlaskvist/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></Link>
                <Link href="https://x.com/nkjorg" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              </div>
              
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {computedSiteConfig.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
