"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import Link from "next/link";
import { computedSiteConfig } from "@/config/site";
import { useEffect, useRef } from "react";

export function Hero() {
  const title = computedSiteConfig.hero.title;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ 
            filter: 'brightness(0.3) blur(1px)'
          }}
        >
          <source src="/ai-cre-tools-hero.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
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
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-white leading-tight"
          >
            Find the Perfect AI Tool for Your CRE Business
          </motion.h1>

          {/* SEO-Optimized H2 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl font-medium text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Discover and compare Commercial Real Estate AI tools. Find the right solution for your business needs.
          </motion.h2>


          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            {/* Primary CTA and Newsletter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium whitespace-nowrap">
                <Link href="/categories">
                  Browse AI Tools
                </Link>
              </Button>
              
              {/* Newsletter Form Inline */}
              <div className="flex-shrink-0">
                <NewsletterForm source="hero-cta" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
