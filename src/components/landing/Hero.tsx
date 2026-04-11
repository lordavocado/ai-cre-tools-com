"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { NewsletterForm } from "@/components/forms/SimpleNewsletterForm";
import Link from "next/link";

interface HeroProps {
  totalItems: number;
  totalCategories: number;
}

export function Hero({ totalItems, totalCategories }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const params = new URLSearchParams();
    if (trimmedQuery) params.set("search", trimmedQuery);
    const url = params.toString() ? `/?${params.toString()}#directory` : "/#directory";
    router.push(url);
  };

  const containerProps = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease: "easeOut" as const } };

  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-background py-24 md:py-36">
      {/* Soft indigo glow behind content */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(99,102,241,0.07) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative container px-6">
        <motion.div {...containerProps} className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Curated for commercial real estate teams
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-gray-950 md:text-[72px]">
            Find the best AI tools
            <br />
            <span className="text-brand-500">for commercial real estate</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-stone-500 md:text-lg">
            Compare software for investors, brokers, asset managers, and operators —
            one focused directory built for real CRE workflows.
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="mt-9 mx-auto max-w-xl">
            <div className="flex items-center rounded-2xl border border-stone-200 bg-white shadow-md focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100 focus-within:shadow-lg transition-all duration-200">
              <label htmlFor="hero-search" className="sr-only">
                Search commercial real estate AI tools
              </label>
              <Search
                className="ml-4 h-5 w-5 shrink-0 text-stone-400"
                aria-hidden="true"
              />
              <input
                id="hero-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search underwriting, due diligence, leasing tools…"
                className="h-14 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="m-1.5 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Search
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* CTA links */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-5 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 hover:border-brand-300"
            >
              Browse categories
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <span className="h-4 w-px bg-stone-300" aria-hidden="true" />
            <Link
              href="/submit-tool"
              className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
            >
              Submit a tool
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 divide-x divide-stone-200 rounded-2xl border border-stone-200 bg-white/70 shadow-sm backdrop-blur-sm">
            <div className="py-5 text-center">
              <div className="text-4xl font-extrabold tabular-nums text-gray-950">{totalItems}+</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-stone-400">AI Tools</div>
            </div>
            <div className="py-5 text-center">
              <div className="text-4xl font-extrabold tabular-nums text-gray-950">{totalCategories}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-stone-400">Categories</div>
            </div>
            <div className="py-5 text-center">
              <div className="text-4xl font-extrabold text-gray-950">Weekly</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-stone-400">Updates</div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter strip */}
        <div className="mx-auto mt-12 max-w-md">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            Weekly CRE AI digest — free
          </p>
          <NewsletterForm
            source="hero"
            inputClassName="rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-brand-100 focus-visible:outline-none"
            buttonClassName="rounded-xl border border-brand-600 bg-brand-600 text-white text-sm font-semibold shadow-none transition-colors hover:bg-brand-700"
          />
        </div>
      </div>
    </section>
  );
}
