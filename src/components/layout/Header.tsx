import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { siteConfig } from '@/config/site';

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
        AI
      </span>
      <span className="text-sm font-bold text-gray-950">{siteConfig.name}</span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-[9998] w-full border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-6">
        <Logo className="shrink-0" />

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {siteConfig.nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: search + CTA + mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-1 max-w-[260px] min-w-[180px]">
            <GlobalSearch
              className="w-full"
              placeholder="Search tools... (⌘K)"
            />
          </div>

          <Link
            href="/submit-tool"
            className="hidden md:inline-flex items-center rounded-full bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Submit a tool
          </Link>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition-colors hover:bg-stone-50"
                  aria-label="Open navigation menu"
                  aria-haspopup="dialog"
                >
                  <Menu className="h-4 w-4" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-stone-200 bg-white">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="mt-8 grid gap-5 text-base font-medium" aria-label="Mobile navigation">
                  <Logo className="mb-2" />

                  <div className="mb-2">
                    <GlobalSearch className="w-full" />
                  </div>

                  {siteConfig.nav.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-stone-600 transition-colors hover:text-stone-900"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <Link
                    href="/submit-tool"
                    className="inline-flex w-fit items-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                  >
                    Submit a tool
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
