import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { siteConfig } from '@/config/site';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center pl-6">
        <Link href="/" className="flex items-center gap-2 mr-8" aria-label="Sheet2Site Pro Home">
          <Rocket className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg">{siteConfig.categoryName}</span>
        </Link>
        
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex gap-6 items-center">
            {siteConfig.nav.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex w-64">
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
                    <Rocket className="h-6 w-6 text-primary" />
                    <span className="font-bold">{siteConfig.categoryName}</span>
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
