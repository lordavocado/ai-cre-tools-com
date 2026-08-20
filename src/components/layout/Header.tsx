"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useEffect, useState } from 'react';

const GlobalSearch = dynamic(
  () => import('./GlobalSearch').then((mod) => mod.GlobalSearch),
  { ssr: false }
);

/** Site logo mark shown in header and mobile drawer. */
function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
        AI
      </span>
      <span className="text-sm font-bold text-foreground">{siteConfig.name}</span>
    </Link>
  );
}

/**
 * Site-wide sticky header with logo, desktop nav, search pill, CTA, and mobile drawer.
 * @component
 */
export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    document.addEventListener('keydown', handleSearchShortcut);
    return () => document.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  return (
    <>
      {searchOpen && (
        <GlobalSearch
          placeholder="Search tools… (⌘K)"
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}

      <header className="sticky top-0 z-[9998] w-full border-b border-border bg-background backdrop-blur-sm">
        <div className="mx-auto flex h-[50px] max-w-[1200px] items-center justify-between gap-6 px-6">
          <Logo className="shrink-0" />

          <nav className="hidden md:flex md:items-center md:gap-1">
            {siteConfig.nav.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden min-h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-[color,background-color,border-color,transform] duration-150 motion-safe:active:scale-[0.97] hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:flex"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
              <span>Search tools…</span>
            </button>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-[color,background-color,border-color,transform] motion-safe:active:scale-[0.97] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open navigation menu"
                    aria-haspopup="dialog"
                  >
                    <Menu className="h-4 w-4" aria-hidden="true" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="border-l border-border bg-background">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <nav className="mt-8 grid gap-1 text-base font-medium" aria-label="Mobile navigation">
                    <Logo className="mb-4" />
                    {siteConfig.nav.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex min-h-11 items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      <div className="nav-fade-mask pointer-events-none h-8 w-full" />
    </>
  );
}
