import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { siteConfig } from '@/config/site';

export function Header() {
  return (
    <header className="sticky top-0 z-[9998] w-full border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-neutral-900">{siteConfig.name}</span>
        </Link>
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {siteConfig.nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex w-96">
            <GlobalSearch 
              className="w-full"
            />
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <img src="/ai-cre-tools-logo.jpg" alt="AI CRE Tools Logo" className="h-6 w-auto" />
                    <span className="font-semibold">{siteConfig.categoryName}</span>
                  </Link>
                  
                  <div className="mb-4">
                    <GlobalSearch 
                      className="w-full"
                    />
                  </div>
                  
                  {siteConfig.nav.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
