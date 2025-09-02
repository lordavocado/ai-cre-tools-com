"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import Link from "next/link";
import { ArrowRight, Search, Zap } from "lucide-react";
import { computedSiteConfig } from "@/config/site";

export function Hero() {
  const title = computedSiteConfig.hero.title;

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      <div className="container text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6"
          >
            <Zap className="h-4 w-4" />
            The #1 Directory for CRE AI Tools
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-gray-900 leading-tight"
          >
            Find the Perfect <span className="text-green-500">AI Tool</span>
            <span className="block text-gray-700">for Your CRE Business</span>
          </motion.h1>

          {/* SEO-Optimized H2 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            Curated directory of 100+ Commercial Real Estate AI tools to find, compare, and choose the right solution in minutes.
          </motion.h2>


          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-12"
          >
            {/* Primary CTA and Newsletter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/categories">
                  <Search className="mr-2 h-5 w-5" />
                  Browse AI Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              {/* Newsletter Form Inline */}
              <NewsletterForm source="hero-cta" className="flex-shrink-0" />
            </div>
            
            {/* Newsletter Description */}
            <p className="text-gray-600 text-sm font-medium text-center">Get new AI tools first</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
