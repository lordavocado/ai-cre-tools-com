"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { siteConfig } from '@/config/site';
import { useState } from 'react';

/** Site logo mark shown in header and mobile drawer. */
function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#629649] text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
        AI
      </span>
      <span className="text-sm font-bold text-gray-950">{siteConfig.name}</span>
    </Link>
  );
}

/**
 * Site-wide sticky header with logo, desktop nav, search pill, CTA, and mobile drawer.
 * @component
 */
export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* GlobalSearch overlay — mounted outside header so it can cover full screen */}
      <GlobalSearch
        placeholder="Search tools… (⌘K)"
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <header className="sticky top-0 z-[9998] w-full border-b border-[#e0e0e0] bg-white">
        <div className="mx-auto flex h-[50px] max-w-[1200px] items-center justify-between gap-6 px-6">
          <Logo className="shrink-0" />

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {siteConfig.nav.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-[#737373] transition-colors hover:text-[#1f1f1f]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: search pill + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Search pill trigger — opens GlobalSearch overlay */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-1.5 text-sm text-[#737373] hover:border-[#1f1f1f] hover:text-[#1f1f1f] transition-colors duration-100"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
              <span>Search tools...</span>
            </button>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e0e0e0] bg-white text-[#737373] transition-colors hover:bg-[#fafafa]"
                    aria-label="Open navigation menu"
                    aria-haspopup="dialog"
                  >
                    <Menu className="h-4 w-4" aria-hidden="true" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="border-l border-[#e0e0e0] bg-white">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <nav className="mt-8 grid gap-5 text-base font-medium" aria-label="Mobile navigation">
                    <Logo className="mb-2" />
                    {siteConfig.nav.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-[#737373] transition-colors hover:text-[#1f1f1f]"
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

      {/* Nav fade mask — gradient that softly fades content beneath the header */}
      <div className="nav-fade-mask pointer-events-none h-8 w-full" />
    </>
  );
}
