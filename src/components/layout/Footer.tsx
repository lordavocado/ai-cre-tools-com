
import Link from 'next/link';
import { Rocket, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40">
      <div className="container py-12 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Rocket className="h-7 w-7 text-primary" />
              <span className="font-bold text-lg">Sheet2Site Pro</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The ultimate boilerplate for creating SEO-optimized directories using Google Sheets.
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
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></Link>
              <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary"><Github size={20} /></Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Sheet2Site Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
