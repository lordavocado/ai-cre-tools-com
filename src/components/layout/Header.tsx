import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ArrowUpRight, Menu } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { siteConfig } from '@/config/site';

export function Header() {
  return (
    <header className="sticky top-0 z-[9998] w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold uppercase tracking-[0.2em] text-white">
            AI
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-950">{siteConfig.name}</span>
            <span className="hidden text-xs text-slate-500 sm:block">Commercial real estate software directory</span>
          </div>
        </Link>

        <nav className="hidden md:flex md:items-center md:space-x-8">
          {siteConfig.nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-1 max-w-[320px] min-w-[220px]">
            <GlobalSearch 
              className="w-full"
              placeholder="Search tools, categories... (⌘K)"
            />
          </div>

          <Button asChild variant="outline" size="sm" className="hidden rounded-xl border-slate-300 bg-white lg:inline-flex">
            <Link href="/submit-tool">
              Submit a tool
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl border-slate-300 bg-white"
                  aria-label="Open navigation menu"
                  aria-haspopup="dialog"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="border-l border-slate-200 bg-white"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="grid gap-6 text-lg font-medium mt-8" aria-label="Mobile navigation">
                  <Link href="/" className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                      AI
                    </span>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-slate-950">{siteConfig.name}</span>
                      <span className="text-sm text-slate-500">Commercial real estate software directory</span>
                    </div>
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
                      className="text-slate-600 transition-colors hover:text-slate-950"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <Button asChild className="mt-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                    <Link href="/submit-tool">Submit a tool</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
