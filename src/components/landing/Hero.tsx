"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { NewsletterForm } from "@/components/forms/SimpleNewsletterForm";
import Link from "next/link";
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
    <section className="border-b-2 border-black bg-white py-14 md:py-20">
      <div className="container px-6">
        <motion.div
          {...motionProps}
          className="grid grid-cols-1 border-2 border-black md:grid-cols-5"
        >
          {/* Left column: badge, heading, subtext, search, nav */}
          <div className="px-8 py-10 md:col-span-3 md:border-r-2 md:border-black">
            <div className="mb-8 inline-flex items-center gap-2 border-2 border-black bg-[#9fcc89] px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                Curated for commercial real estate teams
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-black md:text-6xl">
              Find the best commercial real estate AI tools without the noise.
            </h1>

            <p className="mt-5 text-lg leading-7 text-slate-600">
              Compare software for investors, developers, brokers, asset managers, and operators —
              one focused directory built for real commercial workflows.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-8">
              <div className="flex flex-col gap-0 sm:flex-row">
                <label htmlFor="hero-search" className="sr-only">
                  Search commercial real estate AI tools
                </label>
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search underwriting, due diligence, leasing tools…"
                    className="h-12 w-full border-2 border-black bg-white pl-12 pr-4 text-base text-black outline-none placeholder:text-slate-400 focus:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-black sm:border-r-0"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 border-2 border-black bg-black px-6 text-base font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-black"
                >
                  Search
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                Browse categories
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/submit-tool"
                className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                Submit a tool
              </Link>
            </div>
          </div>

          {/* Right column: stats + newsletter */}
          <div className="flex flex-col border-t-2 border-black md:col-span-2 md:border-t-0">
            <div className="grid grid-cols-2 border-b-2 border-black">
              <div className="border-r-2 border-black p-6">
                <div className="font-serif text-4xl font-bold leading-none text-black md:text-5xl">
                  {totalItems}+
                </div>
                <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  AI Tools
                </div>
              </div>
              <div className="p-6">
                <div className="font-serif text-4xl font-bold leading-none text-black md:text-5xl">
                  {totalCategories}
                </div>
                <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Categories
                </div>
              </div>
              <div className="col-span-2 border-t-2 border-black p-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                  Updated Weekly
                </span>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8">
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
                Weekly CRE AI Updates
              </p>
              <NewsletterForm
                source="hero"
                inputClassName="rounded-none border-2 border-black bg-white focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                buttonClassName="rounded-none border-2 border-black bg-black text-white shadow-none transition-colors hover:bg-white hover:text-black hover:shadow-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
