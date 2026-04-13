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
    <section className="relative overflow-hidden bg-white py-[100px]">
      {/* Architectural grid texture */}
      <div className="hero-grid-texture absolute inset-0" aria-hidden="true" />
      {/* Radial gradient — white centre glow to focus attention on content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.6) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1088px] px-8 text-center">
        <h1 className="text-[48px] font-semibold tracking-[-1.2px] leading-[1.1] text-[#1f1f1f]">
          Find the Best AI Tools for{" "}
          <br className="hidden sm:block" />
          Commercial Real Estate
        </h1>
        <p className="mt-4 text-[16px] text-[#737373] max-w-lg mx-auto leading-relaxed">
          {count} AI tools for CRE professionals — curated, categorised, and updated weekly.
          Get new tools in your inbox.
        </p>

        {/* Newsletter sign-up */}
        <div className="mt-8 mx-auto max-w-md">
          {state.success ? (
            <p className="text-sm text-[#629649] font-medium py-3">
              You&rsquo;re in! We&rsquo;ll send new CRE AI tools straight to your inbox.
            </p>
          ) : (
            <form action={formAction} className="flex flex-col sm:flex-row gap-2">
              <input type="hidden" name="source" value="hero" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-[8px] border border-[#e0e0e0] bg-white px-4 text-sm text-[#1f1f1f] placeholder:text-[#999] outline-none focus:border-[#629649] focus:ring-1 focus:ring-[#629649] min-w-0"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-[8px] bg-[#629649] px-5 text-sm font-medium text-white hover:bg-[#4a7238] transition-colors duration-100"
              >
                Get updates
              </button>
            </form>
          )}
          {state.message && !state.success && (
            <p className="mt-2 text-xs text-red-600">{state.message}</p>
          )}
        </div>

        {/* Category navigation chips */}
        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              href="/#directory"
              className="rounded-[6px] bg-[#1f1f1f] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#333]"
            >
              All tools
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="rounded-[6px] border border-[#e0e0e0] bg-[#fafafa] px-3 py-1.5 text-sm text-[#1f1f1f] transition-colors hover:bg-[#efefef] hover:border-[#c8c8c8]"
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
