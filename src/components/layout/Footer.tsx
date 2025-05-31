import Link from 'next/link';
import { Rocket, Twitter, Linkedin, Github, Heart } from 'lucide-react';
import { siteConfig, computedSiteConfig } from '@/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40">
      <div className="container py-12 max-w-screen-2xl pl-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/product-analytics-tools-logo.png" alt="Logo" className="h-7 w-7" />
              <span className="font-bold text-lg">{siteConfig.categoryName}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {computedSiteConfig.footer.description}
            </p>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">Categories</Link></li>
              <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-primary">Guides</Link></li>
              <li><Link href="/compare" className="text-sm text-muted-foreground hover:text-primary">Compare Tools</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
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
              <div className="mt-4">
                <Link href="https://www.productmanagercourses.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                  Looking for product manager courses? Check out Product Manager Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {computedSiteConfig.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
