"use client";

import Link from "next/link";
import { subscribeToNewsletter } from "@/app/actions";
import { useActionState } from "react";

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
 * Renders a heading, newsletter sign-up, and category navigation chips.
 * Styling follows `DESIGN.md`: semantic tokens, 44px controls, scarce green accent.
 * @component
 */
export function Hero({ totalItems, categories = [] }: HeroProps) {
  const count = totalItems > 0 ? `${totalItems}+` : "200+";
  const [state, formAction] = useActionState(subscribeToNewsletter, { message: "", success: false });

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

        {/* Newsletter sign-up — 44px touch targets per DESIGN */}
        <div className="mx-auto mt-8 max-w-md">
          {state.success ? (
            <p className="py-3 text-sm font-medium text-foreground">
              You&rsquo;re in! We&rsquo;ll send new CRE AI tools straight to your inbox.
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="source" value="hero" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="search-input-enhanced h-11 min-w-0 flex-1 rounded-md border border-[#e0e0e0] bg-white px-4 text-sm text-[#1f1f1f] shadow-sm outline-none ring-offset-background placeholder:text-[#737373] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-100 hover:bg-primary/90"
              >
                Get updates
              </button>
            </form>
          )}
          {state.message && !state.success && (
            <p className="mt-2 text-xs text-destructive">{state.message}</p>
          )}
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
