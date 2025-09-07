"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import Link from "next/link";
import { computedSiteConfig } from "@/config/site";
export function Hero() {
  const title = computedSiteConfig.hero.title;
  const scrollToDirectory = () => {
    const target = document.getElementById("directory");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      <div className="container text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-gray-900 leading-tight"
          >
            Find the Best AI Tool for Your CRE Business
          </motion.h1>

          {/* SEO-Optimized H2 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl font-medium text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Discover Commercial Real Estate AI tools that fits your business needs or get inspired by AI features developed by real estate innovators.
          </motion.h2>


          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            {/* Primary CTA and Newsletter */}
            <div className="flex flex-row flex-nowrap gap-4 justify-center items-center w-full overflow-x-auto">
              <Button size="lg" onClick={scrollToDirectory} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium whitespace-nowrap flex-shrink-0">
                Browse AI Tools
              </Button>
              
              {/* Newsletter Form Inline */}
              <div className="w-auto">
                <NewsletterForm source="hero-cta" className="w-auto" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
