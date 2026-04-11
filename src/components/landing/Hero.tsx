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
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-background py-24 md:py-32">
      <div className="relative container px-6">
        <motion.div {...containerProps} className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            Curated for commercial real estate teams
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-950 md:text-7xl">
            Find the best AI tools for{" "}
            <span className="text-brand-500">commercial real estate</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-stone-500 md:text-lg">
            Compare software for investors, developers, brokers, asset managers, and operators —
            one focused directory built for real commercial workflows.
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="mt-8 mx-auto max-w-xl">
            <div className="flex items-center gap-0 rounded-xl border border-stone-200 bg-white shadow-sm focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100 transition-all">
              <label htmlFor="hero-search" className="sr-only">
                Search commercial real estate AI tools
              </label>
              <Search
                className="ml-4 h-4 w-4 shrink-0 text-stone-400"
                aria-hidden="true"
              />
              <input
                id="hero-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search underwriting, due diligence, leasing tools…"
                className="h-12 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="m-1 inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Search
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </form>

          {/* CTA links */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
            >
              Browse categories
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/submit-tool"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              Submit a tool
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center gap-8 border-t border-stone-100 pt-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-950">{totalItems}+</div>
              <div className="mt-0.5 text-xs text-stone-400 uppercase tracking-wider">AI Tools</div>
            </div>
            <div className="h-8 w-px bg-stone-200" aria-hidden="true" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-950">{totalCategories}</div>
              <div className="mt-0.5 text-xs text-stone-400 uppercase tracking-wider">Categories</div>
            </div>
            <div className="h-8 w-px bg-stone-200" aria-hidden="true" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-950">Weekly</div>
              <div className="mt-0.5 text-xs text-stone-400 uppercase tracking-wider">Updates</div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter strip */}
        <div className="mx-auto mt-10 max-w-md">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-stone-400">
            Weekly CRE AI digest
          </p>
          <NewsletterForm
            source="hero"
            inputClassName="rounded-lg border border-stone-200 bg-white text-sm focus:ring-1 focus:ring-brand-200 focus-visible:outline-none"
            buttonClassName="rounded-lg border border-brand-600 bg-brand-600 text-white text-sm font-semibold shadow-none transition-colors hover:bg-brand-700"
          />
        </div>
      </div>
    </section>
  );
}
