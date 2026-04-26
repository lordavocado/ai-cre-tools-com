"use client";

import Link from "next/link";
import { subscribeToNewsletter } from "@/app/actions";
import { useActionState } from "react";
import { useEffect } from "react";

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

  useEffect(() => {
    if (state.success) {
      // Form submission feedback handled by state.success/message render below
    }
  }, [state]);

  return (
    <section className="relative overflow-hidden bg-background py-[100px]">
      {/* Architectural grid texture */}
      <div className="hero-grid-texture absolute inset-0" aria-hidden="true" />
      {/* Radial gradient — light centre to focus attention on content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(0 0% 100% / 0.96) 0%, hsl(0 0% 100% / 0.55) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      {/* Content — max width matches DESIGN spacing.containerMax (1088px) */}
      <div className="relative z-10 mx-auto max-w-[1088px] px-8 text-center">
        <h1 className="text-balance text-[48px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
          Find the Best AI Tools for{" "}
          <br className="hidden sm:block" />
          Commercial Real Estate
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-[16px] leading-relaxed text-muted-foreground">
          {count} AI tools for CRE professionals — curated, categorised, and updated weekly.
          Get new tools in your inbox.
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
                className="search-input-enhanced h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
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
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              All tools
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
