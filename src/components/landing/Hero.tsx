"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, Database, Search, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DirectoryItem } from "@/types";
import type { DirectorySearchCategory } from "@/components/listing/DirectorySearch";

interface HeroProps {
  featuredItems: DirectoryItem[];
  totalItems: number;
  totalCategories: number;
  categories: DirectorySearchCategory[];
}

function getWebsiteLabel(website: string | undefined) {
  if (!website) {
    return null;
  }

  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

export function Hero({ featuredItems, totalItems, totalCategories, categories }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const quickCategories = useMemo(() => categories.slice(0, 5), [categories]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    const params = new URLSearchParams();

    if (trimmedQuery) {
      params.set("search", trimmedQuery);
    }

    const url = params.toString() ? `/?${params.toString()}#directory` : "/#directory";
    router.push(url);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/?category=${slug}#directory`);
  };

  const motionProps = reduceMotion
    ? { initial: false, animate: undefined, transition: undefined }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55 } };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_44%,_#f8fafc_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40" />
      <div className="absolute left-[-5rem] top-20 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute bottom-0 right-[-4rem] h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="container relative px-6 py-12 md:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
          <motion.div {...motionProps} className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-800 shadow-sm shadow-sky-100/60">
              <ShieldCheck className="h-3.5 w-3.5" />
              Curated for commercial real estate teams
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.02]">
                Find the best commercial real estate AI tools without the noise.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Compare software for investors, developers, brokers, asset managers, property managers, and operators in
                one focused directory built for real commercial workflows.
              </p>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="rounded-[28px] border border-slate-200/80 bg-white/90 p-3 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur"
            >
              <div className="flex flex-col gap-3 md:flex-row">
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
                    placeholder="Search underwriting, due diligence, leasing, or portfolio tools"
                    className="h-14 w-full rounded-2xl border border-transparent bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-2xl bg-slate-950 px-6 text-base font-semibold hover:bg-slate-800"
                >
                  Search directory
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Popular workflows</span>
                {quickCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryClick(category.slug)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </form>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-semibold text-slate-950">{totalItems}+</div>
                <div className="mt-1 text-sm text-slate-600">Profiles ready to compare</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-semibold text-slate-950">{totalCategories}</div>
                <div className="mt-1 text-sm text-slate-600">Workflow categories</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-semibold text-slate-950">Weekly</div>
                <div className="mt-1 text-sm text-slate-600">Directory refresh cadence</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...motionProps}
            transition={reduceMotion ? undefined : { duration: 0.55, delay: 0.12 }}
            className="relative"
          >
            <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_100px_-50px_rgba(15,23,42,0.45)] backdrop-blur">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Featured tools</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Shortlist faster with curated software profiles.</h2>
                </div>
                <div className="hidden rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white sm:block">
                  Updated weekly
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {featuredItems.length > 0 ? (
                  featuredItems.map((item) => {
                    const websiteLabel = getWebsiteLabel(item.website);

                    return (
                      <Link
                        key={item.id}
                        href={`/${item.slug}`}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-semibold text-slate-900 shadow-sm">
                          {item.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-base font-semibold text-slate-950">{item.name}</span>
                            {item.rating ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                                {item.rating.toFixed(1)}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.tagline}</p>
                        </div>
                        {websiteLabel ? (
                          <span className="hidden text-xs font-medium text-slate-500 sm:block">{websiteLabel}</span>
                        ) : null}
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
                    Featured profiles will appear here as soon as your spotlight list is available.
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Database className="h-4 w-4 text-sky-700" />
                    Compare by workflow
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Browse underwriting, due diligence, leasing, and portfolio management software from one directory.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Building2 className="h-4 w-4 text-emerald-700" />
                    Built for CRE teams
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Stay focused on commercial real estate use cases instead of sorting through generic AI software lists.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline" className="rounded-xl border-slate-300 bg-white">
                  <Link href="/categories">
                    Browse categories
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-xl text-slate-700 hover:bg-slate-100">
                  <Link href="/submit-tool">Submit a tool</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
