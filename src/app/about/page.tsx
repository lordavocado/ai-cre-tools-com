import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { ArrowRight, Building2, TrendingUp, Users, Target, Globe } from 'lucide-react';
import { NewsletterForm } from '@/components/forms/SimpleNewsletterForm';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: `Discover ${siteConfig.name}, the top platform for comparing CRE AI tools. We help professionals find the best solutions.`,
  keywords: [
    'about us',
    'commercial real estate AI',
    'proptech directory',
    'ai tools comparison',
    'real estate technology',
    ...siteConfig.seo.primaryKeywords
  ],
  openGraph: {
    title: `About Us | ${siteConfig.name}`,
    description: `Discover ${siteConfig.name}, the top platform for comparing CRE AI tools. We help professionals find the best solutions.`,
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.seo.openGraph.siteName,
    images: [
      {
        url: siteConfig.seo.openGraph.images.default,
        width: siteConfig.seo.openGraph.images.width,
        height: siteConfig.seo.openGraph.images.height,
        alt: `About ${siteConfig.name}`,
      },
    ],
    locale: siteConfig.seo.openGraph.locale,
    type: 'website',
  },
  twitter: {
    card: siteConfig.seo.twitter.card,
    title: `About Us | ${siteConfig.name}`,
    description: `The leading CRE AI tools directory. Compare & choose the best solutions for your needs.`,
    site: siteConfig.seo.twitter.site,
    creator: siteConfig.seo.twitter.creator,
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: `About ${siteConfig.name}`,
            description: siteConfig.description,
            url: `${siteConfig.url}/about`,
            mainEntity: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/ai-cre-tools-logo.jpg`,
              description: siteConfig.description,
              foundingDate: "2024",
              knowsAbout: [
                "Commercial Real Estate AI",
                "Property Technology",
                "AI Tools Directory",
                "Real Estate Analytics",
                "PropTech Solutions"
              ],
              sameAs: Object.values(siteConfig.social || {}).map(handle => 
                handle.includes('@') ? `https://twitter.com/${handle}` : 
                handle.includes('company/') ? `https://linkedin.com/${handle}` :
                `https://github.com/${handle}`
              )
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "About",
                  item: `${siteConfig.url}/about`
                }
              ]
            }
          }),
        }}
      />

      <div className="bg-white">
        <div className="container py-16 md:py-20 max-w-4xl mx-auto px-6">

          {/* Hero */}
          <div className="mb-14 border-b border-[#e0e0e0] pb-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#737373]">About {siteConfig.name}</p>
            <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#1f1f1f]">
              The CRE AI tools directory built for real workflows
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#737373] max-w-2xl">
              We help commercial real estate professionals discover, compare, and implement the best AI tools —
              organized by how CRE teams actually work, not generic SaaS categories.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <div className="rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-6">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#f0f9f0] text-[#629649]">
                <Target className="h-4 w-4" />
              </div>
              <h2 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Our Mission</h2>
              <p className="text-sm leading-6 text-[#737373]">
                To democratize access to AI technology in commercial real estate by providing comprehensive,
                unbiased information about the best tools available — so every professional can find the
                right software faster.
              </p>
            </div>

            <div className="rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-6">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#f0f9f0] text-[#629649]">
                <Globe className="h-4 w-4" />
              </div>
              <h2 className="mb-2 text-sm font-semibold text-[#1f1f1f]">Our Vision</h2>
              <p className="text-sm leading-6 text-[#737373]">
                To become the definitive resource for CRE AI tools, fostering innovation and
                helping the industry make better technology decisions — from property valuation
                to portfolio management.
              </p>
            </div>
          </div>

          {/* What We Do */}
          <div className="mb-14">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#737373]">What we do</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Building2, title: "Curate AI Tools", desc: "We research and catalog the most relevant AI tools specifically designed for CRE professionals." },
                { icon: TrendingUp, title: "Provide Comparisons", desc: "Our organized categories help you understand the best use case for each tool in your workflow." },
                { icon: Users, title: "Build Community", desc: "We foster a community of forward-thinking professionals who share insights on AI in real estate." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-5">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#f0f9f0] text-[#629649]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-[#1f1f1f]">{title}</h3>
                  <p className="text-sm leading-6 text-[#737373]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Trust Us */}
          <div className="mb-14 rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-8">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#737373]">Why trust {siteConfig.name}?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Independent Research", desc: "We maintain editorial independence and don't accept payment for tool placements. Recommendations are based solely on merit." },
                { title: "Industry Expertise", desc: "Deep knowledge of commercial real estate combined with technical expertise in AI and software evaluation." },
                { title: "Continuous Updates", desc: "The AI landscape evolves rapidly. We continuously monitor new developments and keep the directory current." },
                { title: "User-Focused", desc: "Every feature is designed with the end user in mind, helping you make informed decisions that drive real results." },
              ].map(({ title, desc }) => (
                <div key={title}>
                  <h4 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#1f1f1f]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#629649]" />
                    {title}
                  </h4>
                  <p className="text-sm leading-6 text-[#737373]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mb-14 rounded-[8px] border border-[#b9e5b9] bg-[#f0f9f0] p-8 text-center">
            <h2 className="mb-2 text-base font-semibold text-[#1f1f1f]">Stay updated on new CRE AI tools</h2>
            <p className="mb-5 text-sm text-[#737373]">Weekly digest — no inbox clutter.</p>
            <div className="mx-auto max-w-sm">
              <NewsletterForm
                source="about-page"
                inputClassName="rounded-[6px] border border-[#e0e0e0] bg-white placeholder:text-[#737373] focus:border-[#629649] focus:ring-1 focus:ring-[#629649] focus-visible:outline-none"
                buttonClassName="rounded-[6px] bg-[#629649] text-white font-medium shadow-none transition-colors hover:bg-[#4a7238]"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="mb-3 text-base font-semibold text-[#1f1f1f]">Ready to explore?</h2>
            <p className="mb-6 text-sm text-[#737373] max-w-md mx-auto">
              Browse our directory of {siteConfig.categoryName.toLowerCase()} and find the right tools for your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#629649] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4a7238]"
              >
                Explore Tools <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/#directory"
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#e0e0e0] bg-white px-5 py-2.5 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#fafafa]"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
