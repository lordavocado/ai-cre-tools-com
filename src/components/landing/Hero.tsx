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
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6"
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
            Find the Perfect <span className="text-blue-600">AI Tool</span>
            <span className="block text-gray-700">for Your CRE Business</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            Stop wasting time on endless research. Our curated directory of 100+ Commercial Real Estate AI tools helps you find, compare, and choose the right solution in minutes.
          </motion.p>


          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-row gap-4 justify-center items-center mb-12"
          >
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/categories">
                <Search className="mr-2 h-5 w-5" />
                Browse AI Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
              <Link href="/about">
                How It Works
              </Link>
            </Button>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-md mx-auto"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Get New AI Tools First</h3>
            <p className="text-gray-600 mb-4 text-sm">Be the first to discover cutting-edge CRE AI solutions that can transform your business.</p>
            <NewsletterForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
