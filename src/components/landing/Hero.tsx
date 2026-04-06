"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/forms/SimpleNewsletterForm";
import type { DirectoryItem } from "@/types";
import type { DirectorySearchCategory } from "@/components/listing/DirectorySearch";

interface HeroProps {
  featuredItems: DirectoryItem[];
  totalItems: number;
  totalCategories: number;
  categories: DirectorySearchCategory[];
}

export function Hero({ featuredItems: _featuredItems, totalItems, totalCategories, categories }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const quickCategories = useMemo(() => categories.slice(0, 5), [categories]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    const params = new URLSearchParams();
    if (trimmedQuery) params.set("search", trimmedQuery);
    const url = params.toString() ? `/?${params.toString()}#directory` : "/#directory";
    router.push(url);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/?category=${slug}#directory`);
  };

  const motionProps = reduceMotion
    ? { initial: false, animate: undefined, transition: undefined }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  return (
    <section className="border-b border-slate-200 bg-white py-16 md:py-24">
      <div className="container px-6">
        <motion.div {...motionProps} className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Curated for commercial real estate teams
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Find the best commercial real estate AI tools without the noise.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Compare software for investors, developers, brokers, asset managers, and operators — one focused directory
            built for real commercial workflows.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">
                Search commercial real estate AI tools
              </label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="hero-search"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search underwriting, due diligence, leasing tools…"
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <Button
                type="submit"
                className="h-12 rounded-lg bg-slate-950 px-6 text-base font-medium hover:bg-slate-800"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {quickCategories.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Browse:</span>
                {quickCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryClick(category.slug)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
            <span>
              <strong className="font-semibold text-slate-900">{totalItems}+</strong> AI tools
            </span>
            <span className="h-4 w-px bg-slate-200" />
            <span>
              <strong className="font-semibold text-slate-900">{totalCategories}</strong> categories
            </span>
            <span className="h-4 w-px bg-slate-200" />
            <span>Updated weekly</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-lg border-slate-300">
              <Link href="/categories">
                Browse categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-lg text-slate-600 hover:text-slate-900">
              <Link href="/submit-tool">Submit a tool</Link>
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-3">Get weekly updates on new CRE AI tools</p>
            <NewsletterForm source="hero" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
