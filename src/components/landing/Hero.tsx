"use client";

import Link from "next/link";
import { NewsletterForm } from "@/components/forms/SimpleNewsletterForm";

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
 * Renders a heading, newsletter sign-up (same component as footer), and category chips.
 */
export function Hero({ totalItems, categories = [] }: HeroProps) {
  const count = totalItems > 0 ? `${totalItems}+` : "200+";

  return (
    <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-16 md:py-20">
      <div className="container px-6">
        <div className="mx-auto max-w-[70ch] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
            AI CRE Tools Directory
          </p>
          <h1 className="mt-3 text-balance text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0f172a] sm:text-[48px]">
            Find the Best AI Tools for{" "}
            <br className="hidden sm:block" />
            Commercial Real Estate
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-[16px] leading-relaxed text-[#737373]">
            {count} AI tools for CRE professionals — curated, categorised, and updated weekly. Get new tools in your inbox.
          </p>

          <div className="mx-auto mt-6 flex w-full max-w-sm justify-center sm:max-w-md">
            <NewsletterForm
              source="hero"
              variant="brand"
              size="sm"
              hideFormOnSuccess
              className="w-full"
            />
          </div>

          {/* Category chips — pill shape for secondary nav per DESIGN */}
          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Link
                href="/#directory"
                className="rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#fafafa]"
              >
                All tools
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#fafafa]"
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
