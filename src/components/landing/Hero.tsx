"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { computedSiteConfig } from "@/config/site";

export function Hero() {
  const title = computedSiteConfig.hero.title;

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 overflow-hidden">
      <div className="container text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-transparent bg-clip-text 
                         bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 
                         dark:from-white dark:via-blue-200 dark:to-purple-200">
            {title}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            Discover the perfect CRE AI tool for your needs with our comprehensive directory that helps you compare and evaluate top AI solutions for Commercial Real Estate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <div className="inline-block group relative bg-gradient-to-b from-blue-500/10 to-purple-500/10 
                        dark:from-blue-400/10 dark:to-purple-400/10 p-px rounded-2xl backdrop-blur-lg 
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Button asChild size="lg" className="rounded-[1.15rem] shadow-lg backdrop-blur-md 
                            bg-white/95 hover:bg-white/100 dark:bg-slate-900/95 dark:hover:bg-slate-900/100 
                            text-slate-900 dark:text-white transition-all duration-300 
                            group-hover:-translate-y-0.5 border border-blue-200/50 dark:border-blue-800/50
                            hover:shadow-md dark:hover:shadow-blue-900/50">
                <Link href="#directory">
                  Find Tools <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <Button asChild variant="outline" size="lg" className="shadow-lg backdrop-blur-md 
                        bg-white/80 hover:bg-white/90 dark:bg-slate-900/80 dark:hover:bg-slate-900/90 
                        border border-slate-200/50 dark:border-slate-800/50">
              <Link href="/categories">
                Understand Categories
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-md font-semibold mb-3">Stay Updated About New CRE AI Tools</h3>
            <NewsletterForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
