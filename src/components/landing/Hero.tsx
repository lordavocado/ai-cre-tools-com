"use client";

import Link from "next/link";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

/** Minimal category shape needed for the hero chip row */
export interface HeroCategory {
  /** Unique identifier */
  id: string;
  /** URL-safe slug used as the category page path */
  slug: string;
  /** Display label */
  name: string;
}

interface HeroProps {
  /** Total number of directory items — used in the subtitle count */
  totalItems: number;
  /** Category list rendered as navigation chips below the CTA */
  categories?: HeroCategory[];
}

/**
 * Search-first centered hero section for the homepage.
 * Renders a heading, prominent directory search, and category chips.
 */
export function Hero({ totalItems, categories = [] }: HeroProps) {
  const count = totalItems > 0 ? `${totalItems}+` : "200+";

  return (
    <section className="border-b border-border bg-secondary py-12 sm:py-16 md:py-20">
      <div className="container px-6">
        <div className="mx-auto max-w-[70ch] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            AI CRE Tools Directory
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-foreground sm:text-5xl">
            Find the best AI tools for{" "}
            <br className="hidden sm:block" />
            commercial real estate
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
            <span className="tabular-nums">{count}</span> curated AI tools for CRE professionals, updated weekly.
          </p>

          <div className="mx-auto mt-7 w-full max-w-xl text-left">
            <GlobalSearch placeholder="Search tools, capabilities, or workflows…" />
          </div>

          {/* Category chips — pill shape for secondary nav per DESIGN */}
          {categories.length > 0 && (
            <div className="-mx-6 mt-7 flex gap-2 overflow-x-auto px-6 pb-2 scrollbar-none sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
              <Link
                href="/#directory"
                className="shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-[color,background-color,border-color,transform] duration-150 motion-safe:active:scale-[0.97] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                All tools
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-[color,background-color,border-color,transform] duration-150 motion-safe:active:scale-[0.97] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
