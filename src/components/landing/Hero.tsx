"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/forms/SimpleNewsletterForm";
import type { DirectoryItem } from "@/types";

interface HeroProps {
  featuredItems: DirectoryItem[];
  totalItems: number;
  totalCategories: number;
}

export function Hero({ featuredItems: _featuredItems, totalItems, totalCategories }: HeroProps) {
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

  const motionProps = reduceMotion
    ? { initial: false, animate: undefined, transition: undefined }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  return (
    <section className="border-b border-slate-200 bg-white py-16 md:py-24">
      <div className="container px-6">
        <motion.div {...motionProps} className="max-w-[46rem]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Curated for commercial real estate teams
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[0.95] tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
            Find the best commercial real estate AI tools.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Compare software for investors, developers, brokers, asset managers, and operators — one focused directory
            built for real commercial workflows.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-3xl">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3">
              <label htmlFor="hero-search" className="sr-only">
                Search commercial real estate AI tools
              </label>
              <div className="relative min-w-0">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="hero-search"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search CRE AI tools..."
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <Button
                type="submit"
                className="h-12 shrink-0 rounded-lg bg-slate-950 px-5 text-base font-medium text-white shadow-sm hover:bg-slate-800 hover:text-white sm:px-6"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span>
              <strong className="font-semibold text-slate-900">{totalItems}+</strong> AI tools
            </span>
            <span>
              <strong className="font-semibold text-slate-900">{totalCategories}</strong> categories
            </span>
          </div>

          <div className="mt-8 max-w-3xl border-t border-slate-200 pt-6">
            <p className="text-sm font-medium text-slate-700 mb-3">Get weekly updates on new CRE AI tools</p>
            <NewsletterForm source="hero" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
