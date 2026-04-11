import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { siteConfig } from '@/config/site';

export function Header() {
  return (
    <header className="sticky top-0 z-[9998] w-full border-b-2 border-black bg-white">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center border-2 border-black bg-black text-xs font-bold uppercase tracking-[0.2em] text-white">
            AI
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-black">{siteConfig.name}</span>
            <span className="hidden text-[10px] font-mono uppercase tracking-widest text-slate-400 sm:block">
              CRE software directory
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {siteConfig.nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: search + mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-1 max-w-[300px] min-w-[200px]">
            <GlobalSearch
              className="w-full"
              placeholder="Search tools, categories... (⌘K)"
            />
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center border-2 border-black bg-white transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-black"
                  aria-label="Open navigation menu"
                  aria-haspopup="dialog"
                >
                  <Menu className="h-4 w-4" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l-2 border-black bg-white"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="mt-8 grid gap-6 text-base font-medium" aria-label="Mobile navigation">
                  <Link href="/" className="mb-2 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center border-2 border-black bg-black text-xs font-bold uppercase tracking-[0.2em] text-white">
                      AI
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-black">{siteConfig.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                        CRE software directory
                      </span>
                    </div>
                  </Link>

                  <div className="mb-2">
                    <GlobalSearch className="w-full" />
                  </div>

                  {siteConfig.nav.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-slate-600 transition-colors hover:text-black"
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
