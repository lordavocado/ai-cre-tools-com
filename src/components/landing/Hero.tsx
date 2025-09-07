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
      {/* Background image anchored to bottom with a smooth white-to-transparent blend from the top */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Top gradient keeps the heading area clean white */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/0" />
        {/* Image only occupies the lower portion to emphasize bottom visuals */}
        <div
          className="absolute left-0 right-0 h-2/3 bg-no-repeat bg-bottom"
          style={{
            bottom: "-32px", // push image further down
            backgroundImage: "url('/hero-background-ai-cre-tools.jpg')",
            backgroundSize: "90%", // zoom out a bit
            backgroundPosition: "center bottom",
          }}
        >
          {/* slight green tint over the image area only */}
          <div className="absolute inset-0 bg-emerald-200/10" />
        </div>
      </div>
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
            Find the Best CRE AI Tools
          </motion.h1>

          {/* SEO-Optimized H2 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base md:text-lg lg:text-xl font-medium text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Discover Commercial Real Estate AI tools that fits your business needs or get inspired by AI features developed by real estate innovators.
          </motion.h2>


          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
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
